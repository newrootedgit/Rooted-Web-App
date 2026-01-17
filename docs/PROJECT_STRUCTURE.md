# Project Structure - Rooted Web App

## Overview

Rooted Web App is a unified application hosting two distinct platforms:
1. **Machine IoT** - BLE-based device provisioning for Raspberry Pi machines
2. **Rooted Planner** - Microgreen farm management ERP system

Both platforms share a common web application infrastructure while maintaining separate feature domains.

## Directory Structure

```
Rooted-Web-App/
│
├── src/                               # Main application source
│   ├── App.tsx                        # Root React component
│   ├── main.tsx                       # Application entry point
│   ├── index.css                      # Global styles
│   ├── lib/                           # Core utilities
│   │
│   ├── machines/                      # Machine IoT Platform (Web frontend)
│   │   ├── device-discovery/          # BLE device scanning
│   │   │   ├── components/
│   │   │   │   ├── ScanButton.tsx
│   │   │   │   └── DeviceList.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useBluetoothScanner.ts
│   │   │   │   └── useDeviceConnection.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── wifi-provisioning/         # WiFi configuration
│   │   │   ├── components/
│   │   │   │   ├── WiFiConfigModal.tsx
│   │   │   │   └── ConnectionStatus.tsx
│   │   │   ├── hooks/
│   │   │   │   ├── useWiFiProvisioning.ts
│   │   │   │   └── useConnectionStatus.ts
│   │   │   └── types.ts
│   │   │
│   │   ├── dashboard/                 # Machine management dashboard
│   │   │   ├── components/
│   │   │   │   ├── MachineCard.tsx
│   │   │   │   ├── MachineList.tsx
│   │   │   │   └── MachinesDashboard.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useMachineDashboard.ts
│   │   │   └── types.ts
│   │   │
│   │   └── lib/                       # Machine IoT utilities
│   │       ├── bluetooth/
│   │       │   ├── scanner.ts         # Web Bluetooth API wrapper
│   │       │   ├── gatt-client.ts     # GATT operations
│   │       │   └── constants.ts       # Service/Characteristic UUIDs
│   │       ├── storage/
│   │       │   └── indexeddb.ts       # Local device persistence
│   │       └── store.ts               # State management (Zustand/Context)
│   │
│   └── planner/                       # Rooted Planner Platform (Web frontend)
│       ├── products/                  # Product catalog management
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── pages/
│       │   └── types.ts
│       │
│       ├── orders/                    # Order management
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── pages/
│       │   └── types.ts
│       │
│       ├── tasks/                     # Production workflow
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── pages/
│       │   └── types.ts
│       │
│       ├── customers/                 # CRM functionality
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── pages/
│       │   └── types.ts
│       │
│       ├── farm-layout/               # Visual farm editor
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── pages/
│       │   └── types.ts
│       │
│       ├── employees/                 # Team management
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── pages/
│       │   └── types.ts
│       │
│       └── supplies/                  # Inventory tracking
│           ├── components/
│           ├── hooks/
│           ├── pages/
│           └── types.ts
│
├── machines/                          # Raspberry Pi BLE service (Python)
│   └── pi-src/
│       ├── main.py                    # Service entry point
│       ├── ble/
│       │   ├── __init__.py
│       │   ├── peripheral.py          # bluezero GATT server
│       │   ├── characteristics.py     # GATT characteristic handlers
│       │   └── constants.py           # Service UUIDs
│       ├── wifi/
│       │   ├── __init__.py
│       │   ├── manager.py             # WiFi configuration (NetworkManager)
│       │   └── status.py              # Connection status monitoring
│       ├── config/
│       │   ├── __init__.py
│       │   └── settings.py            # Service configuration
│       ├── requirements.txt           # Python dependencies
│       └── machine-iot.service        # systemd service file
│
├── apps/                              # Backend services
│   └── api/                           # Fastify + tRPC API
│       ├── src/
│       └── prisma/
│
├── shared/                            # Shared across both platforms
│   ├── ui/                            # Reusable UI components
│   │   ├── components/
│   │   └── styles/
│   ├── database/                      # Database utilities
│   └── logger/                        # Logging utilities
│
├── docs/                              # Documentation
│   ├── machine-iot/
│   │   ├── REQUIREMENTS.md            # Business requirements
│   │   └── ARCH.md                    # Technical architecture
│   │
│   ├── rooted-planner/
│   │   ├── REQUIREMENTS.md            # Business requirements
│   │   └── ARCH.md                    # Technical architecture
│   │
│   ├── agentic-sessions/              # Development session logs
│   │   └── YYYY-MM-DD-session-name.md
│   │
│   ├── upgrade-phases/                # Migration planning
│   │
│   ├── PROJECT_STRUCTURE.md           # This file
│   ├── STYLE.md                       # Code style guide
│   └── AGENT.md                       # Development guide
│
└── README.md                          # Project overview
```

## Platform Separation

### Machine IoT
- **Source**: `src/machines/`
- **Route**: `/machines/*`
- **Technology**: Pure frontend (React + Web Bluetooth API)
- **State**: Client-side only (Zustand/Context + IndexedDB)
- **Backend**: None (direct BLE communication to devices)
- **Authentication**: Not required (local device management)
- **Pi Service**: `machines/pi-src/` (Python, deployed to Raspberry Pi)

### Rooted Planner
- **Source**: `src/planner/`
- **Route**: `/planner/*`
- **Technology**: Full-stack (React + tRPC + Fastify + PostgreSQL)
- **State**: Server state via tRPC + React Query
- **Backend**: tRPC API with Prisma ORM (`apps/api/`)
- **Authentication**: Clerk

## Routing Structure

```typescript
// Root routing configuration
const routes = [
  {
    path: '/',
    element: <PlatformSelector />,  // Landing page to choose platform
  },
  {
    path: '/machines/*',
    element: <MachinesPlatform />,
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      { path: 'dashboard', element: <MachinesDashboard /> },
      { path: 'discover', element: <DeviceDiscovery /> },
      { path: 'device/:id', element: <DeviceDetail /> },
    ]
  },
  {
    path: '/planner/*',
    element: <PlannerPlatform />,
    children: [
      { index: true, element: <Navigate to="dashboard" /> },
      { path: 'dashboard', element: <PlannerDashboard /> },
      { path: 'products', element: <Products /> },
      { path: 'orders', element: <Orders /> },
      { path: 'tasks', element: <Tasks /> },
      // ... other planner routes
    ]
  }
]
```

## State Management Strategy

### Machine IoT State
```typescript
// src/machines/lib/store.ts
// Uses Zustand or React Context for client-side state
interface MachineState {
  devices: Device[];
  activeDevice: Device | null;
  connectionStatus: ConnectionStatus;
  wifiStatus: WiFiStatus;
}

// Persisted to IndexedDB for offline access
```

### Rooted Planner State
```typescript
// src/planner/ uses tRPC client
// Server state managed by React Query
// No local state management needed for server data
```

### Shared State
```typescript
// shared/ can provide common state utilities
// UI state (theme, sidebar open/closed, etc.)
```

## Build Configuration

### Development
```bash
# Start both platforms in development mode
pnpm dev

# Start only machines platform
pnpm dev:machines

# Start only planner platform
pnpm dev:planner
```

### Production Build
```bash
# Build both platforms
pnpm build

# Build machines only
pnpm build:machines

# Build planner only
pnpm build:planner
```

## Technology Stack by Platform

### Machine IoT
- React 18 + TypeScript
- Vite
- TailwindCSS + Shadcn UI
- Web Bluetooth API
- Zustand (state management)
- IndexedDB (persistence)
- Python 3.9+ (Raspberry Pi)
- bluezero (BLE peripheral)
- NetworkManager (WiFi)

### Rooted Planner
- React 18 + TypeScript
- Vite
- TailwindCSS + Shadcn UI
- tRPC + React Query
- Fastify (backend)
- Prisma ORM
- PostgreSQL + RLS
- Clerk (authentication)
- Redis (caching)

### Shared
- React 18 + TypeScript
- Vite
- TailwindCSS
- Shadcn UI components
- ESLint + Prettier

## File Naming Conventions

### React Components
- PascalCase: `MachineCard.tsx`, `WiFiConfigModal.tsx`
- Co-located styles if needed: `MachineCard.module.css`

### Hooks
- camelCase with `use` prefix: `useBluetoothScanner.ts`, `useWiFiProvisioning.ts`

### Utilities
- camelCase: `scanner.ts`, `gatt-client.ts`, `indexeddb.ts`

### Types
- PascalCase for interfaces/types: `Device`, `WiFiStatus`, `ConnectionStatus`
- File: `types.ts` within each feature directory

### Python (Raspberry Pi)
- snake_case: `peripheral.py`, `wifi_manager.py`
- PascalCase for classes: `MachinePeripheral`, `WiFiManager`

## Import Patterns

### Absolute Imports (Preferred)
```typescript
// From machines platform
import { MachineCard } from '@/machines/dashboard/components/MachineCard';
import { scanForDevices } from '@/machines/lib/bluetooth/scanner';

// From planner platform
import { ProductList } from '@/planner/products/components/ProductList';

// From shared
import { Button } from '@/shared/components/ui/button';
import { useDebounce } from '@/shared/hooks/useDebounce';
```

### Relative Imports (Within Feature)
```typescript
// Within src/machines/device-discovery/
import { ScanButton } from './components/ScanButton';
import { useBluetoothScanner } from './hooks/useBluetoothScanner';
```

## Development Workflow

### Adding Machine IoT Features
1. Create feature directory in `src/machines/`
2. Add components, hooks, and types
3. Update routing in machines platform
4. Add tests
5. Document in `docs/machine-iot/`

### Adding Planner Features
1. Create feature directory in `src/planner/`
2. Add tRPC procedures in backend (`apps/api/`)
3. Add components and hooks in frontend
4. Update routing in planner platform
5. Add tests
6. Document in `docs/rooted-planner/`

### Adding Shared Components
1. Create component in `shared/components/`
2. Ensure platform-agnostic (no platform-specific logic)
3. Add to Storybook if applicable
4. Document usage

## Testing Strategy

### Machine IoT
- Unit tests: Bluetooth utilities, state management
- Integration tests: Mock Web Bluetooth API
- E2E tests: Playwright with BLE mocking

### Rooted Planner
- Unit tests: Business logic, utilities
- Integration tests: tRPC procedures
- E2E tests: Full user flows

### Shared
- Unit tests: All shared utilities and hooks
- Component tests: Storybook + Testing Library

## Deployment

### Web Application
- Single deployment for both platforms
- Route-based platform separation
- Static hosting (Cloudflare Pages, Vercel, Netlify)
- HTTPS required (Web Bluetooth requirement)

### Raspberry Pi Service
- Separate deployment to each device
- systemd service for auto-start
- Independent of web application deployment

## Future Considerations

### Monorepo Structure (Future)
If complexity grows, consider migrating to:
```
packages/
├── machines-web/
├── planner-web/
├── planner-api/
├── shared-ui/
└── shared-utils/
```

### Micro-frontends (Future)
If platforms need independent deployment:
- Module Federation
- Separate build pipelines
- Shared component library

This structure provides clear separation between platforms while maximizing code reuse and maintaining a unified development experience.
