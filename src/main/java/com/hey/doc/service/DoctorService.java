package com.hey.doc.service;

import org.springframework.stereotype.Service;

import com.hey.doc.model.Doctor;
import com.hey.doc.repository.DoctorRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class DoctorService {
    private final DoctorRepository doctorRepository;
    // post
    public Doctor addDoctor(Doctor doctor) {
        doctor.setAvailable(true);
        return doctorRepository.save(doctor);
    }
    // get
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
    }
}