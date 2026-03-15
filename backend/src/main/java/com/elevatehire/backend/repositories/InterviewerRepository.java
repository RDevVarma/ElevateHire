package com.elevatehire.backend.repositories;

import com.elevatehire.backend.entities.Interviewer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface InterviewerRepository extends JpaRepository<Interviewer, Long> {
    boolean existsByAadhaar(String aadhaar);
    List<Interviewer> findBySkillsContainingIgnoreCase(String skill);
}
