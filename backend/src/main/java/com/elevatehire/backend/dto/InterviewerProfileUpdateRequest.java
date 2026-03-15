package com.elevatehire.backend.dto;

import lombok.Data;

@Data
public class InterviewerProfileUpdateRequest {
    private String name;
    private String phone;
    private String skills;
    private Integer experience;
    private String currentOrganization;
}
