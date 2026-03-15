package com.elevatehire.backend.dto;

import lombok.Data;

@Data
public class OrgProfileUpdateRequest {
    private String name;
    private String phone;
    private String address;
    private String industryType;
    private String website;
    private String contactPerson;
}
