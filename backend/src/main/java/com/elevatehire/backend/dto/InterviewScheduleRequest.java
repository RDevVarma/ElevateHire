package com.elevatehire.backend.dto;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class InterviewScheduleRequest {
    private LocalDate interviewDate;
    private LocalTime interviewTime;
    private String mode;
    private String meetingLink;
}
