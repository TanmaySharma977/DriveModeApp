import { Platform, NativeModules } from 'react-native';
import Geolocation from 'react-native-geolocation-service'; // Alternative package
import notifee, { AndroidImportance } from '@notifee/react-native';
import axios from 'axios';

const PC_IP = process.env.PC_IP || "192.168.1.5";

const API_BASE_URL = __DEV__ 
  ? "http://10.0.2.2:8080/api" 
  : `http://${PC_IP}:8080/api`;
const ENABLE_BACKEND = true; // Set to false to test app without backend

// Speed ranges in km/h
const SPEED_RANGES = {
  STATIONARY: { min: 0, max: 5 },
  LOW: { min: 5, max: 30 },
  MODERATE: { min: 30, max: 60 },
  HIGH: { min: 60, max: 999 }
};

class SpeedDetectionService {
  constructor() {
    this.watchId = null;
    this.currentSpeed = 0;
    this.isDriveMode = false;
    this.speedThresholds = {
      high: 60, // km/h
      moderate: 30 // km/h
    };
  }

  // Initialize and start tracking
  async startTracking() {
    try {
      this.isDriveMode = true;
      
      // Request location permission
      const hasPermission = await this.requestLocationPermission();
      if (!hasPermission) {
        console.log('Location permission denied');
        return;
      }

      // Setup notification channel for Android
      await this.setupNotificationChannel();

      // Start watching position
      this.watchId = Geolocation.watchPosition(
        (position) => {
          this.handlePositionUpdate(position);
        },
        (error) => {
          console.error('Location error:', error);
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 10, // Update every 10 meters
          interval: 2000, // Update every 2 seconds
          fastestInterval: 1000
        }
      );

      // Log session start to backend
      await this.logDriveSession('start');
      
      console.log('Drive mode tracking started');
    } catch (error) {
      console.error('Error starting tracking:', error);
    }
  }

  // Stop tracking
  async stopTracking() {
    if (this.watchId !== null) {
      Geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    
    this.isDriveMode = false;
    this.currentSpeed = 0;

    // Restore normal notification settings
    await this.setNotificationMode('NORMAL');

    // Log session end to backend
    await this.logDriveSession('end');
    
    console.log('Drive mode tracking stopped');
  }

  // Handle position updates
  handlePositionUpdate(position) {
    // Speed is in meters per second, convert to km/h
    const speedInKmh = position.coords.speed ? (position.coords.speed * 3.6) : 0;
    
    this.currentSpeed = Math.max(0, speedInKmh); // Ensure non-negative
    
    console.log(`Current speed: ${this.currentSpeed.toFixed(2)} km/h`);

    // Apply notification settings based on speed
    this.applySpeedBasedSettings(this.currentSpeed);

    // Send speed data to backend
    this.sendSpeedData(this.currentSpeed, position.coords);
  }

  // Apply notification settings based on current speed
  async applySpeedBasedSettings(speed) {
    let mode = 'NORMAL';

    if (speed >= this.speedThresholds.high) {
      mode = 'HIGH_SPEED'; // No sound, no screen light up
    } else if (speed >= this.speedThresholds.moderate) {
      mode = 'MODERATE_SPEED'; // No sound, but screen lights up
    } else if (speed >= SPEED_RANGES.LOW.min) {
      mode = 'LOW_SPEED'; // Reduced notifications
    } else {
      mode = 'STATIONARY'; // Normal notifications
    }

    await this.setNotificationMode(mode);
  }

  // Set notification mode
  async setNotificationMode(mode) {
    try {
      if (Platform.OS === 'android') {
        await this.setAndroidNotificationMode(mode);
      } else {
        await this.setIOSNotificationMode(mode);
      }
    } catch (error) {
      console.error('Error setting notification mode:', error);
    }
  }

  // Android-specific notification control
  async setAndroidNotificationMode(mode) {
    const channelId = 'drive-mode-channel';

    switch (mode) {
      case 'HIGH_SPEED':
        // Suppress all notifications - no sound, no vibration, no light
        await notifee.setNotificationCategories([
          {
            id: 'drive_mode_high',
            actions: []
          }
        ]);
        
        // You may need to use Do Not Disturb mode via native module
        // This requires NOTIFICATION_POLICY_ACCESS_GRANTED permission
        if (NativeModules.NotificationManager) {
          NativeModules.NotificationManager.enableDoNotDisturb();
        }
        break;

      case 'MODERATE_SPEED':
        // Allow screen to light up but no sound
        await notifee.createChannel({
          id: channelId,
          name: 'Drive Mode',
          importance: AndroidImportance.LOW, // No sound
          vibration: false,
          lights: true,
          lightColor: '#FF0000'
        });
        break;

      case 'LOW_SPEED':
        // Reduced interruption
        await notifee.createChannel({
          id: channelId,
          name: 'Drive Mode',
          importance: AndroidImportance.LOW,
          vibration: false
        });
        break;

      case 'STATIONARY':
      case 'NORMAL':
        // Restore normal settings
        if (NativeModules.NotificationManager) {
          NativeModules.NotificationManager.disableDoNotDisturb();
        }
        await notifee.createChannel({
          id: channelId,
          name: 'Drive Mode',
          importance: AndroidImportance.HIGH
        });
        break;
    }

    console.log(`Notification mode set to: ${mode}`);
  }

  // iOS-specific notification control
  async setIOSNotificationMode(mode) {
    // iOS handles this through Focus modes
    // You'll need to use native modules to control Focus mode
    // Or integrate with iOS Shortcuts automation
    
    const settings = await notifee.requestPermission();
    
    // Adjust notification settings based on mode
    // Note: iOS has more restrictions on programmatic notification control
    console.log(`iOS notification mode set to: ${mode}`);
  }

  // Setup notification channel
  async setupNotificationChannel() {
    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: 'drive-mode-channel',
        name: 'Drive Mode',
        importance: AndroidImportance.HIGH
      });
    }
  }

  // Request location permission
  async requestLocationPermission() {
    if (Platform.OS === 'android') {
      const { PermissionsAndroid } = require('react-native');
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true; // iOS handles this through Info.plist
  }

  // Send speed data to backend
  async sendSpeedData(speed, coords) {
    if (!ENABLE_BACKEND) {
      console.log('Backend disabled - Speed:', speed.toFixed(2), 'km/h');
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/drive-sessions/speed`, {
        speed: speed,
        latitude: coords.latitude,
        longitude: coords.longitude,
        timestamp: new Date().toISOString()
      }, {
        timeout: 5000 // 5 second timeout
      });
      console.log('Speed data sent successfully');
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout - check if backend is running');
      } else if (error.message === 'Network Error') {
        console.error('Network Error - Backend not reachable. Check API_BASE_URL:', API_BASE_URL);
      } else {
        console.error('Error sending speed data:', error.message);
      }
    }
  }

  // Log drive session events
  async logDriveSession(event) {
    if (!ENABLE_BACKEND) {
      console.log('Backend disabled - Session event:', event);
      return;
    }

    try {
      const response = await axios.post(`${API_BASE_URL}/drive-sessions/log`, {
        event: event,
        timestamp: new Date().toISOString()
      }, {
        timeout: 5000 // 5 second timeout
      });
      console.log('Drive session logged:', event);
    } catch (error) {
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout - check if backend is running');
      } else if (error.message === 'Network Error') {
        console.error('Network Error - Backend not reachable. Check API_BASE_URL:', API_BASE_URL);
        console.error('Make sure backend is running and URL is correct');
      } else {
        console.error('Error logging drive session:', error.message);
      }
    }
  }

  // Update speed thresholds
  updateThresholds(moderate, high) {
    this.speedThresholds.moderate = moderate;
    this.speedThresholds.high = high;
  }

  // Get current speed
  getCurrentSpeed() {
    return this.currentSpeed;
  }

  // Check if drive mode is active
  isDriveModeActive() {
    return this.isDriveMode;
  }
}

export default new SpeedDetectionService();