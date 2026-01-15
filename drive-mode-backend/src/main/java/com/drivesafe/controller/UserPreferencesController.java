package com.drivesafe.controller;

import com.drivesafe.model.UserPreferences;
import com.drivesafe.service.UserPreferencesService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/preferences")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserPreferencesController {
    private final UserPreferencesService preferencesService;

    @GetMapping
    public ResponseEntity<UserPreferences> getPreferences(
            @RequestParam(defaultValue = "1") Long userId) {

        UserPreferences preferences = preferencesService.getUserPreferences(userId);
        return ResponseEntity.ok(preferences);
    }

    @PutMapping
    public ResponseEntity<UserPreferences> updatePreferences(
            @RequestParam(defaultValue = "1") Long userId,
            @RequestBody UserPreferences preferences) {

        UserPreferences updated = preferencesService.updatePreferences(userId, preferences);
        return ResponseEntity.ok(updated);
    }
}