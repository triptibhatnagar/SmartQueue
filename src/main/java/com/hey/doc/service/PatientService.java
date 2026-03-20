package com.hey.doc.service;

import org.springframework.stereotype.Service;

import com.hey.doc.model.Patient;
import com.hey.doc.repository.PatientRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class PatientService {
    private final PatientRepository patientRepository;

    // post
    public Patient registerPatient(Patient patient) {
        return patientRepository.save(patient);
    }
    // get
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found"));
    }
}