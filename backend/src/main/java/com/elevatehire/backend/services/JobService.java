package com.elevatehire.backend.services;

import com.elevatehire.backend.dto.JobRequest;
import com.elevatehire.backend.entities.*;
import com.elevatehire.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
public class JobService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private ApplicationService applicationService;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobInvitationRepository jobInvitationRepository;

    @Autowired
    private InterviewRepository interviewRepository;

    public List<Job> getJobsByOrganization(Long orgId) {
        return jobRepository.findByOrganizationUserId(orgId);
    }

    public List<Job> getActiveJobs() {
        return jobRepository.findByStatus(JobStatus.ACTIVE);
    }

    public Job getJobById(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }

    @Transactional
    public Job createJob(Long orgId, JobRequest request) {
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        Job job = new Job();
        job.setOrganization(org);
        job.setTitle(request.getTitle());
        job.setDescription(request.getDescription());
        job.setRequiredSkills(request.getRequiredSkills());
        job.setMinExperience(request.getMinExperience());
        job.setOpenPositions(request.getOpenPositions());
        job.setDeadline(request.getDeadline());
        job.setLocation(request.getLocation());

        return jobRepository.save(job);
    }

    @Transactional
    public Job assignInterviewers(Long jobId, Set<Interviewer> interviewers) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        job.getAssignedInterviewers().addAll(interviewers);
        Job savedJob = jobRepository.save(job);
        
        // Trigger auto distribution when interviewers are assigned
        applicationService.distributeCandidatesForJob(jobId);
        
        return savedJob;
    }

    @Transactional
    public void markJobCompleted(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        job.setStatus(JobStatus.COMPLETED);
        jobRepository.save(job);
    }

    @Transactional
    public void deleteJob(Long jobId, Long orgId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));
        
        if (!job.getOrganization().getUserId().equals(orgId)) {
            throw new RuntimeException("You are not authorized to delete this job.");
        }
        
        // Delete all associated Job Invitations
        List<JobInvitation> invitations = jobInvitationRepository.findByJobId(jobId);
        jobInvitationRepository.deleteAll(invitations);
        
        // Delete all associated Applications and their Interviews
        List<Application> applications = applicationRepository.findByJobId(jobId);
        for (Application app : applications) {
            List<Interview> interviews = interviewRepository.findByApplicationId(app.getId());
            interviewRepository.deleteAll(interviews);
        }
        applicationRepository.deleteAll(applications);
        
        jobRepository.delete(job);
    }
}
