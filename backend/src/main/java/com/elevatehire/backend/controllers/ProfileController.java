package com.elevatehire.backend.controllers;

import com.elevatehire.backend.dto.*;
import com.elevatehire.backend.entities.*;
import com.elevatehire.backend.services.ProfileService;
import com.elevatehire.backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    // CANDIDATE Endpoints
    @PreAuthorize("hasRole('CANDIDATE')")
    @GetMapping("/candidate")
    public ResponseEntity<Candidate> getCandidateProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(profileService.getCandidateProfile(userDetails.getId()));
    }

    @PreAuthorize("hasRole('CANDIDATE')")
    @PutMapping("/candidate")
    public ResponseEntity<Candidate> updateCandidateProfile(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                            @RequestBody CandidateProfileUpdateRequest request) {
        return ResponseEntity.ok(profileService.updateCandidateProfile(userDetails.getId(), request));
    }

    // INTERVIEWER Endpoints
    @PreAuthorize("hasRole('INTERVIEWER')")
    @GetMapping("/interviewer")
    public ResponseEntity<Interviewer> getInterviewerProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(profileService.getInterviewerProfile(userDetails.getId()));
    }
    
    // ORG viewing an INTERVIEWER (e.g., when assigning)
    @PreAuthorize("hasRole('ORG')")
    @GetMapping("/interviewer/{interviewerId}")
    public ResponseEntity<Interviewer> getInterviewerById(@PathVariable Long interviewerId) {
        return ResponseEntity.ok(profileService.getInterviewerProfile(interviewerId));
    }

    @PreAuthorize("hasRole('INTERVIEWER')")
    @PutMapping("/interviewer")
    public ResponseEntity<Interviewer> updateInterviewerProfile(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                @RequestBody InterviewerProfileUpdateRequest request) {
        return ResponseEntity.ok(profileService.updateInterviewerProfile(userDetails.getId(), request));
    }

    // ORGANIZATION Endpoints
    @PreAuthorize("hasRole('ORG')")
    @GetMapping("/organization")
    public ResponseEntity<Organization> getOrganizationProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(profileService.getOrganizationProfile(userDetails.getId()));
    }

    @PreAuthorize("hasRole('ORG')")
    @PutMapping("/organization")
    public ResponseEntity<Organization> updateOrganizationProfile(@AuthenticationPrincipal CustomUserDetails userDetails,
                                                                  @RequestBody OrgProfileUpdateRequest request) {
        return ResponseEntity.ok(profileService.updateOrganizationProfile(userDetails.getId(), request));
    }
}
