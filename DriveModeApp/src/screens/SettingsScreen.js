// screens/SettingsScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert
} from 'react-native';
import axios from 'axios';

const API_BASE_URL = 'http://10.0.2.2:8080/api';

const SettingsScreen = () => {
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPreferences();
  }, []);

  const fetchPreferences = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/preferences?userId=1`);
      setPreferences(response.data);
    } catch (error) {
      console.error('Error fetching preferences:', error);
      // Set default values if fetch fails
      setPreferences({
        moderateSpeedThreshold: 30,
        highSpeedThreshold: 60,
        autoEnableDriveMode: false
      });
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    try {
      setSaving(true);
      await axios.put(`${API_BASE_URL}/preferences?userId=1`, preferences);
      Alert.alert('Success', 'Settings saved successfully!');
    } catch (error) {
      console.error('Error saving preferences:', error);
      Alert.alert('Error', 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const updateThreshold = (key, increment) => {
    setPreferences(prev => ({
      ...prev,
      [key]: Math.max(10, Math.min(120, prev[key] + increment))
    }));
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498DB" />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Settings</Text>
        <Text style={styles.subtitle}>Customize your Drive Mode</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>Speed Thresholds</Text>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>Moderate Speed Threshold</Text>
            <View style={styles.controlRow}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => updateThreshold('moderateSpeedThreshold', -5)}
              >
                <Text style={styles.controlButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.controlValue}>
                {preferences.moderateSpeedThreshold} km/h
              </Text>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => updateThreshold('moderateSpeedThreshold', 5)}
              >
                <Text style={styles.controlButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.settingDescription}>
              Silent notifications, screen lights up
            </Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={styles.settingLabel}>High Speed Threshold</Text>
            <View style={styles.controlRow}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => updateThreshold('highSpeedThreshold', -5)}
              >
                <Text style={styles.controlButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.controlValue}>
                {preferences.highSpeedThreshold} km/h
              </Text>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={() => updateThreshold('highSpeedThreshold', 5)}
              >
                <Text style={styles.controlButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.settingDescription}>
              All notifications suppressed
            </Text>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <Text style={styles.sectionTitle}>About</Text>
          <Text style={styles.aboutText}>
            Drive Mode helps you stay focused on the road by automatically managing
            notifications based on your speed.
          </Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={savePreferences}
          disabled={saving}
        >
          <Text style={styles.saveButtonText}>
            {saving ? 'Saving...' : 'Save Settings'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F6FA',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F6FA',
  },
  header: {
    padding: 20,
    paddingTop: 40,
    backgroundColor: '#3498DB',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  scrollView: {
    flex: 1,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#7F8C8D',
  },
  settingsCard: {
    backgroundColor: '#FFFFFF',
    margin: 15,
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
    marginBottom: 15,
  },
  settingItem: {
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 16,
    color: '#2C3E50',
    marginBottom: 10,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  controlButton: {
    backgroundColor: '#3498DB',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  controlValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C3E50',
  },
  settingDescription: {
    fontSize: 12,
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  aboutText: {
    fontSize: 14,
    color: '#2C3E50',
    lineHeight: 20,
    marginBottom: 15,
  },
  versionText: {
    fontSize: 12,
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  saveButton: {
    backgroundColor: '#2ECC71',
    margin: 15,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#95A5A6',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SettingsScreen;