package com.hey.doc.controller;

import com.hey.doc.model.Patient;
import com.hey.doc.service.PatientService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PatientController {

    private final PatientService patientService;

    // Patient register karo
    @PostMapping("/register")
    public ResponseEntity<Patient> registerPatient(@RequestBody Patient patient) {
        return ResponseEntity.ok(patientService.registerPatient(patient));
    }

    // Patient by ID fetch karo
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatient(@PathVariable Long id) {
        return ResponseEntity.ok(patientService.getPatientById(id));
    }
}