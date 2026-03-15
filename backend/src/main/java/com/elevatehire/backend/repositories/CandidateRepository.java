package com.elevatehire.backend.repositories;

import com.elevatehire.backend.entities.Candidate;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CandidateRepository extends JpaRepository<Candidate, Long> {
    boolean existsByAadhaar(String aadhaar);
}
