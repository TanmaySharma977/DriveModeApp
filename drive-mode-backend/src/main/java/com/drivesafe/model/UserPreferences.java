package com.drivesafe.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "user_preferences")
@Data
public class UserPreferences {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", unique = true)
    private Long userId;

    @Column(name = "moderate_speed_threshold")
    private Integer moderateSpeedThreshold = 30;

    @Column(name = "high_speed_threshold")
    private Integer highSpeedThreshold = 60;

    @Column(name = "auto_enable_drive_mode")
    private Boolean autoEnableDriveMode = false;

    @Column(name = "notification_exceptions")
    private String notificationExceptions; // JSON string of allowed contacts
}