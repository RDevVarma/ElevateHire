package com.elevatehire.backend.entities;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@Table(name = "jobs")
@Data
@NoArgsConstructor
public class Job {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "org_id", nullable = false)
    @JsonIgnoreProperties({"jobs", "hibernateLazyInitializer", "handler"})
    private Organization organization;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(name = "required_skills", nullable = false, length = 1000)
    private String requiredSkills;

    @Column(name = "min_experience", nullable = false)
    private Integer minExperience; // in years

    @Column(name = "open_positions", nullable = false)
    private Integer openPositions;

    @Column(nullable = false)
    private LocalDateTime deadline;

    @Column(nullable = false)
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private JobStatus status = JobStatus.ACTIVE;

    @ManyToMany
    @JoinTable(
        name = "job_interviewers",
        joinColumns = @JoinColumn(name = "job_id"),
        inverseJoinColumns = @JoinColumn(name = "interviewer_id")
    )
    @JsonIgnoreProperties({"jobs", "hibernateLazyInitializer", "handler"})
    private Set<Interviewer> assignedInterviewers = new HashSet<>();
}
