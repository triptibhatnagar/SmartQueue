package com.hey.doc.service;

import com.hey.doc.model.*;
import com.hey.doc.repository.AppointmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.PriorityQueue;

@Service
@RequiredArgsConstructor
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    // Queue fetch karo — priority order mein
    public List<Appointment> getQueueByDoctor(Long doctorId) {
        List<Appointment> waiting = appointmentRepository
                .findByDoctorIdOrderByPriorityScoreDesc(doctorId);

        PriorityQueue<Appointment> queue = new PriorityQueue<>(
                Comparator.comparingInt(Appointment::getPriorityScore).reversed()
        );
        queue.addAll(waiting);
        return queue.stream().toList();
    }

    // Patient ki current status + position
    public AppointmentStatusResponse getAppointmentStatus(Long appointmentId) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new RuntimeException("Appointment not found"));

        // Queue mein position calculate karo
        List<Appointment> queue = getQueueByDoctor(
                appointment.getDoctor().getId()
        );

        int position = 0;
        for (int i = 0; i < queue.size(); i++) {
            if (queue.get(i).getId().equals(appointmentId)) {
                position = i + 1;
                break;
            }
        }

        return AppointmentStatusResponse.builder()
                .appointmentId(appointmentId)
                .patientName(appointment.getPatient().getName())
                .tokenNumber(appointment.getTokenNumber())
                .status(appointment.getStatus())
                .estimatedTime(appointment.getEstimatedTime())
                .queuePosition(position)
                .build();
    }
}