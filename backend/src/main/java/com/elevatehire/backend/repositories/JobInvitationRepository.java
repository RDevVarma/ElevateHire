package com.elevatehire.backend.repositories;

import com.elevatehire.backend.entities.JobInvitation;
import com.elevatehire.backend.entities.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobInvitationRepository extends JpaRepository<JobInvitation, Long> {
    List<JobInvitation> findByInterviewerUserId(Long interviewerUserId);
    List<JobInvitation> findByInterviewerUserIdAndStatus(Long interviewerUserId, InvitationStatus status);
    List<JobInvitation> findByJobId(Long jobId);
    boolean existsByJobIdAndInterviewerUserId(Long jobId, Long interviewerUserId);
}
