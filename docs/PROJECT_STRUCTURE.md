# Project Structure - Rooted Web App

## Overview

Rooted Web App is a unified application designed to host two distinct platforms:
1. **Machine IoT** - BLE-based device provisioning for Raspberry Pi machines ✅ **IMPLEMENTED**
2. **Rooted Planner** - Microgreen farm management ERP system 🚧 **PLANNED**

The application uses a multi-tenant architecture with shared authentication (Clerk) and backend infrastructure (Fastify + tRPC + PostgreSQL/TimescaleDB). Currently, only the Machine IoT platform is fully implemented.

## Directory Structure

```
Rooted-Web-App/
│
├── src/                               # Main application source (Frontend)
│   ├── App.tsx                        # Root React component with routing
│   ├── main.tsx                       # Application entry point
│   ├── index.css                      # Global styles (Tailwind)
│   │
│   ├── lib/                           # Core frontend utilities
│   │   ├── bluetooth/                 # ✅ Web Bluetooth API integration
│   │   │   ├── scanner.ts             # BLE device scanning
│   │   │   ├── gatt-client.ts         # GATT client operations
│   │   │   └── constants.ts           # Service/Characteristic UUIDs
│   │   ├── trpc/                      # ✅ tRPC client setup
│   │   │   ├── client.ts              # tRPC client configuration
│   │   │   ├── TRPCProvider.tsx       # React Query provider
│   │   │   └── index.ts
│   │   └── utils.ts                   # Utility functions (cn, etc.)
│   │
│   ├── auth/                          # ✅ Authentication (Clerk)
│   │   ├── AuthPage.tsx               # Sign-in/sign-up page
│   │   ├── components/
│   │   │   └── ProtectedRoute.tsx     # Route protection wrapper
│   │   └── index.ts
│   │
│   ├── onboarding/                    # ✅ User onboarding flow
│   │   └── OnboardingPage.tsx         # Tenant/farm creation
│   │
│   ├── machines/                      # ✅ Machine IoT Platform (IMPLEMENTED)
│   │   ├── MachinesPage.tsx           # Platform entry point
│   │   ├── index.ts
│   │   │
│   │   ├── device-discovery/          # ✅ BLE device onboarding
│   │   │   ├── components/
│   │   │   │   └── OnboardMachine.tsx # Device discovery & onboarding UI
│   │   │   └── hooks/
│   │   │       └── useOnboardMachine.ts # BLE onboarding logic
│   │   │
│   │   ├── wifi-provisioning/         # ✅ WiFi configuration
│   │   │   ├── components/
│   │   │   │   └── ChangeWifiModal.tsx # WiFi credential input
│   │   │   └── hooks/
│   │   │       └── useChangeWifi.ts    # WiFi provisioning logic
│   │   │
│   │   ├── dashboard/                 # ✅ Machine management
│   │   │   ├── MachinesDashboard.tsx  # Main dashboard view
│   │   │   ├── components/
│   │   │   │   ├── MachineCard.tsx    # Individual machine card
│   │   │   │   ├── MachinesList.tsx   # Machine list view
│   │   │   │   ├── BluetoothIndicator.tsx # BLE status indicator
│   │   │   │   └── StatusBanner.tsx   # Status messages
│   │   │   ├── hooks/
│   │   │   │   ├── useBluetoothScanner.ts # BLE scanning
│   │   │   │   └── useBluetoothSupport.ts # Browser support check
│   │   │   └── styles/                # Component-specific styles
│   │   │
│   │   └── utils/
│   │       └── machine-images.ts      # Machine image helpers
│   │
│   ├── admin/                         # ✅ Admin portal (IMPLEMENTED)
│   │   ├── App.tsx                    # Admin app root
│   │   ├── main.tsx                   # Admin entry point
│   │   ├── pages/
│   │   │   └── Dashboard.tsx          # Admin dashboard
│   │   ├── components/
│   │   │   ├── TenantOverview.tsx     # Tenant management
│   │   │   ├── TenantCard.tsx         # Tenant card component
│   │   │   └── MachineList.tsx        # Machine list for admin
│   │   └── lib/
│   │       └── trpc.ts                # Admin tRPC client
│   │
│   └── planner/                       # 🚧 Rooted Planner Platform (NOT IMPLEMENTED)
│       ├── PlannerPage.tsx            # Placeholder page
│       └── index.ts
│
├── pi-src/                            # ✅ Raspberry Pi BLE service (Python)
│   ├── provisioner.py                 # Main BLE peripheral service
│   ├── aws_iot_registration.py        # AWS IoT Core registration
│   ├── ble-wrapper.sh                 # Service wrapper script
│   ├── deploy-to-pi-one.sh            # Deployment script (basic)
│   ├── deploy-to-pi-two.sh            # Deployment script (with AWS IoT)
│   ├── deploy-with-iot.sh             # AWS IoT deployment
│   ├── setup-aws-iot.sh               # AWS IoT setup
│   ├── requirements.txt               # Python dependencies
│   └── setup-scripts/                 # Pi setup utilities
│       ├── setup-nm.sh                # NetworkManager setup
│       └── setup-ethernet.sh          # Ethernet configuration
│
├── apps/                              # Backend services
│   └── api/                           # ✅ Fastify + tRPC API (IMPLEMENTED)
│       ├── src/
│       │   ├── index.ts               # Fastify server entry point
│       │   │
│       │   ├── lib/                   # Core backend utilities
│       │   │   ├── trpc/              # tRPC setup
│       │   │   │   ├── trpc.ts        # tRPC instance & procedures
│       │   │   │   ├── context.ts     # Request context
│       │   │   │   ├── router.ts      # Root router
│       │   │   │   └── pagination/    # Pagination helpers
│       │   │   ├── auth/              # Authentication
│       │   │   │   ├── middleware.ts  # Clerk JWT validation
│       │   │   │   ├── admin.ts       # Admin authorization
│       │   │   │   └── types.ts       # Auth types
            ├── db/                # Database clients
            │   ├── index.ts       # Prisma client (PostgreSQL)
            │   └── timescale.ts   # TimescaleDB pool (Telemetry)
│       │   │   ├── errors/            # Error handling
│       │   │   │   ├── base-error.ts  # Base error class
│       │   │   │   ├── http-errors.ts # HTTP error classes
│       │   │   │   ├── error-handler.ts # Error transformation
│       │   │   │   └── types.ts       # Error types
│       │   │   └── logger/            # Logging
│       │   │       ├── logger.ts      # Logger implementation
│       │   │       └── types.ts       # Logger types
│       │   │
│       │   ├── domains/               # Domain-driven design
│       │   │   ├── machine-domain/    # ✅ Machine IoT domain
│       │   │   │   ├── router.ts      # tRPC router
│       │   │   │   ├── internal-routes.ts # Internal HTTP routes
│       │   │   │   ├── types.ts       # Domain types
│       │   │   │   ├── commands/      # Write operations
│       │   │   │   │   ├── createOrUpdateMachine.ts
│       │   │   │   │   ├── deleteMachine.ts
│       │   │   │   │   ├── handleLifecycleEvent.ts
│       │   │   │   │   └── __tests__/
│       │   │   │   └── queries/       # Read operations
│       │   │   │       ├── getMachine.ts
│       │   │   │       ├── getMachineById.ts
│       │   │   │       ├── getMachinesByFarm.ts
│       │   │   │       ├── getMachinesByTenant.ts
│       │   │   │       ├── listMachines.ts
│       │   │   │       ├── findMachineByDeviceId.ts
│       │   │   │       └── __tests__/
│       │   │   │
│       │   │   ├── admin-domain/      # ✅ Admin operations
│       │   │   │   ├── router.ts
│       │   │   │   ├── types.ts
│       │   │   │   └── queries/
│       │   │   │       ├── getAllTenants.ts
│       │   │   │       └── getTenantMachines.ts
│       │   │   │
│       │   │   ├── onboarding-domain/ # ✅ User onboarding
│       │   │   │   ├── router.ts
│       │   │   │   ├── types.ts
│       │   │   │   └── commands/
│       │   │   │       ├── createTenantAndFarm.ts
│       │   │   │       └── getOnboardingStatus.ts
│       │   │   │
│       │   │   ├── user-domain/       # 🚧 User management (STUB)
│       │   │   │   ├── router.ts      # Empty
│       │   │   │   ├── types.ts
│       │   │   │   ├── commands/      # Placeholder files
│       │   │   │   └── query/         # Placeholder files
│       │   │   │
│       │   │   └── planner-domain/    # 🚧 Planner features (NOT IMPLEMENTED)
│       │   │       └── (empty)
│       │   │
│       │   ├── generated/             # Generated Prisma client
│       │   │   └── prisma/
│       │   │
│       │   └── test/                  # Test utilities
│       │       └── mockPrisma.ts      # Prisma mocks
│       │
│       ├── prisma/                    # Database schema
│       │   ├── schema.prisma          # Prisma schema definition
│       │   └── migrations/            # Database migrations
│       │
│       ├── prisma.config.ts           # Prisma configuration
│       ├── vitest.config.ts           # Test configuration
│       └── package.json
│
├── shared/                            # ✅ Shared code
│   ├── ui/                            # Shared UI components (Shadcn)
│   │   └── components/
│   │       ├── AppHeader/             # Application header
│   │       ├── AppLayout/             # Layout wrapper
│   │       ├── Sidebar/               # Navigation sidebar
│   │       ├── Header/                # Generic header
│   │       ├── Logo/                  # Logo component
│   │       └── ComingSoon/            # Placeholder component
│   │
│   ├── types/                         # Shared TypeScript types
│   │   ├── machines.ts                # Machine types
│   │   ├── bluetooth.ts               # Bluetooth types
│   │   └── index.ts
│   │
│   ├── api-types/                     # API type definitions
│   │   └── index.ts
│   │
│   └── index.ts                       # Shared exports
│
├── infra/                             # ✅ Infrastructure code
│   └── lambda/
│       └── machine-lifecycle/         # AWS IoT lifecycle Lambda
│           └── index.js               # Lambda handler
│
├── docker/                            # Docker configuration
│   └── docker-compose.yml             # Local development stack
│
├── docs/                              # Documentation
│   ├── machine-iot/                   # Machine IoT docs
│   │   ├── REQUIREMENTS.md            # Business requirements
│   │   ├── ARCH.md                    # Technical architecture
│   │   ├── IMPLEMENTATION_TASKS.md    # Implementation checklist
│   │   └── MACHINE_DOCUMENTATION_UPGRADE.md
│   │
│   ├── rooted-planner/                # Rooted Planner docs
│   │   ├── REQUIREMENTS.md            # Business requirements (planned)
│   │   └── ARCH.md                    # Technical architecture (planned)
│   │
│   ├── upgrade-phases/                # Deployment & upgrade guides
│   │   ├── README.md
│   │   ├── ADMIN_PORTAL.md
│   │   ├── ADMIN_PORTAL_QUICKSTART.md
│   │   ├── DEPLOYMENT_PHASE_1.md
│   │   ├── INFRASTRUCTURE_SETUP.md
│   │   ├── IOT_CONNECTIVITY.md
│   │   └── AWS_IOT_CONNECTIVITY.md
│   │
│   ├── agentic-sessions/              # Development session logs
│   │   ├── 2026-01-11-basic-spec-documentation-setup.md
│   │   ├── 2026-01-16-machine-iot-documentation-setup.md
│   │   └── 2026-01-19-user-onboarding-implementation.md
│   │
│   ├── PROJECT_STRUCTURE.md           # This file
│   ├── STYLE.md                       # Code style guide
│   ├── AGENT.md                       # Development guide
│   └── DATABASE_SCHEMA.md             # Database schema documentation
│
├── .env.example                       # Environment variables template
├── .gitignore
├── package.json                       # Root package.json
├── tsconfig.json                      # TypeScript configuration
├── vite.config.ts                     # Vite configuration
├── tailwind.config.js                 # Tailwind CSS configuration
└── README.md                          # Project overview
```

## Platform Separation

### Machine IoT ✅ **FULLY IMPLEMENTED**
- **Source**: `src/machines/`
- **Route**: `/machines/*`
- **Technology**: React + Web Bluetooth API + tRPC for backend communication
- **State**: Client-side BLE operations, server-side machine registry
- **Backend**: tRPC API for machine management (`apps/api/src/domains/machine-domain/`)
- **Authentication**: Clerk (shared with Planner)
- **Pi Service**: `pi-src/` (Python BLE peripheral, deployed to Raspberry Pi)
- **AWS Integration**: AWS IoT Core for device connectivity monitoring

**Implemented Features:**
- BLE device discovery and onboarding
- WiFi provisioning via Web Bluetooth
- Machine dashboard with status monitoring
- AWS IoT Core integration for connectivity tracking
- Multi-tenant machine management
- Admin portal for cross-tenant machine viewing

### Rooted Planner 🚧 **NOT IMPLEMENTED**
- **Source**: `src/planner/` (placeholder only)
- **Route**: `/planner/*`
- **Technology**: React + tRPC + Fastify + PostgreSQL/TimescaleDB (planned)
- **State**: Server state via tRPC + React Query (planned)
- **Backend**: `apps/api/src/domains/planner-domain/` (not created yet)
- **Authentication**: Clerk (shared infrastructure ready)

**Status**: Only placeholder page exists. Full implementation pending.

## Routing Structure

```typescript
// Actual routing configuration (src/App.tsx)
const routes = [
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      { index: true, element: <Navigate to="/machines" /> },  // Default to machines
      
      // ✅ Machine IoT routes (IMPLEMENTED)
      {
        path: 'machines',
        element: <MachinesPage />,
        children: [
          { index: true, element: <MachinesDashboard /> },
        ]
      },
      
      // 🚧 Planner routes (PLACEHOLDER)
      {
        path: 'planner',
        element: <PlannerPage />,  // Shows "Coming Soon" message
      },
      
      // ✅ Onboarding (IMPLEMENTED)
      {
        path: 'onboarding',
        element: <OnboardingPage />,  // Tenant/farm creation
      },
    ]
  },
  
  // ✅ Authentication (IMPLEMENTED)
  {
    path: '/auth',
    element: <AuthPage />,  // Clerk sign-in/sign-up
  },
  
  // ✅ Admin portal (IMPLEMENTED - separate entry point)
  // Accessed via /admin.html
]
```

**Note**: The application currently has two separate entry points:
- **Main App** (`/index.html`): User-facing machine management
- **Admin Portal** (`/admin.html`): Cross-tenant admin dashboard

## State Management Strategy

### Machine IoT State ✅ **IMPLEMENTED**

**BLE Operations** (Client-side only):
- Web Bluetooth API handles device discovery and GATT communication
- No persistent state management library (React hooks + local state)
- BLE connections are ephemeral (used only for WiFi provisioning)

**Machine Registry** (Server-side via tRPC):
```typescript
// Backend: apps/api/src/domains/machine-domain/
// Machines stored in PostgreSQL with multi-tenant isolation
// tRPC procedures for CRUD operations

// Frontend: src/machines/dashboard/
// React Query manages server state automatically via tRPC
const { data: machines } = trpc.machines.list.useQuery();
```

**No IndexedDB or Local Storage**:
- Machines are fetched from backend on each page load
- BLE connections are temporary (only during onboarding/WiFi changes)

### Rooted Planner State 🚧 **NOT IMPLEMENTED**
```typescript
// Planned: src/planner/ will use tRPC client
// Server state managed by React Query
// No local state management needed for server data
```

### Shared State ✅ **MINIMAL**
- Clerk authentication state (managed by Clerk SDK)
- No global UI state management currently implemented

## Build Configuration

### Development
```bash
# Start frontend development server (Vite)
pnpm dev  # Runs on http://localhost:5173

# Start backend API server (Fastify)
cd apps/api
pnpm dev  # Runs on http://localhost:3001

# Start database (Docker)
docker compose -f docker/docker-compose.yml up -d
```

### Production Build
```bash
# Build frontend
pnpm build  # Outputs to dist/

# Build backend
cd apps/api
pnpm build  # Outputs to dist/

# Docker deployment
docker compose -f docker/docker-compose.prod.yml up -d
```

**Note**: Currently no separate build commands for machines vs planner since planner is not implemented.

## Technology Stack by Platform

### Machine IoT ✅ **IMPLEMENTED**
- React 18 + TypeScript
- Vite
- TailwindCSS + Shadcn UI
- Web Bluetooth API
- tRPC + React Query (for backend communication)
- Clerk (authentication)
- Python 3.9+ (Raspberry Pi)
- bluezero (BLE peripheral)
- NetworkManager (WiFi)
- AWS IoT Core SDK (device connectivity)

### Rooted Planner 🚧 **NOT IMPLEMENTED**
- React 18 + TypeScript (planned)
- Vite (planned)
- TailwindCSS + Shadcn UI (planned)
- tRPC + React Query (planned)
- Fastify (backend - infrastructure ready)
- Prisma ORM (infrastructure ready)
- PostgreSQL + RLS (infrastructure ready)
- TimescaleDB (telemetry - infrastructure ready)
- Clerk (authentication - infrastructure ready)
- Redis (caching - not yet integrated)

### Shared ✅ **IMPLEMENTED**
- React 18 + TypeScript
- Vite
- TailwindCSS
- Shadcn UI components
- Clerk authentication
- Fastify + tRPC backend
- PostgreSQL with Prisma
- TimescaleDB (Telemetry)
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

### Adding Machine IoT Features ✅
1. **Frontend**: Add components/hooks in `src/machines/`
2. **Backend**: Add tRPC procedures in `apps/api/src/domains/machine-domain/`
3. **Database**: Update Prisma schema if needed
4. **Pi Service**: Update `pi-src/provisioner.py` for BLE changes
5. **Testing**: Add tests in `__tests__/` directories
6. **Documentation**: Update `docs/machine-iot/`

### Adding Planner Features 🚧 **NOT YET AVAILABLE**
1. Create `apps/api/src/domains/planner-domain/` structure
2. Implement tRPC routers and procedures
3. Create frontend features in `src/planner/`
4. Update Prisma schema for planner tables
5. Add routing and navigation
6. Document in `docs/rooted-planner/`

### Adding Shared Components ✅
1. Create component in `shared/ui/components/`
2. Ensure platform-agnostic (no platform-specific logic)
3. Export from `shared/index.ts`
4. Document usage in component file

### Current Development Focus
- **Machine IoT**: Fully functional, ready for production deployment
- **Admin Portal**: Operational for cross-tenant management
- **Rooted Planner**: Not started - requires full domain implementation

## Testing Strategy

### Machine IoT ✅ **PARTIALLY IMPLEMENTED**
- **Unit tests**: Backend commands and queries (`__tests__/` directories)
- **Integration tests**: tRPC procedures with mock Prisma
- **E2E tests**: Not yet implemented
- **BLE Testing**: Manual testing with actual Raspberry Pi devices

**Existing Tests:**
- `apps/api/src/domains/machine-domain/commands/__tests__/createOrUpdateMachine.test.ts`
- `apps/api/src/domains/machine-domain/queries/__tests__/listMachines.test.ts`
- `apps/api/src/domains/machine-domain/queries/__tests__/getMachine.test.ts`

### Rooted Planner 🚧 **NOT IMPLEMENTED**
- Unit tests: Planned
- Integration tests: Planned
- E2E tests: Planned

### Shared ✅ **INFRASTRUCTURE READY**
- Vitest configured (`apps/api/vitest.config.ts`)
- Mock utilities available (`apps/api/src/test/mockPrisma.ts`)
- Test patterns established in machine-domain tests

## Deployment

### Web Application ✅ **PRODUCTION READY**
- Single deployment for both platforms (though only Machine IoT is functional)
- Route-based platform separation (`/machines`, `/planner`)
- Static hosting compatible (Cloudflare Pages, Vercel, Netlify)
- HTTPS required (Web Bluetooth requirement)
- Separate admin portal entry point (`/admin.html`)

**Current Deployment:**
- Frontend: Static build deployed to hosting service
- Backend: Fastify server (can run on AWS EC2, Heroku, etc.)
- Database: PostgreSQL (managed service or self-hosted)

### Raspberry Pi Service ✅ **PRODUCTION READY**
- Deployment scripts: `pi-src/deploy-to-pi-one.sh`, `pi-src/deploy-to-pi-two.sh`
- systemd service for auto-start
- AWS IoT Core integration for connectivity monitoring
- Independent of web application deployment
- Setup scripts for NetworkManager and Ethernet configuration

**Deployment Process:**
1. Run setup scripts on Pi (`setup-nm.sh`, `setup-ethernet.sh`)
2. Deploy BLE service with deployment script
3. Configure AWS IoT Core (if using connectivity monitoring)
4. Service starts automatically on boot

### AWS Infrastructure ✅ **IMPLEMENTED**
- **AWS IoT Core**: Device registry and connectivity monitoring
- **AWS Lambda**: Machine lifecycle event handler (`infra/lambda/machine-lifecycle/`)
- **IAM Roles**: Configured for IoT Core and Lambda integration

## Future Considerations

### Rooted Planner Implementation 🚧 **NEXT MAJOR MILESTONE**
Before considering monorepo restructuring, the Rooted Planner platform needs to be implemented:
1. Create `apps/api/src/domains/planner-domain/` with all business logic
2. Implement frontend features in `src/planner/`
3. Add Prisma schema tables for planner entities
4. Build out all planned features (products, orders, tasks, etc.)

### Monorepo Structure (Future)
Current structure is sufficient for now. Consider migrating to packages if:
- Planner becomes large enough to warrant separation
- Need independent deployment of platforms
- Team grows and needs better code ownership boundaries

```
packages/
├── machines-web/
├── planner-web/
├── planner-api/
├── shared-ui/
└── shared-utils/
```

### Micro-frontends (Future)
Only consider if platforms need independent deployment:
- Module Federation
- Separate build pipelines
- Shared component library

**Current Assessment**: Not needed. Single deployment works well for current scale.

### Performance Optimizations (Future)
- Code splitting by route (already possible with React.lazy)
- Redis caching for tRPC procedures
- Database query optimization
- CDN for static assets

This structure provides clear separation between platforms while maximizing code reuse and maintaining a unified development experience. The focus should be on implementing Rooted Planner before considering architectural changes.
