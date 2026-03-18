package com.interview.platform.service;

import com.interview.platform.model.EvaluationReport;
import com.interview.platform.model.InterviewSession;
import com.interview.platform.model.Question;
import com.interview.platform.model.User;
import com.interview.platform.repository.EvaluationReportRepository;
import com.interview.platform.repository.InterviewSessionRepository;
import com.interview.platform.repository.QuestionRepository;
import com.interview.platform.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class InterviewService {

    private final GeminiService geminiService;
    private final InterviewSessionRepository sessionRepository;
    private final QuestionRepository questionRepository;
    private final UserRepository userRepository;
    private final EvaluationReportRepository evaluationReportRepository;

    @Transactional
    public InterviewSession startSession(String topic, String difficulty, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        InterviewSession session = InterviewSession.builder()
                .user(user)
                .topic(topic)
                .difficulty(difficulty)
                .startTime(LocalDateTime.now())
                .status(InterviewSession.Status.IN_PROGRESS)
                .questions(new ArrayList<>())
                .build();

        session = sessionRepository.save(session);
        return session;
    }

    @Transactional
    public String generateNextQuestion(Long sessionId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        StringBuilder prompt = new StringBuilder();
        prompt.append("You are an expert technical interviewer for ").append(session.getTopic()).append(". ");
        prompt.append("Difficulty level: ").append(session.getDifficulty()).append(". ");
        
        if ("EASY".equalsIgnoreCase(session.getDifficulty())) {
            prompt.append("Important: Ask short, high-level, and easy questions that cover basic fundamentals. Avoid deep technical complexity and keep questions very beginner-friendly. ");
        } else if ("HARD".equalsIgnoreCase(session.getDifficulty())) {
            prompt.append("Important: Ask deep, complex, and highly challenging technical questions. Focus on advanced patterns, edge cases, and architectural trade-offs to test for senior-level expertise. ");
        } else {
            prompt.append("Important: Ask moderately challenging questions that require a solid understanding of core concepts and some practical experience. ");
        }
        
        if (session.getQuestions().isEmpty()) {
            prompt.append("Ask the first question. Avoid any greetings, just ask the question directly in 1-2 lines. ");
        } else {
            prompt.append("Previously asked questions and user answers were: ");
            for (Question q : session.getQuestions()) {
                prompt.append("\nQ: ").append(q.getQuestionText());
                prompt.append("\nA: ").append(q.getUserAnswer());
            }
            prompt.append("\nStrict constraint: Generate the next unique question (don't duplicate). The question MUST be very brief, limited to ONLY 2 or 3 lines maximum. Do not include any filler like 'Excellent' or 'Moving on'. Ask the question directly.");
        }

        String nextQuestionText = geminiService.generateContent(prompt.toString());

        Question question = Question.builder()
                .session(session)
                .questionText(nextQuestionText)
                .build();

        questionRepository.save(question);
        return nextQuestionText;
    }

    @Transactional
    public void submitAnswer(Long sessionId, String answer) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (session.getQuestions().isEmpty()) {
            throw new RuntimeException("No questions to answer in this session");
        }

        // Get current question (last one added)
        Question currentQuestion = session.getQuestions().get(session.getQuestions().size() - 1);
        currentQuestion.setUserAnswer(answer);
        questionRepository.save(currentQuestion);
    }

    @Transactional
    public void endSession(Long sessionId) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        session.setEndTime(LocalDateTime.now());
        session.setStatus(InterviewSession.Status.COMPLETED);

        // Fallback default values
        int score = 75;
        String strengths = "Strong communication and clear reasoning.";
        String weaknesses = "Could provide more specific technical examples.";
        String tips = "1. Review fundamental concepts\n2. Practice coding more";
        String aiReportJson = "{}";

        try {
            // Generate AI Evaluation
            StringBuilder reportPrompt = new StringBuilder();
            reportPrompt.append("As an evaluator, analyze this interview session: ").append(session.getTopic()).append("\n");
            reportPrompt.append("Difficulty level: ").append(session.getDifficulty()).append("\n");
            for (Question q : session.getQuestions()) {
                reportPrompt.append("Q: ").append(q.getQuestionText()).append("\n");
                reportPrompt.append("A: ").append(q.getUserAnswer() != null ? q.getUserAnswer() : "No answer").append("\n");
            }
            reportPrompt.append("\nStrictly return ONLY a JSON object: { \"overallScore\": 0-100, \"strengths\": \"brief\", \"weaknesses\": \"brief\", \"actionableTips\": \"brief\" }. No preamble.");

            aiReportJson = geminiService.generateContent(reportPrompt.toString());
            
            // Log for debugging
            System.out.println("AI EVALUATION RAW: " + aiReportJson);

            // Robust extraction
            score = extractInt(aiReportJson, "overallScore", 75);
            strengths = extractString(aiReportJson, "strengths", strengths);
            weaknesses = extractString(aiReportJson, "weaknesses", weaknesses);
            tips = extractString(aiReportJson, "actionableTips", tips);

        } catch (Exception e) {
            System.err.println("AI evaluation error: " + e.getMessage());
        }

        EvaluationReport report = EvaluationReport.builder()
                .session(session)
                .overallScore(score)
                .strengths(strengths)
                .weaknesses(weaknesses)
                .actionableTips(tips)
                .fullJsonReport(aiReportJson)
                .build();

        evaluationReportRepository.save(report);
        session.setEvaluationReport(report);
        sessionRepository.save(session);
    }

    private int extractInt(String json, String key, int fallback) {
        Pattern pattern = Pattern.compile("\"" + key + "\"\\s*:\\s*(\\d+)");
        Matcher matcher = pattern.matcher(json);
        return matcher.find() ? Integer.parseInt(matcher.group(1)) : fallback;
    }

    private String extractString(String json, String key, String fallback) {
        Pattern pattern = Pattern.compile("\"" + key + "\"\\s*:\\s*\"([^\"]*)\"");
        Matcher matcher = pattern.matcher(json);
        return matcher.find() ? matcher.group(1).trim() : fallback;
    }
}
