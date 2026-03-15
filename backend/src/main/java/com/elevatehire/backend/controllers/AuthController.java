package com.elevatehire.backend.controllers;

import com.elevatehire.backend.dto.*;
import com.elevatehire.backend.services.AuthService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            JwtResponse response = authService.authenticateUser(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Invalid credentials"));
        }
    }

    @PostMapping("/register/candidate")
    public ResponseEntity<?> registerCandidate(@Valid @RequestBody CandidateRegistrationRequest request) {
        try {
            MessageResponse response = authService.registerCandidate(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/register/interviewer")
    public ResponseEntity<?> registerInterviewer(@Valid @RequestBody InterviewerRegistrationRequest request) {
        try {
            MessageResponse response = authService.registerInterviewer(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @PostMapping("/register/organization")
    public ResponseEntity<?> registerOrganization(@Valid @RequestBody OrgRegistrationRequest request) {
        try {
            MessageResponse response = authService.registerOrganization(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}
