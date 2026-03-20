package com.hey.doc.controller;

import com.hey.doc.model.*;
import com.hey.doc.service.DoctorApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor-applications")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DoctorApplicationController {

    private final DoctorApplicationService applicationService;

    // Public — doctor applies
    @PostMapping("/apply")
    public ResponseEntity<DoctorApplication> apply(
            @RequestBody DoctorApplication application) {
        return ResponseEntity.ok(applicationService.apply(application));
    }

    // Admin — view pending
    @GetMapping("/pending")
    public ResponseEntity<List<DoctorApplication>> getPending() {
        return ResponseEntity.ok(applicationService.getPending());
    }

    // Admin — view all
    @GetMapping("/all")
    public ResponseEntity<List<DoctorApplication>> getAll() {
        return ResponseEntity.ok(applicationService.getAll());
    }

    // Admin — approve
    @PutMapping("/{id}/approve")
    public ResponseEntity<DoctorApplication> approve(
            @PathVariable Long id,
            @AuthenticationPrincipal User admin) {
        return ResponseEntity.ok(applicationService.approve(id, admin));
    }

    // Admin — reject
    @PutMapping("/{id}/reject")
    public ResponseEntity<DoctorApplication> reject(
            @PathVariable Long id,
            @RequestParam String reason,
            @AuthenticationPrincipal User admin) {
        return ResponseEntity.ok(applicationService.reject(id, reason, admin));
    }
}