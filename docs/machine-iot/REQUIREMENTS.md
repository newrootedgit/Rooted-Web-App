# Business Requirements - Machine IoT

## Introduction

Machine IoT is a web-based device provisioning platform that enables users to discover, connect, and configure IoT devices (Raspberry Pi-based machines) via Bluetooth Low Energy. The platform simplifies the WiFi onboarding process by allowing users to provision devices directly from their web browser without requiring native mobile applications.

## Glossary

- **Machine**: A Raspberry Pi-based IoT device running BLE peripheral services
- **Device Discovery**: Scanning for nearby BLE devices using Web Bluetooth API
- **Provisioning**: The process of configuring a device's WiFi credentials
- **GATT**: Generic Attribute Profile - BLE protocol for data exchange
- **Connection Status**: Real-time feedback on device connectivity state

## User Roles

- **User**: Anyone with a Chrome/Edge browser who needs to provision IoT devices

---

## Device Discovery Requirements

### Requirement 1: BLE Device Scanning

**User Story:** As a user, I want to scan for nearby machines from my web browser, so that I can identify and connect to my IoT devices without installing native apps.

#### Business Rules

1. Users MUST initiate device scanning through a user action (button click) due to browser security requirements

2. The system MUST use Web Bluetooth API to scan for BLE devices advertising the machine service UUID

3. The system MUST display a browser-native device picker showing all discovered machines

4. Users MUST be able to see device names and signal strength indicators in the picker

5. The system MUST only show devices that match the machine's BLE service filter

6. The scanning process MUST work on Chrome and Edge browsers (desktop and Android)

7. The system MUST require HTTPS for all Web Bluetooth operations

8. Users SHOULD see a clear error message if their browser does not support Web Bluetooth

---

## Device Connection Requirements

### Requirement 2: BLE Connection Management

**User Story:** As a user, I want to connect to a discovered machine from my browser, so that I can configure its settings without device-level Bluetooth pairing.

#### Business Rules

1. Users MUST select a device from the browser's device picker to initiate connection

2. The system MUST establish a GATT connection to the selected device

3. The connection MUST be managed entirely by the web application - no OS-level pairing required

4. The system MUST add successfully connected devices to the user's machine dashboard

5. Users MUST be able to see all connected machines in a dashboard view

6. The system MUST maintain connection state and handle disconnections gracefully

7. Users SHOULD receive visual feedback during the connection process

8. The system MUST store device information (name, ID) locally for reconnection

---

## WiFi Provisioning Requirements

### Requirement 3: WiFi Configuration

**User Story:** As a user, I want to send WiFi credentials to my machine through the web interface, so that the device can connect to my network.

#### Business Rules

1. Users MUST be able to access WiFi configuration from the machine dashboard

2. The system MUST display a popup/modal for WiFi credential input when user selects "Connect to Internet"

3. Users MUST provide the following information:
   - WiFi SSID (network name)
   - WiFi password

4. The system MUST convert WiFi credentials to byte format before transmission

5. The system MUST send credentials via BLE GATT characteristic write operation

6. The system MUST NOT encrypt credentials during development phase

7. The system SHOULD support credential encryption in production (future requirement)

8. Users CAN cancel the WiFi configuration process at any time

9. The system MUST validate that SSID and password fields are not empty before sending

### Requirement 4: Connection Status Feedback

**User Story:** As a user, I want to see real-time feedback on my machine's WiFi connection status, so that I know whether provisioning succeeded or failed.

#### Business Rules

1. The system MUST display connection status using color-coded indicators:
   - Orange: Connecting to WiFi network
   - Green: Successfully connected to WiFi
   - Red: Connection failed

2. The system MUST receive status updates from the device via GATT characteristic notifications

3. Users MUST see the "Connecting" (orange) state immediately after sending credentials

4. The system MUST display failure information when connection fails, including:
   - Error type (invalid credentials, network not found, etc.)
   - User-friendly error message

5. The system MUST update the dashboard to show the device's connected state (green) upon success

6. Users SHOULD be able to retry WiFi configuration if connection fails

7. The system MUST maintain status history for troubleshooting purposes

8. The connection status MUST persist in the dashboard until the device is removed or status changes

---

## Dashboard Requirements

### Requirement 5: Machine Dashboard

**User Story:** As a user, I want to view all my connected machines in one place, so that I can manage multiple devices efficiently.

#### Business Rules

1. Users MUST be able to view a list of all machines they have connected to

2. The dashboard MUST display for each machine:
   - Device name
   - Connection status (connected/disconnected)
   - WiFi status (not configured, connecting, connected, failed)
   - Last seen timestamp

3. Users MUST be able to access WiFi configuration for each machine from the dashboard

4. Users SHOULD be able to remove machines from their dashboard

5. The system MUST persist dashboard data locally (localStorage/IndexedDB)

6. Users CAN reconnect to previously paired devices from the dashboard

7. The dashboard MUST update in real-time when device status changes

---

## Technical Constraints

### Requirement 6: Browser Compatibility

**User Story:** As a user, I want to know if my browser supports the platform, so that I don't waste time on incompatible devices.

#### Business Rules

1. The system MUST support the following browsers:
   - Google Chrome (desktop: Windows, macOS, Linux)
   - Google Chrome (Android)
   - Microsoft Edge (desktop: Windows, macOS)

2. The system MUST NOT support:
   - Mozilla Firefox (no Web Bluetooth support)
   - Safari (no Web Bluetooth support)
   - iOS browsers (no Web Bluetooth support)

3. The system MUST display a clear warning message on unsupported browsers

4. The system MUST check for Web Bluetooth API availability on page load

5. Users SHOULD be directed to download a supported browser if using an incompatible one

### Requirement 7: Security Requirements

**User Story:** As a user, I want my WiFi credentials to be handled securely, so that my network remains protected.

#### Business Rules

1. The system MUST only operate over HTTPS connections

2. The system MUST require explicit user permission (browser prompt) before accessing Bluetooth

3. WiFi credentials MUST be transmitted directly to the device without server intermediaries

4. The system MUST NOT store WiFi passwords in browser storage

5. The system SHOULD implement credential encryption in production deployments

6. Users MUST initiate all Bluetooth operations through explicit actions (no automatic scanning)

---

## Data Management Requirements

### Requirement 8: Local Data Persistence

**User Story:** As a user, I want my machine list to persist across browser sessions, so that I don't have to re-discover devices every time.

#### Business Rules

1. The system MUST store the following data locally:
   - Device ID and name
   - Last connection timestamp
   - WiFi configuration status

2. The system MUST NOT store:
   - WiFi passwords
   - Sensitive device credentials

3. Users MUST be able to clear their device list manually

4. The system SHOULD use IndexedDB for structured device data storage

5. The system MUST handle storage quota limits gracefully

---

## Error Handling Requirements

### Requirement 9: User Error Communication

**User Story:** As a user, I want clear error messages when something goes wrong, so that I can troubleshoot issues effectively.

#### Business Rules

1. The system MUST provide user-friendly error messages for common failures:
   - Browser not supported
   - Bluetooth not available/disabled
   - Device connection timeout
   - WiFi connection failed
   - Invalid credentials

2. The system SHOULD provide actionable guidance with each error message

3. Users MUST be able to retry failed operations

4. The system MUST log technical errors for debugging purposes

5. The system SHOULD display connection troubleshooting tips for common issues

This requirements document defines the business logic and user interactions for the Machine IoT platform, focusing on simplified BLE-based WiFi provisioning for Raspberry Pi devices.
