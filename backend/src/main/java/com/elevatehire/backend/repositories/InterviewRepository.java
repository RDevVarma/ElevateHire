package com.elevatehire.backend.repositories;

import com.elevatehire.backend.entities.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByInterviewerUserId(Long interviewerId);
    List<Interview> findByApplicationCandidateUserId(Long candidateId);
    List<Interview> findByApplicationId(Long applicationId);
    List<Interview> findByApplicationJobOrganizationUserIdAndStatus(Long orgId, com.elevatehire.backend.entities.InterviewStatus status);
}
