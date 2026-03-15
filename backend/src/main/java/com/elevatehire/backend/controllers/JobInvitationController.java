package com.elevatehire.backend.controllers;

import com.elevatehire.backend.entities.JobInvitation;
import com.elevatehire.backend.services.JobInvitationService;
import com.elevatehire.backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.elevatehire.backend.entities.Interviewer;
import com.elevatehire.backend.repositories.InterviewerRepository;

import java.util.List;

@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
@RestController
@RequestMapping("/api/invitations")
public class JobInvitationController {

    @Autowired
    private JobInvitationService invitationService;

    @Autowired
    private InterviewerRepository interviewerRepository;

    @PreAuthorize("hasRole('ORG')")
    @PostMapping("/send")
    public ResponseEntity<JobInvitation> sendInvitation(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @RequestParam Long jobId,
            @RequestParam Long interviewerUserId) {
        JobInvitation invite = invitationService.sendInvitation(userDetails.getId(), jobId, interviewerUserId);
        return ResponseEntity.ok(invite);
    }

    @PreAuthorize("hasRole('ORG')")
    @GetMapping("/search-interviewers")
    public ResponseEntity<List<Interviewer>> searchInterviewers(@RequestParam String skill) {
        return ResponseEntity.ok(interviewerRepository.findBySkillsContainingIgnoreCase(skill));
    }

    @PreAuthorize("hasRole('ORG')")
    @GetMapping("/job/{jobId}")
    public ResponseEntity<List<JobInvitation>> getJobInvitations(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long jobId) {
        return ResponseEntity.ok(invitationService.getJobInvitations(jobId, userDetails.getId()));
    }

    @PreAuthorize("hasRole('INTERVIEWER')")
    @GetMapping("/my-invites")
    public ResponseEntity<List<JobInvitation>> getMyInvitations(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(invitationService.getMyInvitations(userDetails.getId()));
    }

    @PreAuthorize("hasRole('INTERVIEWER')")
    @PostMapping("/{invitationId}/respond")
    public ResponseEntity<JobInvitation> respondToInvitation(
            @AuthenticationPrincipal CustomUserDetails userDetails,
            @PathVariable Long invitationId,
            @RequestParam boolean accept) {
        JobInvitation updated = invitationService.respondToInvitation(userDetails.getId(), invitationId, accept);
        return ResponseEntity.ok(updated);
    }
}
