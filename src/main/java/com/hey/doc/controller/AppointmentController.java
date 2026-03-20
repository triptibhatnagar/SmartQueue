package com.hey.doc.controller;

import com.hey.doc.model.*;
import com.hey.doc.service.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/appointments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AppointmentController {

    private final QueueEngineService queueEngineService;
    private final PatientService patientService;
    private final DoctorService doctorService;
    private final AppointmentService appointmentService;

    // ── Appointment book karo ──
    @PostMapping("/book")
    public ResponseEntity<Appointment> bookAppointment(
            @RequestParam Long patientId,
            @RequestParam Long doctorId,
            @RequestParam String scheduledTime) {

        Patient patient = patientService.getPatientById(patientId);
        Doctor doctor = doctorService.getDoctorById(doctorId);
        LocalDateTime time = LocalDateTime.parse(scheduledTime);

        Appointment appointment = queueEngineService
                .bookAppointment(patient, doctor, time);

        return ResponseEntity.ok(appointment);
    }

    // ── Doctor ne "Done" dabaya ──
    @PutMapping("/{id}/done")
    public ResponseEntity<Appointment> markDone(@PathVariable Long id) {
        Appointment next = queueEngineService.markPatientDone(id);
        return ResponseEntity.ok(next);
    }

    // ── Queue dekho — doctor dashboard ke liye ──
    @GetMapping("/queue/{doctorId}")
    public ResponseEntity<List<Appointment>> getQueue(
            @PathVariable Long doctorId) {
        return ResponseEntity.ok(
                appointmentService.getQueueByDoctor(doctorId)
        );
    }

    // ── Patient apni position dekhe ──
    @GetMapping("/{id}/status")
    public ResponseEntity<AppointmentStatusResponse> getAppointmentStatus(
            @PathVariable Long id) {
        return ResponseEntity.ok(
                appointmentService.getAppointmentStatus(id)
        );
    }

    // ── Doctor late — wait times update karo ──
    @PutMapping("/delay/{doctorId}")
    public ResponseEntity<String> handleDelay(
            @PathVariable Long doctorId,
            @RequestParam int delayMinutes) {
        Doctor doctor = doctorService.getDoctorById(doctorId);
        queueEngineService.recalculateWaitTimes(doctor, delayMinutes);
        return ResponseEntity.ok("Wait times updated by " + delayMinutes + " minutes");
    }
}