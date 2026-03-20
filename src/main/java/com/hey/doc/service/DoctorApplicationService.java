package com.hey.doc.service;

import com.hey.doc.model.*;
import com.hey.doc.repository.*;
import com.hey.doc.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DoctorApplicationService {

    private final DoctorApplicationRepository applicationRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    // Doctor applies
    public DoctorApplication apply(DoctorApplication application) {
        if (applicationRepository.existsByEmailAndStatus(
                application.getEmail(), ApplicationStatus.PENDING)) {
            throw new RuntimeException("Application already pending for this email");
        }
        return applicationRepository.save(application);
    }

    // Admin — get all pending
    public List<DoctorApplication> getPending() {
        return applicationRepository.findByStatus(ApplicationStatus.PENDING);
    }

    // Admin — get all applications
    public List<DoctorApplication> getAll() {
        return applicationRepository.findAll();
    }

    // Admin — approve
    public DoctorApplication approve(Long applicationId, User admin) {
        DoctorApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        // Create doctor user account
        User doctor = User.builder()
                .name(app.getName())
                .email(app.getEmail())
                .password(passwordEncoder.encode("Doctor@123")) // temp password
                .phone(app.getPhone())
                .role(Role.DOCTOR)
                .isActive(true)
                .build();

        userRepository.save(doctor);

        // Update application
        app.setStatus(ApplicationStatus.APPROVED);
        app.setReviewedBy(admin);
        app.setReviewedAt(LocalDateTime.now());

        return applicationRepository.save(app);
    }

    // Admin — reject
    public DoctorApplication reject(Long applicationId, String reason, User admin) {
        DoctorApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Application not found"));

        app.setStatus(ApplicationStatus.REJECTED);
        app.setAdminNote(reason);
        app.setReviewedBy(admin);
        app.setReviewedAt(LocalDateTime.now());

        return applicationRepository.save(app);
    }
}