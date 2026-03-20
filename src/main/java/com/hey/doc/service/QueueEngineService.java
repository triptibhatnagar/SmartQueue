package com.hey.doc.service;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.hey.doc.model.Appointment;
import com.hey.doc.model.AppointmentStatus;
import com.hey.doc.model.Doctor;
import com.hey.doc.model.Patient;
import com.hey.doc.repository.AppointmentRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class QueueEngineService {
    private final AppointmentRepository appointmentRepository;

    // 1. PRIORITY SCORE ALGORITHM
    public int calculatePriorityScore(Patient patient, LocalDateTime bookedAt) {
        // base score
        int score = 10;

        // emergency patient - highest priority
        if(patient.isEmergency())
            score += 50;
        
        // senior citizen - higher priority
        if(patient.getAge() >= 60)
            score += 20;

        // Child - medium priority
        if(patient.getAge() <= 10)
            score += 10;

        // Wait times penalty - more wait, more increase in score
        long minutesWaiting = java.time.Duration.between(bookedAt, LocalDateTime.now()).toMinutes();
        score += (int) (minutesWaiting / 10);
        // for every minute, +1

        return score;
    }

    // 2. BOOK APPOINTMENT WITH PRIORITY
    public Appointment bookAppointment(Patient patient, Doctor doctor, LocalDateTime scheduledTime) {
        // calculating priority score
        int score = calculatePriorityScore(patient, LocalDateTime.now());

        // assign token number
        List<Appointment> todayAppointments = appointmentRepository.findByDoctorAndStatus(doctor, AppointmentStatus.WAITING);
        int tokenNumber = todayAppointments.size()+1;

        Appointment appointment = Appointment.builder()
            .patient(patient)
            .doctor(doctor)
            .scheduledTime(scheduledTime)
            .estimatedTime(scheduledTime)
            .tokenNumber(tokenNumber)
            .priorityScore(score)
            .status(AppointmentStatus.WAITING)
            .build();

        return appointmentRepository.save(appointment);
    }

    // 3. DOCTOR PRESS "DONE" - NEXT PATIENT
    public Appointment markPatientDone( Long appointmentId) {
        Appointment current = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        current.setStatus(AppointmentStatus.DONE);
        appointmentRepository.save(current);

        // pull next patient from queue
        return getNextPatient(current.getDoctor().getId());
    }

    // 4. NEXT PATIENT FROM PRIORITY QUEUE
    public Appointment getNextPatient(Long doctorId) {
        List<Appointment> waitingList = appointmentRepository.findByDoctorIdOrderByPriorityScoreDesc(doctorId);

        // java priority queue - get highest score first
        PriorityQueue<Appointment> queue = new PriorityQueue<>(
            Comparator.comparingInt(Appointment::getPriorityScore).reversed()
        );
        queue.addAll(waitingList);

        if(!queue.isEmpty()) {
            Appointment next = queue.poll();
            next.setStatus(AppointmentStatus.IN_PROGRESS);
            return appointmentRepository.save(next);
        }
        return null;
    }

    // 5. DYNAMIC WAIT TIME — AUTO RECALCULATE
    public void recalculateWaitTimes(Doctor doctor, int delayMinutes) {
        List<Appointment> waitingList = appointmentRepository
                .findByDoctorAndStatus(
                        doctor, // doctor fetch
                        AppointmentStatus.WAITING
                );

        // Sab pending appointments ka estimated time shift karo
        for (Appointment appointment : waitingList) {
            appointment.setEstimatedTime(
                    appointment.getEstimatedTime().plusMinutes(delayMinutes)
            );
            appointmentRepository.save(appointment);
        }
    }

    // 6. NO-SHOW AUTO DETECTION — EVERY 5 MIN
    @Scheduled(fixedRate = 300000) // 300000ms = 5 minutes
    public void detectNoShows() {
        List<Appointment> allWaiting = appointmentRepository
                .findAllByStatus(AppointmentStatus.IN_PROGRESS);

        LocalDateTime now = LocalDateTime.now();

        for (Appointment appointment : allWaiting) {
            long minutesSinceScheduled = java.time.Duration.between(
                    appointment.getScheduledTime(), now
            ).toMinutes();

            // 10 min baad bhi patient nahi aaya — no show
            if (minutesSinceScheduled > 10 && appointment.getCheckinTime() == null) {
                appointment.setStatus(AppointmentStatus.NO_SHOW);
                appointmentRepository.save(appointment);

                // Automatically next patient pull karo
                getNextPatient(appointment.getDoctor().getId());
            }
        }
    }
}