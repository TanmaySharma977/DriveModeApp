package com.drivesafe.service;

import com.drivesafe.model.UserPreferences;
import com.drivesafe.repository.UserPreferencesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserPreferencesService {
    private final UserPreferencesRepository preferencesRepository;

    public UserPreferences getUserPreferences(Long userId) {
        return preferencesRepository.findByUserId(userId)
                .orElseGet(() -> createDefaultPreferences(userId));
    }

    @Transactional
    public UserPreferences updatePreferences(Long userId, UserPreferences preferences) {
        UserPreferences existing = getUserPreferences(userId);
        existing.setModerateSpeedThreshold(preferences.getModerateSpeedThreshold());
        existing.setHighSpeedThreshold(preferences.getHighSpeedThreshold());
        existing.setAutoEnableDriveMode(preferences.getAutoEnableDriveMode());
        existing.setNotificationExceptions(preferences.getNotificationExceptions());

        return preferencesRepository.save(existing);
    }

    private UserPreferences createDefaultPreferences(Long userId) {
        UserPreferences preferences = new UserPreferences();
        preferences.setUserId(userId);
        preferences.setModerateSpeedThreshold(30);
        preferences.setHighSpeedThreshold(60);
        preferences.setAutoEnableDriveMode(false);

        return preferencesRepository.save(preferences);
    }
}