package com.interview.platform.repository;
 
import com.interview.platform.model.InterviewSession;
import com.interview.platform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
 
@Repository
public interface InterviewSessionRepository extends JpaRepository<InterviewSession, Long> {
    List<InterviewSession> findByUserOrderByStartTimeDesc(User user);
}
