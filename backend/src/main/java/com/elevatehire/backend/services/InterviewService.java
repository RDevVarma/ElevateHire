package com.elevatehire.backend.services;

import com.elevatehire.backend.dto.InterviewFeedbackRequest;
import com.elevatehire.backend.entities.*;
import com.elevatehire.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class InterviewService {

    @Autowired
    private InterviewRepository interviewRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private InterviewerRepository interviewerRepository;

    @Transactional
    public Interview scheduleInterview(Long applicationId, Long interviewerId, LocalDate date, LocalTime time, String mode, String link) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));
        
        Interviewer interviewer = interviewerRepository.findById(interviewerId)
                .orElseThrow(() -> new RuntimeException("Interviewer not found"));

        if (!interviewer.getUserId().equals(application.getAssignedInterviewer().getUserId())) {
            throw new RuntimeException("This interviewer is not assigned to this candidate.");
        }

        Interview interview = new Interview();
        interview.setApplication(application);
        interview.setInterviewer(interviewer);
        interview.setInterviewDate(date);
        interview.setInterviewTime(time);
        interview.setMode(mode);
        interview.setMeetingLink(link);

        application.setStatus(ApplicationStatus.INTERVIEW_SCHEDULED);
        applicationRepository.save(application);

        return interviewRepository.save(interview);
    }

    public List<Interview> getCandidateInterviews(Long candidateId) {
        return interviewRepository.findByApplicationCandidateUserId(candidateId);
    }

    public List<Interview> getInterviewerInterviews(Long interviewerId) {
        return interviewRepository.findByInterviewerUserId(interviewerId);
    }
    
    public List<Interview> getInterviewsByApplication(Long applicationId) {
        return interviewRepository.findByApplicationId(applicationId);
    }

    @Transactional
    public Interview submitFeedback(Long interviewId, InterviewFeedbackRequest request) {
        Interview interview = interviewRepository.findById(interviewId)
                .orElseThrow(() -> new RuntimeException("Interview not found"));

        interview.setTechnicalRating(request.getTechnicalRating());
        interview.setCommunicationRating(request.getCommunicationRating());
        interview.setProblemSolvingRating(request.getProblemSolvingRating());
        interview.setOverallAssessment(request.getOverallAssessment());
        interview.setRecommendation(request.getRecommendation());
        interview.setStatus(InterviewStatus.COMPLETED);

        Application application = interview.getApplication();
        application.setStatus(ApplicationStatus.INTERVIEW_COMPLETED);
        applicationRepository.save(application);

        return interviewRepository.save(interview);
    }

    public List<Interview> getCompletedInterviewsForOrg(Long orgId) {
        return interviewRepository.findByApplicationJobOrganizationUserIdAndStatus(orgId, InterviewStatus.COMPLETED);
    }
}
