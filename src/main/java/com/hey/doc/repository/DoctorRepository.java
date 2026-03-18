package com.hey.doc.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hey.doc.model.Doctor;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    
}
