// screens/DriveModeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
  Alert
} from 'react-native';
import SpeedDetectionService from '../services/SpeedDetectionService';

const DriveModeScreen = () => {
  const [isDriveMode, setIsDriveMode] = useState(false);
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [moderateSpeedThreshold, setModerateSpeedThreshold] = useState(30);
  const [highSpeedThreshold, setHighSpeedThreshold] = useState(60);

  useEffect(() => {
    // Update speed every second
    const interval = setInterval(() => {
      if (SpeedDetectionService.isDriveModeActive()) {
        setCurrentSpeed(SpeedDetectionService.getCurrentSpeed());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const toggleDriveMode = async () => {
    if (!isDriveMode) {
      // Start drive mode silently
      try {
        await SpeedDetectionService.startTracking();
        setIsDriveMode(true);
      } catch (error) {
        // Only show alert for errors
        Alert.alert(
          'Error Starting Drive Mode',
          error.message || 'Failed to start tracking. Please check location permissions.',
          [
            {
              text: 'Open Settings',
              onPress: () => {
                if (Linking && Linking.openSettings) {
                  Linking.openSettings();
                }
              }
            },
            { text: 'OK' }
          ]
        );
        console.error('Drive mode error:', error);
      }
    } else {
      // Stop drive mode silently
      try {
        await SpeedDetectionService.stopTracking();
        setIsDriveMode(false);
        setCurrentSpeed(0);
      } catch (error) {
        // Only show alert for errors
        Alert.alert('Error', 'Failed to stop tracking: ' + error.message);
        console.error('Stop tracking error:', error);
      }
    }
  };

  const updateThresholds = () => {
    SpeedDetectionService.updateThresholds(
      moderateSpeedThreshold,
      highSpeedThreshold
    );
    Alert.alert('Success', 'Speed thresholds updated');
  };

  const getSpeedStatus = () => {
    if (currentSpeed >= highSpeedThreshold) {
      return {
        status: 'HIGH SPEED',
        color: '#E74C3C',
        description: 'All notifications silenced'
      };
    } else if (currentSpeed >= moderateSpeedThreshold) {
      return {
        status: 'MODERATE SPEED',
        color: '#F39C12',
        description: 'Silent notifications (screen lights up)'
      };
    } else if (currentSpeed >= 5) {
      return {
        status: 'LOW SPEED',
        color: '#3498DB',
        description: 'Reduced notifications'
      };
    } else {
      return {
        status: 'STATIONARY',
        color: '#2ECC71',
        description: 'Normal notifications'
      };
    }
  };

  const speedStatus = getSpeedStatus();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Drive Mode</Text>
        <Text style={styles.subtitle}>
          Safe driving with smart notifications
        </Text>
      </View>

      {/* Drive Mode Toggle */}
      <View style={styles.card}>
        <View style={styles.toggleContainer}>
          <View>
            <Text style={styles.cardTitle}>Drive Mode</Text>
            <Text style={styles.cardSubtitle}>
              {isDriveMode ? 'Active' : 'Inactive'}
            </Text>
          </View>
          <Switch
            value={isDriveMode}
            onValueChange={toggleDriveMode}
            trackColor={{ false: '#767577', true: '#3498DB' }}
            thumbColor={isDriveMode ? '#2ECC71' : '#f4f3f4'}
          />
        </View>
      </View>

      {/* Current Speed Display */}
      {isDriveMode && (
        <View style={[styles.card, { backgroundColor: speedStatus.color }]}>
          <Text style={styles.speedLabel}>Current Speed</Text>
          <Text style={styles.speedValue}>
            {currentSpeed.toFixed(1)} km/h
          </Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{speedStatus.status}</Text>
          </View>
          <Text style={styles.statusDescription}>
            {speedStatus.description}
          </Text>
        </View>
      )}

      {/* Speed Thresholds Configuration */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Speed Thresholds</Text>
        
        <View style={styles.thresholdItem}>
          <Text style={styles.thresholdLabel}>Moderate Speed</Text>
          <View style={styles.thresholdControls}>
            <TouchableOpacity
              style={styles.thresholdButton}
              onPress={() => setModerateSpeedThreshold(Math.max(10, moderateSpeedThreshold - 5))}
            >
              <Text style={styles.thresholdButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.thresholdValue}>{moderateSpeedThreshold} km/h</Text>
            <TouchableOpacity
              style={styles.thresholdButton}
              onPress={() => setModerateSpeedThreshold(Math.min(50, moderateSpeedThreshold + 5))}
            >
              <Text style={styles.thresholdButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.thresholdItem}>
          <Text style={styles.thresholdLabel}>High Speed</Text>
          <View style={styles.thresholdControls}>
            <TouchableOpacity
              style={styles.thresholdButton}
              onPress={() => setHighSpeedThreshold(Math.max(40, highSpeedThreshold - 5))}
            >
              <Text style={styles.thresholdButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.thresholdValue}>{highSpeedThreshold} km/h</Text>
            <TouchableOpacity
              style={styles.thresholdButton}
              onPress={() => setHighSpeedThreshold(Math.min(120, highSpeedThreshold + 5))}
            >
              <Text style={styles.thresholdButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.updateButton}
          onPress={updateThresholds}
        >
          <Text style={styles.updateButtonText}>Update Thresholds</Text>
        </TouchableOpacity>
      </View>

      {/* Information Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>How it Works</Text>
        <View style={styles.infoItem}>
          <View style={[styles.infoBadge, { backgroundColor: '#2ECC71' }]} />
          <Text style={styles.infoText}>
            <Text style={styles.infoBold}>Stationary (0-5 km/h):</Text> Normal notifications
          </Text>
        </View>
        <View style={styles.infoItem}>
          <View style={[styles.infoBadge, { backgroundColor: '#3498DB' }]} />
          <Text style={styles.infoText}>
            <Text style={styles.infoBold}>Low Speed (5-{moderateSpeedThreshold} km/h):</Text> Reduced notifications
          </Text>
        </View>
        <View style={styles.infoItem}>
          <View style={[styles.infoBadge, { backgroundColor: '#F39C12' }]} />
          <Text style={styles.infoText}>
            <Text style={styles.infoBold}>Moderate ({moderateSpeedThreshold}-{highSpeedThreshold} km/h):</Text> Silent, screen lights up
          </Text>
        </View>
        <View style={styles.infoItem}>
          <View style={[styles.infoBadge, { backgroundColor: '#E74C3C' }]} />
          <Text style={styles.infoText}>
            <Text style={styles.infoBold}>High ({highSpeedThreshold}+ km/h):</Text> All notifications suppressed
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA'
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#3498DB',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3
  },
  toggleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 5
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#7F8C8D'
  },
  speedLabel: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center'
  },
  speedValue: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginVertical: 10
  },
  statusBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignSelf: 'center',
    marginTop: 10
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  statusDescription: {
    color: '#FFFFFF',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    opacity: 0.9
  },
  thresholdItem: {
    marginVertical: 10
  },
  thresholdLabel: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 10
  },
  thresholdControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  thresholdButton: {
    backgroundColor: '#3498DB',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  thresholdButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold'
  },
  thresholdValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50'
  },
  updateButton: {
    backgroundColor: '#2ECC71',
    padding: 15,
    borderRadius: 10,
    marginTop: 15
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center'
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8
  },
  infoBadge: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10
  },
  infoText: {
    fontSize: 14,
    color: '#2C3E50',
    flex: 1
  },
  infoBold: {
    fontWeight: '600'
  }
});

export default DriveModeScreen;