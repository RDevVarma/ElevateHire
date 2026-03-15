package com.elevatehire.backend.repositories;

import com.elevatehire.backend.entities.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
}
