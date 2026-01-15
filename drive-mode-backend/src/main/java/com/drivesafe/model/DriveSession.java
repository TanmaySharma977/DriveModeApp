package com.drivesafe.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "drive_sessions")
@Data
public class DriveSession {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "start_time")
    private LocalDateTime startTime;

    @Column(name = "end_time")
    private LocalDateTime endTime;

    @Column(name = "max_speed")
    private Double maxSpeed;

    @Column(name = "avg_speed")
    private Double avgSpeed;

    @Column(name = "distance_traveled")
    private Double distanceTraveled;

    @Column(name = "duration_minutes")
    private Integer durationMinutes;

    @Column(name = "status")
    private String status; // ACTIVE, COMPLETED
}
