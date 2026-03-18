package com.hey.doc.model;

import java.time.LocalTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Doctor {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String specialization;
    private String phone;

    private LocalTime workStartTime;   // e.g. 10:00 AM
    private LocalTime workEndTime;     // e.g. 2:00 PM
    private int slotDurationMinutes;   // e.g. 15 mins per patient
    private int maxPatientsPerDay;     // e.g. 20

    private boolean isAvailable;
}