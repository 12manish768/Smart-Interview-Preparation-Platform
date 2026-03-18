package com.interview.platform.repository;

import com.interview.platform.model.EvaluationReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EvaluationReportRepository extends JpaRepository<EvaluationReport, Long> {
}
