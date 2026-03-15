package com.elevatehire.backend.controllers;

import com.elevatehire.backend.dto.MessageResponse;
import com.elevatehire.backend.entities.Application;
import com.elevatehire.backend.entities.ApplicationStatus;
import com.elevatehire.backend.services.ApplicationService;
import com.elevatehire.backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    @Autowired
    private ApplicationService applicationService;

    @PreAuthorize("hasRole('CANDIDATE')")
    @PostMapping("/apply/{jobId}")
    public ResponseEntity<Application> applyForJob(@AuthenticationPrincipal CustomUserDetails userDetails, 
                                                   @PathVariable Long jobId) {
        Application application = applicationService.applyForJob(userDetails.getId(), jobId);
        return ResponseEntity.ok(application);
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/my-applications")
    public ResponseEntity<List<Application>> getMyApplications(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(applicationService.getCandidateApplications(userDetails.getId()));
    }

    @PreAuthorize("hasRole('ORG')")
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<Application>> getJobApplications(@PathVariable Long jobId) {
        return ResponseEntity.ok(applicationService.getJobApplications(jobId));
    }

    @PreAuthorize("hasRole('INTERVIEWER')")
    @GetMapping("/assigned")
    public ResponseEntity<List<Application>> getAssignedApplications(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(applicationService.getInterviewerAssignedApplications(userDetails.getId()));
    }

    @PreAuthorize("hasRole('ORG')")
    @PatchMapping("/{applicationId}/status")
    public ResponseEntity<MessageResponse> updateStatus(@PathVariable Long applicationId, 
                                                        @RequestParam ApplicationStatus status) {
        applicationService.updateApplicationStatus(applicationId, status);
        return ResponseEntity.ok(new MessageResponse("Application status updated to " + status));
    }
}
