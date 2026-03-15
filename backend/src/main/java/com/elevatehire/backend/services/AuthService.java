package com.elevatehire.backend.services;

import com.elevatehire.backend.dto.*;
import com.elevatehire.backend.entities.*;
import com.elevatehire.backend.repositories.*;
import com.elevatehire.backend.security.CustomUserDetails;
import com.elevatehire.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Random;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CandidateRepository candidateRepository;

    @Autowired
    private InterviewerRepository interviewerRepository;

    @Autowired
    private OrganizationRepository organizationRepository;

    @Autowired
    private PasswordEncoder encoder;

    public JwtResponse authenticateUser(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword()));

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        String jwt = jwtUtil.generateToken(userDetails);
        String role = userDetails.getAuthorities().iterator().next().getAuthority().replace("ROLE_", "");

        return new JwtResponse(jwt, role, userDetails.getId(), userDetails.getUsername());
    }

    @Transactional
    public MessageResponse registerCandidate(CandidateRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }
        if (candidateRepository.existsByAadhaar(request.getAadhaar())) {
            throw new RuntimeException("Error: Aadhaar is already registered!");
        }

        // Create user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setRole(Role.CANDIDATE);
        user = userRepository.save(user);

        // Create candidate profile
        Candidate candidate = new Candidate();
        candidate.setUser(user);
        candidate.setName(request.getName());
        candidate.setPhone(request.getPhone());
        candidate.setAadhaar(request.getAadhaar());
        candidate.setDob(request.getDob());
        candidate.setGender(request.getGender());
        candidate.setHighestQualification(request.getHighestQualification());
        candidate.setSkills(request.getSkills());
        candidate.setExperience(request.getExperience() != null ? request.getExperience() : 0);
        
        candidateRepository.save(candidate);

        return new MessageResponse("Candidate registered successfully!");
    }

    @Transactional
    public MessageResponse registerInterviewer(InterviewerRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }
        if (interviewerRepository.existsByAadhaar(request.getAadhaar())) {
            throw new RuntimeException("Error: Aadhaar is already registered!");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setRole(Role.INTERVIEWER);
        user = userRepository.save(user);

        Interviewer interviewer = new Interviewer();
        interviewer.setUser(user);
        interviewer.setInterviewerId(String.format("%06d", new Random().nextInt(999999)));
        interviewer.setName(request.getName());
        interviewer.setPhone(request.getPhone());
        interviewer.setAadhaar(request.getAadhaar());
        interviewer.setSkills(request.getSkills());
        interviewer.setExperience(request.getExperience());
        interviewer.setCurrentOrganization(request.getCurrentOrganization());

        interviewerRepository.save(interviewer);

        return new MessageResponse("Interviewer registered successfully!");
    }

    @Transactional
    public MessageResponse registerOrganization(OrgRegistrationRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Error: Email is already in use!");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(encoder.encode(request.getPassword()));
        user.setRole(Role.ORG);
        user = userRepository.save(user);

        Organization org = new Organization();
        org.setUser(user);
        org.setName(request.getName());
        org.setAddress(request.getAddress());
        org.setIndustryType(request.getIndustryType());
        org.setWebsite(request.getWebsite());
        org.setContactPerson(request.getContactPerson());
        org.setContactPhone(request.getContactPhone());

        organizationRepository.save(org);

        return new MessageResponse("Organization registered successfully!");
    }
}
