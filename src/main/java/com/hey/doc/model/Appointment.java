package com.hey.doc.model;

import java.time.LocalDateTime;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "appointments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Appointment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Doctor doctor;
    
    private LocalDateTime scheduledTime;    // booked slot time
    private LocalDateTime estimatedTime;    // dynamic — updates automatically
    private LocalDateTime checkinTime;      // jab patient aaye

    private int tokenNumber;                // queue token
    private int priorityScore;             // tumhara unique algorithm

    @Enumerated(EnumType.STRING)
    private AppointmentStatus status;       // WAITING, IN_PROGRESS, DONE, NO_SHOW

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.status = AppointmentStatus.WAITING;
    }
}
