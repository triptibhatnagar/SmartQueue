package com.hey.doc.model;

import lombok.*;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentStatusResponse {
    private Long appointmentId;
    private String patientName;
    private int tokenNumber;
    private AppointmentStatus status;
    private LocalDateTime estimatedTime;
    private int queuePosition;          // "You are 3rd in queue"
}