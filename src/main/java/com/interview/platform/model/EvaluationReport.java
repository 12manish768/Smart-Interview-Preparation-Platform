package com.interview.platform.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "evaluation_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class EvaluationReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id", unique = true, nullable = false)
    private InterviewSession session;

    private Integer overallScore;

    @Column(columnDefinition = "TEXT")
    private String strengths;

    @Column(columnDefinition = "TEXT")
    private String weaknesses;

    @Column(columnDefinition = "TEXT")
    private String actionableTips;

    @Column(columnDefinition = "TEXT")
    private String fullJsonReport;
}
