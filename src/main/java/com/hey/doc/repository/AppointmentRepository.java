package com.hey.doc.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hey.doc.model.Appointment;
import com.hey.doc.model.AppointmentStatus;
import com.hey.doc.model.Doctor;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByDoctorAndStatus(Doctor doctor, AppointmentStatus status);
    List<Appointment> findByDoctorIdOrderByPriorityScoreDesc(Long doctorId);
    List<Appointment> findAllByStatus(AppointmentStatus status);
    List<Appointment> findByDoctorIdAndStatus(Long doctorId, AppointmentStatus status);
}
