package com.elevatehire.backend.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class JobRequest {
    private String title;
    private String description;
    private String requiredSkills;
    private Integer minExperience;
    private Integer openPositions;
    private LocalDateTime deadline;
    private String location;
}
