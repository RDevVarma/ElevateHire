package com.elevatehire.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

@Data
public class CandidateRegistrationRequest {
    @NotBlank
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Pattern(regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d\\S]{8,}$", 
            message = "Password must be at least 8 characters long, contain 1 uppercase, 1 lowercase and 1 numeric character")
    private String password;

    @NotBlank
    @Pattern(regexp = "^\\d{10}$", message = "Phone must be exactly 10 digits")
    private String phone;

    @NotBlank
    @Pattern(regexp = "^\\d{12}$", message = "Aadhaar must be exactly 12 digits")
    private String aadhaar;

    @NotBlank
    private String dob;

    @NotBlank
    private String gender;

    @NotBlank
    private String highestQualification;

    @NotBlank
    private String skills;

    private Integer experience;
}
