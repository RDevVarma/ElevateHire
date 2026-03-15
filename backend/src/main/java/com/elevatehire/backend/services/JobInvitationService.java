package com.elevatehire.backend.services;

import com.elevatehire.backend.entities.*;
import com.elevatehire.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class JobInvitationService {

    @Autowired
    private JobInvitationRepository invitationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private InterviewerRepository interviewerRepository;

    @Autowired
    private JobService jobService;

    @Transactional
    public JobInvitation sendInvitation(Long orgUserId, Long jobId, Long interviewerUserId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        if (!job.getOrganization().getUser().getId().equals(orgUserId)) {
            throw new RuntimeException("Not authorized to invite for this job");
        }

        if (invitationRepository.existsByJobIdAndInterviewerUserId(jobId, interviewerUserId)) {
            throw new RuntimeException("An invitation to this interviewer for this job already exists");
        }

        Interviewer interviewer = interviewerRepository.findById(interviewerUserId)
                .orElseThrow(() -> new RuntimeException("Interviewer not found"));

        JobInvitation invitation = new JobInvitation();
        invitation.setJob(job);
        invitation.setInterviewer(interviewer);
        
        return invitationRepository.save(invitation);
    }

    public List<JobInvitation> getMyInvitations(Long interviewerUserId) {
        return invitationRepository.findByInterviewerUserId(interviewerUserId);
    }

    public List<JobInvitation> getJobInvitations(Long jobId, Long orgUserId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        if (!job.getOrganization().getUser().getId().equals(orgUserId)) {
            throw new RuntimeException("Not authorized to view invitations for this job");
        }
        return invitationRepository.findByJobId(jobId);
    }

    @Transactional
    public JobInvitation respondToInvitation(Long interviewerUserId, Long invitationId, boolean accept) {
        JobInvitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new RuntimeException("Invitation not found"));

        if (!invitation.getInterviewer().getUser().getId().equals(interviewerUserId)) {
            throw new RuntimeException("Not authorized to respond to this invitation");
        }

        if (accept) {
            invitation.setStatus(InvitationStatus.ACCEPTED);
            // Auto add to job
            jobService.assignInterviewers(invitation.getJob().getId(), java.util.Set.of(invitation.getInterviewer()));
        } else {
            invitation.setStatus(InvitationStatus.DECLINED);
        }

        return invitationRepository.save(invitation);
    }
}
