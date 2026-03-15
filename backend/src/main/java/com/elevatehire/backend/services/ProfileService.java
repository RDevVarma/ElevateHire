package com.elevatehire.backend.services;

import com.elevatehire.backend.dto.*;
import com.elevatehire.backend.entities.*;
import com.elevatehire.backend.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProfileService {

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private InterviewerRepository interviewerRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    public Candidate getCandidateProfile(Long userId) {
        return candidateRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Candidate profile not found"));
    }

    public Interviewer getInterviewerProfile(Long userId) {
        return interviewerRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Interviewer profile not found"));
    }

    public Organization getOrganizationProfile(Long userId) {
        return organizationRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Organization profile not found"));
    }

    @Transactional
    public Candidate updateCandidateProfile(Long userId, CandidateProfileUpdateRequest request) {
        Candidate candidate = getCandidateProfile(userId);
        if (request.getName() != null) candidate.setName(request.getName());
        if (request.getPhone() != null) candidate.setPhone(request.getPhone());
        if (request.getHighestQualification() != null) candidate.setHighestQualification(request.getHighestQualification());
        if (request.getSkills() != null) candidate.setSkills(request.getSkills());
        if (request.getExperience() != null) candidate.setExperience(request.getExperience());
        
        return candidateRepository.save(candidate);
    }

    @Transactional
    public Interviewer updateInterviewerProfile(Long userId, InterviewerProfileUpdateRequest request) {
        Interviewer interviewer = getInterviewerProfile(userId);
        if (request.getName() != null) interviewer.setName(request.getName());
        if (request.getPhone() != null) interviewer.setPhone(request.getPhone());
        if (request.getSkills() != null) interviewer.setSkills(request.getSkills());
        if (request.getExperience() != null) interviewer.setExperience(request.getExperience());
        if (request.getCurrentOrganization() != null) interviewer.setCurrentOrganization(request.getCurrentOrganization());

        return interviewerRepository.save(interviewer);
    }

    @Transactional
    public Organization updateOrganizationProfile(Long userId, OrgProfileUpdateRequest request) {
        Organization org = getOrganizationProfile(userId);
        if (request.getName() != null) org.setName(request.getName());
        if (request.getPhone() != null) org.setContactPhone(request.getPhone());
        if (request.getAddress() != null) org.setAddress(request.getAddress());
        if (request.getIndustryType() != null) org.setIndustryType(request.getIndustryType());
        if (request.getWebsite() != null) org.setWebsite(request.getWebsite());
        if (request.getContactPerson() != null) org.setContactPerson(request.getContactPerson());

        return organizationRepository.save(org);
    }
}
