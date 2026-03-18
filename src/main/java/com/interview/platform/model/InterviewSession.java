package com.interview.platform.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "interview_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String topic;

    @Column(nullable = false)
    private String difficulty;

    @Column(name = "start_time", nullable = false)
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Enumerated(EnumType.STRING)
    private Status status;

    public enum Status {
        IN_PROGRESS, COMPLETED, CANCELLED
    }

    @OneToMany(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions;

    @OneToOne(mappedBy = "session", cascade = CascadeType.ALL, orphanRemoval = true)
    private EvaluationReport evaluationReport;
}
