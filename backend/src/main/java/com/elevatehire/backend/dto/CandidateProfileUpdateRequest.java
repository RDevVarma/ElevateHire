package com.elevatehire.backend.dto;

import lombok.Data;

@Data
public class CandidateProfileUpdateRequest {
    private String name;
    private String phone;
    private String highestQualification;
    private String skills;
    private Integer experience;
    // Note: Aadhaar and email are non-editable per requirements
}
