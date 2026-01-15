import React, { useEffect } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Platform,
  PermissionsAndroid,
  Alert,
  StyleSheet,
  Linking
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

// Import your screens
// Make sure the path matches your actual folder structure!
import DriveModeScreen from './src/screens/DriveModeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const App = () => {
  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      try {
        // Request location permissions
        const locationGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Drive Safe needs access to your location to detect speed',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );

        if (locationGranted !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Permission Required',
            'Location permission is required for Drive Mode to work. Please enable it in Settings.',
            [
              {
                text: 'Open Settings',
                onPress: () => {
                  if (Linking && Linking.openSettings) {
                    Linking.openSettings();
                  }
                }
              },
              { text: 'Cancel', style: 'cancel' }
            ]
          );
          return false;
        }

        // Request notification permission (Android 13+)
        if (Platform.Version >= 33) {
          await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
          );
        }

        return true;
      } catch (err) {
        console.warn('Permission error:', err);
        Alert.alert('Error', 'Failed to request permissions: ' + err.message);
        return false;
      }
    }
    return true;
  };

  return (
    <NavigationContainer>
      <StatusBar barStyle="light-content" backgroundColor="#3498DB" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Drive Mode') {
              iconName = focused ? 'car' : 'car-outline';
            } else if (route.name === 'History') {
              iconName = focused ? 'time' : 'time-outline';
            } else if (route.name === 'Settings') {
              iconName = focused ? 'settings' : 'settings-outline';
            }

            return <Icon name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#3498DB',
          tabBarInactiveTintColor: '#95A5A6',
          tabBarStyle: {
            backgroundColor: '#FFFFFF',
            borderTopWidth: 1,
            borderTopColor: '#E8E8E8',
            height: Platform.OS === 'ios' ? 85 : 60,
            paddingBottom: Platform.OS === 'ios' ? 20 : 8,
            paddingTop: 8,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: '600',
          },
          headerShown: false,
        })}
      >
        <Tab.Screen 
          name="Drive Mode" 
          component={DriveModeScreen}
        />
        <Tab.Screen 
          name="History" 
          component={HistoryScreen}
        />
        <Tab.Screen 
          name="Settings" 
          component={SettingsScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;