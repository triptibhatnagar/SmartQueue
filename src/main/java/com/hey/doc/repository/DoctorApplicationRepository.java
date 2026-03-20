package com.hey.doc.repository;

import com.hey.doc.model.ApplicationStatus;
import com.hey.doc.model.DoctorApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DoctorApplicationRepository extends JpaRepository<DoctorApplication, Long> {
    List<DoctorApplication> findByStatus(ApplicationStatus status);
    boolean existsByEmailAndStatus(String email, ApplicationStatus status);
}