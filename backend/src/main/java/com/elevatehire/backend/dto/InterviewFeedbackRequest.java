package com.elevatehire.backend.dto;

import com.elevatehire.backend.entities.Recommendation;
import lombok.Data;

@Data
public class InterviewFeedbackRequest {
    private Integer technicalRating;
    private Integer communicationRating;
    private Integer problemSolvingRating;
    private String overallAssessment;
    private Recommendation recommendation;
}
