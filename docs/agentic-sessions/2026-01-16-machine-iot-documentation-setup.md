# Machine IoT Documentation and Project Structure Setup

**Date**: 2026-01-16  
**Session Type**: Documentation & Architecture Planning  
**Platforms**: Machine IoT (new), Rooted Planner (existing)

## Objective

Create comprehensive documentation for the Machine IoT platform and establish a unified project structure that accommodates both Machine IoT and Rooted Planner platforms within a single web application.

## Context

The Rooted Web App will host two distinct platforms:
1. **Machine IoT** - BLE-based WiFi provisioning for Raspberry Pi devices
2. **Rooted Planner** - Microgreen farm management ERP (existing)

## Work Completed

### 1. Technology Research & Feasibility Analysis

**Web Bluetooth API Investigation:**
- ✅ Confirmed browser support: Chrome, Edge (desktop & Android)
- ❌ Not supported: Firefox, Safari, iOS browsers
- ✅ Requires HTTPS and user gesture for security
- ✅ Can discover, connect, and communicate with BLE GATT peripherals directly from browser

**bluezero Library Assessment:**
- ✅ Python library for BlueZ D-Bus API on Raspberry Pi
- ✅ Supports BLE peripheral/GATT server role
- ✅ Has examples for peripheral implementation
- ✅ Compatible with Web Bluetooth API (both use GATT protocol)

**Decision**: Web Bluetooth API + bluezero is feasible and appropriate for the use case.

### 2. Machine IoT Documentation Created

#### `docs/machine-iot/REQUIREMENTS.md`
Business requirements document following rooted-planner style:
- 9 requirement sections with user stories
- Business rules using MUST/SHOULD/CAN priorities
- Covers: device discovery, connection, WiFi provisioning, dashboard, security
- Browser compatibility constraints documented
- Error handling requirements

#### `docs/machine-iot/ARCH.md`
Technical architecture document:
- System overview with Mermaid diagrams
- Technology stack (React + Web Bluetooth API + Python bluezero)
- BLE GATT service design with custom UUIDs
- Frontend architecture (React components, hooks, state management)
- Raspberry Pi implementation (Python service structure)
- Data flow sequences
- Security considerations (HTTPS, encryption roadmap)
- Deployment strategy
- Testing approach

**Key Technical Decisions Documented:**
- Custom GATT service with 4 characteristics (SSID, Password, Status, Device Info)
- Plain text credentials in development, encryption for production
- IndexedDB for local device persistence
- No backend server (direct browser-to-device communication)
- systemd service for Raspberry Pi BLE peripheral

### 3. Unified Project Structure

#### `docs/PROJECT_STRUCTURE.md`
Comprehensive structure documentation:
- Complete directory tree for both platforms
- Platform separation strategy (route-based: `/machines/*` vs `/planner/*`)
- State management approach per platform
- File naming conventions
- Import patterns (absolute vs relative)
- Build configuration
- Development workflow
- Testing strategy

**Structure Overview:**
```
Rooted-Web-App/
├── machines/
│   ├── src/              # Web frontend (React + Web Bluetooth)
│   └── pi-src/           # Raspberry Pi BLE service (Python)
├── planner/
│   └── src/              # Farm management features
├── shared/               # Shared components and utilities
└── docs/                 # Documentation
```

### 4. Updated Root Documentation

#### `README.md`
- Updated to reflect unified application
- Documents both platforms
- Shows architecture diagram with both platforms
- Links to platform-specific documentation

### 5. Architecture Updates

Updated `docs/machine-iot/ARCH.md` to reflect unified structure:
- File paths now reference `machines/src/` and `machines/pi-src/`
- Added platform routing explanation
- Clarified state management separation between platforms
- Updated deployment paths

## Key Architectural Decisions

### Platform Separation
- **Route-based**: `/machines/*` for IoT, `/planner/*` for farm management
- **Independent state**: Machine IoT uses client-side only, Planner uses tRPC
- **Shared UI**: Common components in `shared/` directory
- **Single deployment**: Both platforms in one web app

### Machine IoT Architecture
- **Frontend**: React + TypeScript + Web Bluetooth API
- **State**: Zustand/Context + IndexedDB (no backend)
- **Device**: Python + bluezero on Raspberry Pi
- **Communication**: Direct BLE GATT (no server intermediary)

### Rooted Planner Architecture (Existing)
- **Frontend**: React + TypeScript + tRPC client
- **Backend**: Fastify + tRPC + Prisma + PostgreSQL
- **State**: React Query (server state)
- **Auth**: Clerk

## File Structure Created

```
docs/
├── machine-iot/
│   ├── REQUIREMENTS.md          # Business requirements (8,858 bytes)
│   └── ARCH.md                  # Technical architecture (18,881 bytes)
├── PROJECT_STRUCTURE.md         # Unified structure guide (new)
└── README.md                    # Updated root README
```

## Technical Specifications

### BLE GATT Service Design

**Service UUID**: `12345678-1234-5678-1234-56789abcdef0`

**Characteristics**:
1. WiFi SSID (`...def1`) - Write, UTF-8 string, max 32 bytes
2. WiFi Password (`...def2`) - Write, UTF-8 string, max 64 bytes
3. WiFi Status (`...def3`) - Read/Notify, JSON format
4. Device Info (`...def4`) - Read, JSON format

**Status Format**:
```json
{
  "status": "connecting" | "connected" | "failed",
  "message": "Optional status message",
  "ip_address": "192.168.1.100",
  "error_code": "INVALID_PASSWORD" | "NETWORK_NOT_FOUND" | null
}
```

### Browser Compatibility Matrix

| Browser | Platform | Support |
|---------|----------|---------|
| Chrome | Windows/macOS/Linux | ✅ Full |
| Chrome | Android 6.0+ | ✅ Full |
| Edge | Windows/macOS | ✅ Full |
| Firefox | All | ❌ None |
| Safari | All | ❌ None |
| iOS Browsers | All | ❌ None |

## Development Workflow Established

### Adding Machine IoT Features
1. Create feature directory in `machines/src/`
2. Add components, hooks, types
3. Update routing
4. Add tests
5. Document in `docs/machine-iot/`

### Adding Planner Features
1. Create feature directory in `planner/src/`
2. Add tRPC procedures
3. Add frontend components
4. Update routing
5. Add tests
6. Document in `docs/rooted-planner/`

## Next Steps

### Immediate (Machine IoT Implementation)
1. Set up Vite + React + TypeScript project structure
2. Implement Web Bluetooth scanner and GATT client
3. Create device discovery UI
4. Implement WiFi provisioning flow
5. Build machine dashboard
6. Develop Raspberry Pi BLE service (Python + bluezero)

### Future (Rooted Planner)
1. Implement planner features in `planner/src/`
2. Set up tRPC backend
3. Configure PostgreSQL + Prisma
4. Implement authentication with Clerk
5. Build farm management features

### Shared Infrastructure
1. Set up shared component library
2. Configure TailwindCSS + Shadcn UI
3. Establish testing framework
4. Set up CI/CD pipeline

## Lessons Learned

1. **Web Bluetooth Limitations**: Browser support is limited to Chromium-based browsers. This is acceptable for the use case but should be clearly communicated to users.

2. **Platform Separation**: Route-based separation provides clean boundaries while allowing code reuse through shared components.

3. **Documentation First**: Creating comprehensive documentation before implementation helps identify architectural issues early.

4. **State Management Strategy**: Different platforms can use different state management approaches based on their needs (client-only vs server state).

## References

- [Web Bluetooth API Specification](https://webbluetoothcg.github.io/web-bluetooth/)
- [bluezero Python Library](https://github.com/ukBaz/python-bluezero)
- [BLE GATT Protocol](https://www.bluetooth.com/specifications/specs/generic-attribute-profile/)
- [Web Bluetooth Browser Support](https://caniuse.com/web-bluetooth)

## Session Summary

Successfully created comprehensive documentation for Machine IoT platform and established a unified project structure that accommodates both Machine IoT and Rooted Planner platforms. The architecture is designed for clear separation of concerns while maximizing code reuse. All technical decisions are documented and feasibility has been validated through research.

The project is now ready for implementation with clear guidelines for both platforms.
