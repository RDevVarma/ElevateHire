package com.elevatehire.backend.repositories;

import com.elevatehire.backend.entities.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByCandidateUserId(Long candidateId);
    List<Application> findByJobId(Long jobId);
    List<Application> findByAssignedInterviewerUserId(Long interviewerId);
    boolean existsByJobIdAndCandidateUserId(Long jobId, Long candidateId);
}
