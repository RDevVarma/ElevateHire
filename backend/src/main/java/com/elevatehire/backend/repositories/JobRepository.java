package com.elevatehire.backend.repositories;

import com.elevatehire.backend.entities.Job;
import com.elevatehire.backend.entities.JobStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByOrganizationUserId(Long orgId);
    List<Job> findByStatus(JobStatus status);
}
