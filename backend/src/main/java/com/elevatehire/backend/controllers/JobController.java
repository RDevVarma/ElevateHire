package com.elevatehire.backend.controllers;

import com.elevatehire.backend.dto.JobRequest;
import com.elevatehire.backend.dto.MessageResponse;
import com.elevatehire.backend.entities.Interviewer;
import com.elevatehire.backend.entities.Job;
import com.elevatehire.backend.services.JobService;
import com.elevatehire.backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/api/jobs")
public class JobController {

    @Autowired
    private JobService jobService;

    @GetMapping("/active")
    public ResponseEntity<List<Job>> getActiveJobs() {
        return ResponseEntity.ok(jobService.getActiveJobs());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getJobById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PreAuthorize("hasRole('ORG')")
    @PostMapping
    public ResponseEntity<Job> createJob(@AuthenticationPrincipal CustomUserDetails userDetails, 
                                         @RequestBody JobRequest request) {
        Job job = jobService.createJob(userDetails.getId(), request);
        return ResponseEntity.ok(job);
    }

    @PreAuthorize("hasRole('ORG')")
    @GetMapping("/org")
    public ResponseEntity<List<Job>> getOrgJobs(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(jobService.getJobsByOrganization(userDetails.getId()));
    }



    @PreAuthorize("hasRole('ORG')")
    @PatchMapping("/{jobId}/complete")
    public ResponseEntity<MessageResponse> markJobCompleted(@PathVariable Long jobId) {
        jobService.markJobCompleted(jobId);
        return ResponseEntity.ok(new MessageResponse("Job marked as completed."));
    }

    @PreAuthorize("hasRole('ORG')")
    @DeleteMapping("/{jobId}")
    public ResponseEntity<MessageResponse> deleteJob(@PathVariable Long jobId, @AuthenticationPrincipal CustomUserDetails userDetails) {
        // Technically this should be handled in a JobService.deleteJob wrapper to verify org permissions
        // But for time's sake, we'll route it here for now
        jobService.deleteJob(jobId, userDetails.getId());
        return ResponseEntity.ok(new MessageResponse("Job deleted successfully."));
    }
}
