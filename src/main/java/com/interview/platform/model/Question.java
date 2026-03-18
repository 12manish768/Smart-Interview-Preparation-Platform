package com.interview.platform.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "questions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", nullable = false)
    private InterviewSession session;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String questionText;

    @Column(columnDefinition = "TEXT")
    private String userAnswer;

    @Column(columnDefinition = "TEXT")
    private String aiAnalysis;

    private Integer score;
}
