package com.drivesafe.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DriveSessionResponse {
    private Long id;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Double maxSpeed;
    private Double avgSpeed;
    private Double distanceTraveled;
    private Integer durationMinutes;
    private String status;
}