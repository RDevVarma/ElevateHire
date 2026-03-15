package com.elevatehire.backend.services;

import com.elevatehire.backend.entities.*;
import com.elevatehire.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Transactional
    public Application applyForJob(Long candidateId, Long jobId) {
        if (applicationRepository.existsByJobIdAndCandidateUserId(jobId, candidateId)) {
            throw new RuntimeException("Candidate has already applied for this job");
        }

        Candidate candidate = candidateRepository.findById(candidateId)
                .orElseThrow(() -> new RuntimeException("Candidate not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new RuntimeException("Job not found"));

        Application application = new Application();
        application.setCandidate(candidate);
        application.setJob(job);
        
        return applicationRepository.save(application);
    }

    public List<Application> getCandidateApplications(Long candidateId) {
        return applicationRepository.findByCandidateUserId(candidateId);
    }

    public List<Application> getJobApplications(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    public List<Application> getInterviewerAssignedApplications(Long interviewerId) {
        return applicationRepository.findByAssignedInterviewerUserId(interviewerId);
    }

    @Transactional
    public void updateApplicationStatus(Long applicationId, ApplicationStatus status) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        application.setStatus(status);
        applicationRepository.save(application);
    }

    @Transactional
    public void distributeCandidatesForJob(Long jobId) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new RuntimeException("Job not found"));
        if (job.getAssignedInterviewers().isEmpty()) {
            return; // No interviewers to distribute to yet
        }

        List<Application> unassignedApps = applicationRepository.findByJobId(jobId).stream()
                .filter(a -> a.getAssignedInterviewer() == null)
                .toList();

        List<Interviewer> interviewers = new ArrayList<>(job.getAssignedInterviewers());
        int interviewerCount = interviewers.size();

        for (int i = 0; i < unassignedApps.size(); i++) {
            Application app = unassignedApps.get(i);
            Interviewer assigned = interviewers.get(i % interviewerCount);
            app.setAssignedInterviewer(assigned);
            applicationRepository.save(app);
        }
    }
}
