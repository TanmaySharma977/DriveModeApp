package com.drivesafe.service;

import com.drivesafe.dto.*;
import com.drivesafe.model.*;
import com.drivesafe.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DriveSessionService {
    private final DriveSessionRepository sessionRepository;
    private final SpeedDataRepository speedDataRepository;
    private final UserPreferencesRepository preferencesRepository;

    @Transactional
    public DriveSession startSession(Long userId) {
        // Check if there's already an active session
        sessionRepository.findActiveSessionByUserId(userId)
                .ifPresent(session -> {
                    throw new RuntimeException("Active session already exists");
                });

        DriveSession session = new DriveSession();
        session.setUserId(userId);
        session.setStartTime(LocalDateTime.now());
        session.setStatus("ACTIVE");
        session.setMaxSpeed(0.0);
        session.setAvgSpeed(0.0);
        session.setDistanceTraveled(0.0);

        return sessionRepository.save(session);
    }

    @Transactional
    public DriveSession endSession(Long userId) {
        DriveSession session = sessionRepository.findActiveSessionByUserId(userId)
                .orElseThrow(() -> new RuntimeException("No active session found"));

        session.setEndTime(LocalDateTime.now());
        session.setStatus("COMPLETED");

        // Calculate session statistics
        Double avgSpeed = speedDataRepository.calculateAverageSpeed(session.getId());
        Double maxSpeed = speedDataRepository.findMaxSpeed(session.getId());

        session.setAvgSpeed(avgSpeed != null ? avgSpeed : 0.0);
        session.setMaxSpeed(maxSpeed != null ? maxSpeed : 0.0);

        // Calculate duration
        long minutes = ChronoUnit.MINUTES.between(session.getStartTime(), session.getEndTime());
        session.setDurationMinutes((int) minutes);

        return sessionRepository.save(session);
    }

    @Transactional
    public SpeedData recordSpeed(Long userId, SpeedDataRequest request) {
        DriveSession session = sessionRepository.findActiveSessionByUserId(userId)
                .orElseThrow(() -> new RuntimeException("No active session found"));

        SpeedData speedData = new SpeedData();
        speedData.setSessionId(session.getId());
        speedData.setSpeed(request.getSpeed());
        speedData.setLatitude(request.getLatitude());
        speedData.setLongitude(request.getLongitude());
        speedData.setTimestamp(request.getTimestamp());

        return speedDataRepository.save(speedData);
    }

    public List<DriveSessionResponse> getUserSessions(Long userId) {
        return sessionRepository.findByUserIdOrderByStartTimeDesc(userId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }

    public DriveSession getActiveSession(Long userId) {
        return sessionRepository.findActiveSessionByUserId(userId)
                .orElse(null);
    }

    private DriveSessionResponse convertToResponse(DriveSession session) {
        DriveSessionResponse response = new DriveSessionResponse();
        response.setId(session.getId());
        response.setStartTime(session.getStartTime());
        response.setEndTime(session.getEndTime());
        response.setMaxSpeed(session.getMaxSpeed());
        response.setAvgSpeed(session.getAvgSpeed());
        response.setDistanceTraveled(session.getDistanceTraveled());
        response.setDurationMinutes(session.getDurationMinutes());
        response.setStatus(session.getStatus());
        return response;
    }
}