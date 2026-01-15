package com.drivesafe.controller;

import com.drivesafe.dto.*;
import com.drivesafe.model.*;
import com.drivesafe.service.DriveSessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/drive-sessions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class DriveSessionController {
    private final DriveSessionService driveSessionService;

    @PostMapping("/log")
    public ResponseEntity<DriveSession> logSession(
            @RequestParam(defaultValue = "1") Long userId,
            @RequestBody SessionLogRequest request) {

        if ("start".equalsIgnoreCase(request.getEvent())) {
            DriveSession session = driveSessionService.startSession(userId);
            return ResponseEntity.ok(session);
        } else if ("end".equalsIgnoreCase(request.getEvent())) {
            DriveSession session = driveSessionService.endSession(userId);
            return ResponseEntity.ok(session);
        }

        return ResponseEntity.badRequest().build();
    }

    @PostMapping("/speed")
    public ResponseEntity<SpeedData> recordSpeed(
            @RequestParam(defaultValue = "1") Long userId,
            @RequestBody SpeedDataRequest request) {

        SpeedData speedData = driveSessionService.recordSpeed(userId, request);
        return ResponseEntity.ok(speedData);
    }

    @GetMapping("/history")
    public ResponseEntity<List<DriveSessionResponse>> getHistory(
            @RequestParam(defaultValue = "1") Long userId) {

        List<DriveSessionResponse> sessions = driveSessionService.getUserSessions(userId);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping("/active")
    public ResponseEntity<DriveSession> getActiveSession(
            @RequestParam(defaultValue = "1") Long userId) {

        DriveSession session = driveSessionService.getActiveSession(userId);
        if (session != null) {
            return ResponseEntity.ok(session);
        }
        return ResponseEntity.notFound().build();
    }
}