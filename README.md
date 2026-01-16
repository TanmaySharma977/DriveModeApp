# Drive Safe Mode 🚗

## Project Overview

Drive Safe Mode is an intelligent mobile application designed to enhance road safety by automatically managing smartphone notifications based on driving speed. Using real-time GPS tracking, the app detects your current speed and adjusts notification behavior accordingly—from silent mode during high-speed highway driving to normal notifications when stationary.

## Preview

<!-- Add your demo video or screenshots here -->
**[Demo Video](https://youtube.com/shorts/COBz7QyMmJk?feature=share)**

## Features

* 📍 **Real-time Speed Detection**: GPS-based speed tracking with ±1-2 km/h accuracy
* 🔕 **Smart Notification Management**: Automatically adjusts notification behavior based on speed ranges
* 🚦 **Customizable Speed Thresholds**: Set personalized speed limits for different notification modes
* 📊 **Drive Session History**: Track and analyze past driving sessions with detailed statistics
* 🎯 **Do Not Disturb Integration**: Seamless Android DND mode control for complete notification suppression
* ⚙️ **User Preferences**: Customizable settings for speed thresholds and notification behavior
* 🌐 **Backend Integration**: Cloud-based data storage and analytics
* 🔋 **Battery Optimized**: Efficient GPS tracking with minimal battery drain

## Speed Modes

| Speed Range | Mode | Notification Behavior |
|-------------|------|----------------------|
| 0-5 km/h | **Stationary** | Normal notifications (full sound & vibration) |
| 5-30 km/h | **Low Speed** | Reduced notifications (city driving) |
| 30-60 km/h | **Moderate Speed** | Silent notifications (screen lights up only) |
| 60+ km/h | **High Speed** | All notifications suppressed (highway driving) |

## Tech Stack

### Mobile Application (React Native)
* **Framework**: React Native 0.72+
* **Navigation**: React Navigation (Bottom Tabs)
* **Location Services**: react-native-geolocation-service
* **Notifications**: @notifee/react-native
* **UI Components**: React Native Vector Icons
* **HTTP Client**: Axios
* **State Management**: React Hooks (useState, useEffect)

### Backend (Spring Boot)
* **Framework**: Spring Boot 3.2.0
* **Database**: PostgreSQL 12+
* **ORM**: Spring Data JPA / Hibernate
* **API**: RESTful (Spring REST)
* **Build Tool**: Maven
* **Language**: Java 17

### Additional Tools
* **Version Control**: Git & GitHub
* **Mobile OS**: Android 8.0+ (API Level 26+)
* **Development**: Android Studio, VS Code

## Project Structure

```
/DriveModeApp
├── android/                 # Android native code
├── ios/                     # iOS native code (if applicable)
├── screens/                 # React Native screens
│   ├── DriveModeScreen.js   # Main drive mode interface
│   ├── HistoryScreen.js     # Drive session history
│   └── SettingsScreen.js    # App settings & preferences
├── services/                # Business logic & services
│   └── SpeedDetectionService.js  # GPS tracking & speed detection
├── App.js                   # Main application component
├── package.json             # Dependencies
└── README.md                # Project documentation

/backend (Spring Boot)
├── src/
│   └── main/
│       ├── java/com/drivesafe/
│       │   ├── model/       # JPA entities
│       │   ├── repository/  # Data access layer
│       │   ├── service/     # Business logic
│       │   ├── controller/  # REST endpoints
│       │   └── dto/         # Data transfer objects
│       └── resources/
│           └── application.properties  # Configuration
├── pom.xml                  # Maven dependencies
└── README.md
```

## Installation & Setup

### 🔹 Prerequisites

* **Node.js** (>= 18.0)
* **React Native CLI**
* **Android Studio** (for Android development)
* **Java** (>= 17)
* **Maven** (>= 3.6)
* **PostgreSQL** (>= 12)

### 🔹 Steps to Run Locally

#### 1. Clone the repository

```bash
git clone https://github.com/your-username/DriveModeApp.git
cd DriveModeApp
```

#### 2. Set up the Mobile App

```bash
# Install dependencies
npm install

# Install additional packages
npm install @react-native-community/geolocation
npm install react-native-geolocation-service
npm install @notifee/react-native
npm install @react-navigation/native
npm install @react-navigation/bottom-tabs
npm install react-native-vector-icons
npm install axios
```

**Configure Android Permissions**

Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_COARSE_LOCATION" />
<uses-permission android:name="android.permission.ACCESS_BACKGROUND_LOCATION" />
<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />
<uses-permission android:name="android.permission.ACCESS_NOTIFICATION_POLICY" />
```

**Update Backend URL**

In `services/SpeedDetectionService.js`, update the API URL:

```javascript
const PC_IP = 'YOUR_PC_IP_ADDRESS'; // e.g., 192.168.1.100
const API_BASE_URL = `http://${PC_IP}:8080/api`;
```

**Run Development Server**

```bash
# Start Metro bundler
npx react-native start

# Run on Android (in a new terminal)
npx react-native run-android

# Run on iOS (macOS only)
npx react-native run-ios
```

#### 3. Set up the Backend

```bash
cd backend

# Install dependencies (Maven will auto-download)
mvn clean install

# Create PostgreSQL database
createdb drivesafe_db

# Configure database connection
# Edit src/main/resources/application.properties
```

**application.properties**:

```properties
server.port=8080

spring.datasource.url=jdbc:postgresql://localhost:5432/drivesafe_db
spring.datasource.username=your_username
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
```

**Run Backend Server**

```bash
# Development
mvn spring-boot:run

# Production
mvn clean package
java -jar target/drive-mode-backend-1.0.0.jar
```

#### 4. Build Production APK

```bash
# Bundle JavaScript
npx react-native bundle \
  --platform android \
  --dev false \
  --entry-file index.js \
  --bundle-output android/app/src/main/assets/index.android.bundle \
  --assets-dest android/app/src/main/res

# Build APK
cd android
./gradlew assembleDebug  # Debug APK
# OR
./gradlew assembleRelease  # Release APK
cd ..

# APK Location
# Debug: android/app/build/outputs/apk/debug/app-debug.apk
# Release: android/app/build/outputs/apk/release/app-release.apk
```

## Configuration

### Environment Variables

Create `.env` file in root:

```env
API_BASE_URL=http://192.168.1.100:8080/api
ENABLE_BACKEND=true
```

### Speed Thresholds

Customize default speed thresholds in `services/SpeedDetectionService.js`:

```javascript
this.speedThresholds = {
  high: 60,      // km/h - Highway speed
  moderate: 30   // km/h - Regular roads
};
```

### Database Schema

The backend automatically creates these tables:
* `drive_sessions` - Stores driving session data
* `speed_data` - Logs speed readings
* `user_preferences` - User settings and thresholds

## Usage

### 📱 Mobile App

1. **Launch the app** on your Android device
2. **Grant permissions**:
   - Location (Allow all the time)
   - Notifications
   - Do Not Disturb access (via Settings)
3. **Start Drive Mode**: Toggle the switch on the main screen
4. **Drive**: The app automatically detects speed and adjusts notifications
5. **View History**: Check past driving sessions in the History tab
6. **Customize Settings**: Adjust speed thresholds in the Settings tab

### 🖥️ Backend API

**Endpoints:**

```bash
# Start drive session
POST /api/drive-sessions/log?userId=1
Body: { "event": "start", "timestamp": "2024-01-15T10:00:00" }

# Record speed data
POST /api/drive-sessions/speed?userId=1
Body: { "speed": 65.5, "latitude": 20.2961, "longitude": 85.8245, "timestamp": "2024-01-15T10:00:00" }

# Get drive history
GET /api/drive-sessions/history?userId=1

# Get user preferences
GET /api/preferences?userId=1

# Update preferences
PUT /api/preferences?userId=1
Body: { "moderateSpeedThreshold": 40, "highSpeedThreshold": 80 }
```

## API Documentation

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/drive-sessions/log` | Start/end drive session |
| POST | `/api/drive-sessions/speed` | Log speed data point |
| GET | `/api/drive-sessions/history` | Get user's drive history |
| GET | `/api/drive-sessions/active` | Get active session |
| GET | `/api/preferences` | Get user preferences |
| PUT | `/api/preferences` | Update user preferences |

## Key Features Explained

### 🎯 GPS Speed Detection

The app uses GPS satellites to calculate real-time speed:
- **Accuracy**: ±1-2 km/h (same as car speedometers)
- **Update Frequency**: Every 2 seconds or 10 meters
- **Technology**: Doppler shift measurement from GPS signals

### 🔕 Do Not Disturb Integration

Native Android DND integration for complete notification control:
- **High Speed (60+ km/h)**: Complete silence
- **Moderate Speed (30-60 km/h)**: Visual notifications only
- **Low Speed**: Reduced interruptions
- **Stationary**: Normal notifications

### 📊 Session Analytics

Track driving statistics:
- Start/end time
- Maximum speed reached
- Average speed
- Duration
- Distance traveled (if implemented)


### Firewall Configuration

**Windows Firewall Rule**:
```cmd
netsh advfirewall firewall add rule name="Drive Safe Backend" dir=in action=allow protocol=TCP localport=8080
```

## Development

### Running Tests

```bash
# Backend tests
cd backend
mvn test

# Frontend tests (if implemented)
npm test
```

### Debug Logging

Enable verbose logging:

```bash
# Android logs
adb logcat | grep "DriveModeApp"

# Backend logs
# Check console output from Spring Boot
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

* GPS tracking powered by `react-native-geolocation-service`
* Notification management via `@notifee/react-native`
* Backend built with Spring Boot framework
* Icons by React Native Vector Icons (Ionicons)

## Contact

**Developer**: Tanmay Sharma  
**Email**: tanmaysharma977@gmail.com 
**GitHub**: [https://github.com/TanmaySharma977](https://github.com/TanmaySharma977) 
**Project Link**: [https://github.com/your-username/DriveModeApp](https://github.com/your-username/DriveModeApp)

---

**⭐ If you found this project helpful, please give it a star on GitHub!**

## Support

For issues and questions:
- 🐛 [Report a bug](https://github.com/your-username/DriveModeApp/issues)
- 💡 [Request a feature](https://github.com/your-username/DriveModeApp/issues)
- 📖 [Documentation](https://github.com/your-username/DriveModeApp/wiki)

---

Made with ❤️ for safer roads
