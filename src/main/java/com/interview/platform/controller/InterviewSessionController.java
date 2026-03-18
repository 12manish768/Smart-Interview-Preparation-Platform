package com.interview.platform.controller;

import com.interview.platform.model.InterviewSession;
import com.interview.platform.model.User;
import com.interview.platform.repository.InterviewSessionRepository;
import com.interview.platform.dto.DashboardStatsDTO;
import com.interview.platform.repository.UserRepository;
import com.interview.platform.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/interviews")
@RequiredArgsConstructor
public class InterviewSessionController {

    private final InterviewSessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final InterviewService interviewService;

    @GetMapping("/history")
    public ResponseEntity<List<InterviewSession>> getHistory() {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            return ResponseEntity.status(401).build();
        }
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return ResponseEntity.ok(sessionRepository.findByUserOrderByStartTimeDesc(user));
    }

    @GetMapping("/stats")
    public ResponseEntity<DashboardStatsDTO> getStats() {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<InterviewSession> sessions = sessionRepository.findByUserOrderByStartTimeDesc(user);
        
        long total = sessions.size();
        
        double avgScore = sessions.stream()
                .filter(s -> s.getEvaluationReport() != null)
                .mapToInt(s -> s.getEvaluationReport().getOverallScore())
                .average()
                .orElse(0.0);
        
        String expertise = sessions.stream()
                .collect(Collectors.groupingBy(InterviewSession::getTopic, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("None");
        
        double hours = sessions.stream()
                .filter(s -> s.getStartTime() != null && s.getEndTime() != null)
                .mapToLong(s -> Duration.between(s.getStartTime(), s.getEndTime()).toMinutes())
                .sum() / 60.0;
        
        return ResponseEntity.ok(DashboardStatsDTO.builder()
                .totalInterviews(total)
                .averageScore(Math.round(avgScore * 10.0) / 10.0)
                .coreExpertise(expertise)
                .hoursPracticed(Math.round(hours * 10.0) / 10.0)
                .build());
    }

    @PostMapping("/start")
    public ResponseEntity<InterviewSession> startSession(@RequestBody Map<String, String> request) {
        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return ResponseEntity.ok(interviewService.startSession(
                request.get("topic"),
                request.get("difficulty"),
                userDetails.getUsername()
        ));
    }

    @PostMapping("/{sessionId}/next")
    public ResponseEntity<Map<String, String>> generateNext(@PathVariable Long sessionId) {
        String question = interviewService.generateNextQuestion(sessionId);
        return ResponseEntity.ok(Map.of("question", question));
    }

    @PostMapping("/{sessionId}/answer")
    public ResponseEntity<Void> submitAnswer(@PathVariable Long sessionId, @RequestBody Map<String, String> request) {
        interviewService.submitAnswer(sessionId, request.get("answer"));
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{sessionId}/end")
    public ResponseEntity<Void> endSession(@PathVariable Long sessionId) {
        interviewService.endSession(sessionId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{sessionId}")
    public ResponseEntity<InterviewSession> getSession(@PathVariable Long sessionId) {
        return ResponseEntity.ok(sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found")));
    }
}
