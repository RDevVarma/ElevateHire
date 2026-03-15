package com.elevatehire.backend.controllers;

import com.elevatehire.backend.dto.InterviewFeedbackRequest;
import com.elevatehire.backend.dto.InterviewScheduleRequest;
import com.elevatehire.backend.entities.Interview;
import com.elevatehire.backend.services.InterviewService;
import com.elevatehire.backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    @PreAuthorize("hasRole('INTERVIEWER')")
    @PostMapping("/schedule/{applicationId}")
    public ResponseEntity<Interview> scheduleInterview(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                       @PathVariable Long applicationId,
                                                       @RequestBody InterviewScheduleRequest request) {
        Interview interview = interviewService.scheduleInterview(
                applicationId, userDetails.getId(), request.getInterviewDate(), 
                request.getInterviewTime(), request.getMode(), request.getMeetingLink());
        return ResponseEntity.ok(interview);
    }

    @PreAuthorize("hasRole('INTERVIEWER')")
    @GetMapping("/my-interviews")
    public ResponseEntity<List<Interview>> getInterviewerInterviews(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(interviewService.getInterviewerInterviews(userDetails.getId()));
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/candidate")
    public ResponseEntity<List<Interview>> getCandidateInterviews(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(interviewService.getCandidateInterviews(userDetails.getId()));
    }

    @PreAuthorize("hasRole('ORG')")
    @GetMapping("/application/{applicationId}")
    public ResponseEntity<List<Interview>> getApplicationInterviews(@PathVariable Long applicationId) {
        List<Interview> interviews = interviewService.getInterviewsByApplication(applicationId);
        System.out.println("Fetched interviews for app " + applicationId + ": size=" + interviews.size());
        if (!interviews.isEmpty()) {
            System.out.println("First interview technical rating: " + interviews.get(0).getTechnicalRating());
            System.out.println("First interview overall assessment: " + interviews.get(0).getOverallAssessment());
            System.out.println("First interview DTO: " + interviews.get(0).toString());
        }
        return ResponseEntity.ok(interviews);
    }

    @PreAuthorize("hasRole('INTERVIEWER')")
    @PostMapping("/{interviewId}/feedback")
    public ResponseEntity<Interview> submitFeedback(@PathVariable Long interviewId,
                                                    @RequestBody InterviewFeedbackRequest request) {
        Interview interview = interviewService.submitFeedback(interviewId, request);
        return ResponseEntity.ok(interview);
    }

    @PreAuthorize("hasRole('ORG')")
    @GetMapping("/org")
    public ResponseEntity<List<Interview>> getOrgInterviews(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(interviewService.getCompletedInterviewsForOrg(userDetails.getId()));
    }
}
