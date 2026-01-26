# Agent Development Guide - Rooted Web App

## Overview

This document outlines how AI coding agents can effectively support developers working on the Rooted Web App codebase. The project consists of two platforms: **Machine IoT** (fully implemented) and **Rooted Planner** (not yet implemented).

## Project Context Understanding

### Current Implementation Status

**✅ Machine IoT Platform - FULLY IMPLEMENTED**
- BLE-based device provisioning for Raspberry Pi machines
- Web Bluetooth API integration for WiFi configuration
- Multi-tenant machine management with PostgreSQL
- AWS IoT Core integration for connectivity monitoring
- Admin portal for cross-tenant machine viewing
- Production-ready deployment scripts

**🚧 Rooted Planner Platform - NOT IMPLEMENTED**
- Microgreen farm management application (planned)
- Only placeholder page exists
- Backend domain structure not created
- Database schema defined but tables not used
- Full implementation pending

### Core Business Domains

**Machine IoT (Active):**
- Device onboarding via Web Bluetooth
- WiFi provisioning through BLE GATT characteristics
- Machine registry with multi-tenant isolation
- AWS IoT Core connectivity monitoring
- Admin dashboard for system-wide machine management

**Rooted Planner (Planned):**
- Microgreen farm production workflow management
- Order → Tasks (SOAK → SEED → MOVE_TO_LIGHT → HARVEST)
- Multi-tenant architecture with farm isolation
- Real-world operations tracking (trays, yields, customers, employees)

### Technical Architecture
- **Frontend**: React 18 + TypeScript + Vite + TailwindCSS
- **Backend**: Fastify + tRPC + Prisma ORM + PostgreSQL
- **Auth**: Clerk with JWT-based multi-tenancy
- **Machine IoT Specific**: Web Bluetooth API + Python BLE peripheral + AWS IoT Core
- **Deployment**: Docker containers, static hosting for frontend, AWS infrastructure

### Current Codebase Structure

```
Rooted-Web-App/
├── src/                          # Frontend (React + Vite)
│   ├── machines/                 # ✅ Machine IoT (IMPLEMENTED)
│   ├── planner/                  # 🚧 Placeholder only
│   ├── admin/                    # ✅ Admin portal (IMPLEMENTED)
│   ├── auth/                     # ✅ Clerk integration (IMPLEMENTED)
│   ├── onboarding/               # ✅ Tenant/farm creation (IMPLEMENTED)
│   └── lib/                      # ✅ Shared utilities (IMPLEMENTED)
│
├── apps/api/                     # Backend (Fastify + tRPC)
│   └── src/
│       ├── domains/
│       │   ├── machine-domain/   # ✅ IMPLEMENTED
│       │   ├── admin-domain/     # ✅ IMPLEMENTED
│       │   ├── onboarding-domain/# ✅ IMPLEMENTED
│       │   ├── user-domain/      # 🚧 Stub only
│       │   └── planner-domain/   # 🚧 NOT CREATED
│       └── lib/                  # ✅ Core infrastructure (IMPLEMENTED)
│
├── pi-src/                       # ✅ Raspberry Pi BLE service (IMPLEMENTED)
├── shared/                       # ✅ Shared UI components (IMPLEMENTED)
├── infra/                        # ✅ AWS Lambda functions (IMPLEMENTED)
└── docs/                         # Documentation
```

## Development Workflow Support

### Initial Project Setup

**Agent Tasks:**
1. **Environment Setup**
   ```bash
   # Clone and install dependencies
   git clone <repo>
   cd Rooted-Web-App
   pnpm install
   
   # Setup environment files
   cp .env.example .env
   cp apps/api/.env.example apps/api/.env
   
   # Configure Clerk keys (required)
   # VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
   # CLERK_SECRET_KEY=sk_test_...
   ```

2. **Database Initialization**
   ```bash
   # Start PostgreSQL container
   docker compose -f docker/docker-compose.yml up -d
   
   # Run Prisma migrations
   cd apps/api
   pnpm prisma migrate dev
   pnpm prisma generate
   ```

3. **Development Servers**
   ```bash
   # Terminal 1: Frontend (port 5173)
   pnpm dev
   
   # Terminal 2: Backend API (port 3001)
   cd apps/api
   pnpm dev
   ```

4. **Verify Setup**
   - Frontend: http://localhost:5173
   - Backend: http://localhost:3001/health (if health endpoint exists)
   - Admin Portal: http://localhost:5173/admin.html

### Code Navigation Assistance

**Help developers understand the actual structure:**

```
Key Directories:
├── src/machines/                 # ✅ Machine IoT frontend
│   ├── dashboard/                # Machine list and management
│   ├── device-discovery/         # BLE onboarding flow
│   └── wifi-provisioning/        # WiFi configuration
│
├── apps/api/src/domains/
│   ├── machine-domain/           # ✅ Machine backend logic
│   │   ├── router.ts             # tRPC procedures
│   │   ├── internal-routes.ts    # HTTP endpoints for AWS IoT
│   │   ├── commands/             # Write operations
│   │   └── queries/              # Read operations
│   │
│   ├── admin-domain/             # ✅ Admin operations
│   ├── onboarding-domain/        # ✅ User onboarding
│   └── planner-domain/           # 🚧 NOT CREATED YET
│
├── pi-src/                       # ✅ Raspberry Pi BLE service
│   ├── provisioner.py            # Main BLE peripheral
│   ├── aws_iot_registration.py  # AWS IoT integration
│   └── deploy-*.sh               # Deployment scripts
│
└── shared/ui/components/         # ✅ Reusable UI components
```

**Key Files to Understand:**
- `apps/api/prisma/schema.prisma` - Database schema (multi-tenant structure)
- `apps/api/src/lib/trpc/trpc.ts` - tRPC setup and procedures
- `apps/api/src/lib/auth/middleware.ts` - Clerk authentication
- `src/lib/bluetooth/gatt-client.ts` - Web Bluetooth GATT operations
- `pi-src/provisioner.py` - BLE peripheral implementation

## Common Development Tasks

### 1. Adding Machine IoT Features ✅

**Agent Workflow for Machine Domain:**

1. **Understand Requirements**
   - Machine IoT is production-ready
   - Focus on enhancements or bug fixes
   - Reference `docs/machine-iot/` for architecture

2. **Backend Changes (tRPC Procedures)**
   ```typescript
   // apps/api/src/domains/machine-domain/router.ts
   export const machineRouter = router({
     list: protectedProcedure
       .query(async ({ ctx }) => {
         return listMachines(ctx.db, ctx.auth.tenantId, ctx.auth.farmId);
       }),
     
     create: protectedProcedure
       .input(createMachineSchema)
       .mutation(async ({ ctx, input }) => {
         return createOrUpdateMachine(ctx.db, input);
       }),
   });
   ```

3. **Frontend Changes (React Components)**
   ```typescript
   // src/machines/dashboard/components/NewFeature.tsx
   export const NewFeature = () => {
     const { data: machines } = trpc.machines.list.useQuery();
     
     // Component implementation
   };
   ```

4. **Testing**
   ```bash
   cd apps/api
   pnpm test  # Run existing tests
   # Add new tests in __tests__/ directories
   ```

### 2. Starting Rooted Planner Implementation 🚧

**Agent Workflow for NEW Planner Features:**

1. **Create Domain Structure**
   ```bash
   mkdir -p apps/api/src/domains/planner-domain/{commands,queries}
   touch apps/api/src/domains/planner-domain/{router.ts,types.ts}
   ```

2. **Define Database Schema**
   ```prisma
   // apps/api/prisma/schema.prisma
   // Add planner-specific tables (products, orders, tasks, etc.)
   // Reference DATABASE_SCHEMA.md for full schema
   ```

3. **Create tRPC Router**
   ```typescript
   // apps/api/src/domains/planner-domain/router.ts
   export const plannerRouter = router({
     products: productRouter,
     orders: orderRouter,
     tasks: taskRouter,
     // ... other sub-routers
   });
   ```

4. **Build Frontend Features**
   ```bash
   mkdir -p src/planner/{products,orders,tasks,customers}
   # Create components, hooks, and pages
   ```

5. **Update Root Router**
   ```typescript
   // apps/api/src/lib/trpc/router.ts
   export const appRouter = router({
     machines: machineRouter,
     planner: plannerRouter,  // Add this
     admin: adminRouter,
     onboarding: onboardingRouter,
   });
   ```

### 3. Debugging Machine IoT Issues ✅

**Agent Debugging Support:**

1. **BLE Connection Issues**
   ```typescript
   // Check browser support
   if (!navigator.bluetooth) {
     console.error('Web Bluetooth not supported');
   }
   
   // Check GATT client logs
   // src/lib/bluetooth/gatt-client.ts has detailed error handling
   ```

2. **tRPC Errors**
   ```typescript
   // Common patterns in machine-domain
   
   // Check authentication
   if (!ctx.auth.tenantId || !ctx.auth.farmId) {
     throw new TRPCError({ code: 'UNAUTHORIZED' });
   }
   
   // Check database queries
   // apps/api/src/domains/machine-domain/queries/
   ```

3. **AWS IoT Connectivity**
   ```bash
   # Check Lambda logs
   # infra/lambda/machine-lifecycle/index.js
   
   # Verify IoT Core thing registration
   aws iot describe-thing --thing-name <machine-name>
   ```

4. **Database Issues**
   ```bash
   # Check Prisma client
   cd apps/api
   pnpm prisma studio  # Open database GUI
   
   # Verify migrations
   pnpm prisma migrate status
   ```

### 3. Testing Support ✅

**Agent Testing Assistance:**

1. **Unit Tests (Vitest)**
   ```typescript
   // apps/api/src/domains/machine-domain/commands/__tests__/createOrUpdateMachine.test.ts
   import { describe, it, expect, beforeEach } from 'vitest';
   import { createMockPrisma } from '../../../test/mockPrisma';
   import { createOrUpdateMachine } from '../createOrUpdateMachine';
   
   describe('createOrUpdateMachine', () => {
     let mockDb: ReturnType<typeof createMockPrisma>;
     
     beforeEach(() => {
       mockDb = createMockPrisma();
     });
     
     it('creates a new machine', async () => {
       const input = {
         deviceId: 'test-device',
         name: 'Test Machine',
         tenantId: 'tenant-1',
         farmId: 'farm-1',
         onboardedBy: 'user-1',
       };
       
       const result = await createOrUpdateMachine(mockDb, input);
       expect(result.deviceId).toBe('test-device');
     });
   });
   ```

2. **Running Tests**
   ```bash
   cd apps/api
   pnpm test                    # Run all tests
   pnpm test createOrUpdate     # Run specific test
   pnpm test --coverage         # With coverage
   ```

3. **Integration Tests (tRPC)**
   ```typescript
   // Test tRPC procedures with mock context
   import { appRouter } from '../lib/trpc/router';
   import { createMockContext } from '../test/mockContext';
   
   const ctx = createMockContext({
     auth: { tenantId: 'tenant-1', farmId: 'farm-1' }
   });
   
   const caller = appRouter.createCaller(ctx);
   const machines = await caller.machines.list();
   ```

4. **E2E Tests (Not Implemented)**
   ```bash
   # Playwright or Cypress would go here
   # Focus on critical user flows:
   # - Machine onboarding via BLE
   # - WiFi provisioning
   # - Dashboard navigation
   ```

## Code Quality Assistance

### 1. Code Review Support

**Agent Review Checklist:**

```typescript
// ✅ Type Safety
- All tRPC procedures have proper input/output types
- Zod schemas used for validation where needed
- Minimal 'any' types (TypeScript strict mode)

// ✅ Multi-Tenancy
- All database queries include tenantId and farmId filtering
- Clerk authentication properly validated
- Row-level security enforced at database level

// ✅ Error Handling
- Proper error types from apps/api/src/lib/errors/
- User-friendly error messages
- Logging for debugging

// ✅ Security
- Input validation with Zod
- Authorization checks in tRPC middleware
- No sensitive data in client-side code
- HTTPS required for Web Bluetooth

// ✅ Consistency
- Follows naming conventions from STYLE.md
- Component structure matches established patterns
- Import organization is consistent
```

### 2. Refactoring Support

**Common Refactoring Patterns:**

1. **Extract tRPC Procedures**
   ```typescript
   // Before: Logic in router
   list: protectedProcedure.query(async ({ ctx }) => {
     const machines = await ctx.db.machine.findMany({
       where: { tenantId: ctx.auth.tenantId, farmId: ctx.auth.farmId }
     });
     return machines;
   });
   
   // After: Extract to queries/
   // apps/api/src/domains/machine-domain/queries/listMachines.ts
   export const listMachines = async (
     db: PrismaClient,
     tenantId: string,
     farmId: string
   ) => {
     return db.machine.findMany({
       where: { tenantId, farmId },
       orderBy: { createdAt: 'desc' }
     });
   };
   
   // Router becomes cleaner
   list: protectedProcedure.query(({ ctx }) => 
     listMachines(ctx.db, ctx.auth.tenantId, ctx.auth.farmId)
   );
   ```

2. **Component Composition**
   ```typescript
   // Before: Large monolithic component
   const MachinesDashboard = () => {
     // 200+ lines of JSX and logic
   };
   
   // After: Composed components
   const MachinesDashboard = () => (
     <div>
       <StatusBanner />
       <BluetoothIndicator />
       <MachinesList />
     </div>
   );
   ```

### 3. Performance Optimization

**Agent Performance Guidance:**

1. **Database Optimization**
   ```sql
   -- Indexes already in place for machine queries
   CREATE INDEX idx_machines_tenant_farm ON machines(tenant_id, farm_id);
   CREATE INDEX idx_machines_status ON machines(tenant_id, farm_id, status);
   ```

2. **React Query Optimization**
   ```typescript
   // Prefetch related data
   const queryClient = useQueryClient();
   
   const prefetchMachines = async () => {
     await queryClient.prefetchQuery({
       queryKey: ['machines', 'list'],
       queryFn: () => trpc.machines.list.fetch(),
     });
   };
   ```

3. **Bundle Optimization**
   ```typescript
   // Lazy load admin portal (separate entry point)
   // Already implemented via separate HTML files
   
   // Future: Code splitting by route
   const PlannerPage = lazy(() => import('./planner/PlannerPage'));
   ```

## Deployment & DevOps Support

### 1. Docker Development ✅

**Agent Docker Assistance:**

```yaml
# docker/docker-compose.yml (actual file)
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: rooted
      POSTGRES_USER: rooted
      POSTGRES_PASSWORD: rooted_dev_password
    ports:
      - "5433:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

**Note**: Redis not currently used in production. May be added for caching later.

### 2. Environment Management ✅

**Agent Environment Setup:**

```bash
# Root .env
VITE_CLERK_PUBLISHABLE_KEY="pk_test_..."
VITE_API_URL="http://localhost:3001"

# apps/api/.env
DATABASE_URL="postgresql://rooted:rooted_dev_password@localhost:5433/rooted"
CLERK_SECRET_KEY="sk_test_..."
PORT="3001"
NODE_ENV="development"

# AWS IoT (for production Pi deployment)
AWS_REGION="us-east-1"
AWS_IOT_ENDPOINT="<your-iot-endpoint>.iot.us-east-1.amazonaws.com"
```

### 3. Raspberry Pi Deployment ✅

**Agent Deployment Checklist:**

```bash
# Deploy BLE service to Raspberry Pi
cd pi-src

# Option 1: Basic deployment (no AWS IoT)
./deploy-to-pi-one.sh <pi-ip-address>

# Option 2: Full deployment with AWS IoT
./deploy-to-pi-two.sh <pi-ip-address>

# Option 3: AWS IoT only
./deploy-with-iot.sh <pi-ip-address>

# Verify deployment
ssh pi@<pi-ip-address>
sudo systemctl status machine-iot
sudo journalctl -u machine-iot -f  # View logs
```

### 4. Production Web Deployment

**Agent Deployment Steps:**

```bash
# Build frontend
pnpm build  # Outputs to dist/

# Deploy to static hosting
# - Cloudflare Pages
# - Vercel
# - Netlify
# - AWS S3 + CloudFront

# Build backend
cd apps/api
pnpm build

# Deploy backend
# - AWS EC2 with Docker
# - Heroku
# - Railway
# - Fly.io

# Database
# - AWS RDS PostgreSQL
# - Supabase
# - Neon
# - Self-hosted PostgreSQL
```

## Troubleshooting Guide

### Common Issues & Solutions

1. **Web Bluetooth Not Working**
   ```bash
   # Check browser support
   - Chrome/Edge only (desktop & Android)
   - HTTPS required (or localhost)
   - User gesture required to initiate scan
   
   # Check browser console
   if (!navigator.bluetooth) {
     console.error('Web Bluetooth not supported');
   }
   
   # Common errors
   - NotFoundError: No devices found (check Pi is advertising)
   - SecurityError: Not in secure context (use HTTPS)
   - NotAllowedError: User denied permission
   ```

2. **tRPC Type Errors**
   ```bash
   # Regenerate Prisma client
   cd apps/api
   pnpm prisma generate
   
   # Restart TypeScript server in VS Code
   Cmd+Shift+P -> "TypeScript: Restart TS Server"
   
   # Clear build cache
   rm -rf dist/
   pnpm build
   ```

3. **Database Connection Issues**
   ```bash
   # Check Docker container
   docker compose -f docker/docker-compose.yml ps
   docker compose -f docker/docker-compose.yml logs postgres
   
   # Verify connection string
   # apps/api/.env
   DATABASE_URL="postgresql://rooted:rooted_dev_password@localhost:5433/rooted"
   
   # Test connection
   cd apps/api
   pnpm prisma db pull
   ```

4. **Clerk Authentication Issues**
   ```typescript
   // Check JWT in middleware
   // apps/api/src/lib/auth/middleware.ts
   
   // Verify Clerk keys
   console.log('CLERK_SECRET_KEY:', process.env.CLERK_SECRET_KEY?.slice(0, 10));
   
   // Check user metadata
   const { tenantId, farmId } = auth.sessionClaims?.metadata || {};
   if (!tenantId || !farmId) {
     throw new Error('Missing tenant/farm in JWT');
   }
   ```

5. **Raspberry Pi BLE Service Issues**
   ```bash
   # SSH into Pi
   ssh pi@<pi-ip>
   
   # Check service status
   sudo systemctl status machine-iot
   
   # View logs
   sudo journalctl -u machine-iot -f
   
   # Restart service
   sudo systemctl restart machine-iot
   
   # Check Bluetooth
   sudo systemctl status bluetooth
   hciconfig  # Should show hci0 UP RUNNING
   ```

6. **AWS IoT Connectivity**
   ```bash
   # Check thing registration
   aws iot describe-thing --thing-name <machine-name>
   
   # Check connectivity status
   aws iot describe-thing-connectivity --thing-name <machine-name>
   
   # View Lambda logs
   aws logs tail /aws/lambda/machine-lifecycle --follow
   ```

## Agent Best Practices

### 1. Session Documentation ✅ **CRITICAL**
- **Document all work**: Create session logs in `docs/agentic-sessions/`
- **Research Best Practice**: When starting a new session, search the internet for best practices related to the task at hand
- **Session format**: `YYYY-MM-DD-session-name.md` (e.g., `2026-01-26-documentation-update.md`)
- **Include user name**: Document which user/developer the agent was assisting
- **Include**: All prompts, responses, code changes, and decisions made during the session
- **Track reasoning**: Document why specific approaches were chosen
- **Link related files**: Reference all files created, modified, or reviewed

### 2. Context Awareness
- **Multi-tenancy**: Always consider tenant_id and farm_id in database queries
- **Platform Status**: Machine IoT is implemented, Rooted Planner is not
- **BLE Limitations**: Web Bluetooth only works on Chrome/Edge with HTTPS
- **AWS Integration**: Machines can be monitored via AWS IoT Core

### 3. Code Consistency
- Follow patterns established in STYLE.md
- Use existing components from shared/ui/components/
- Maintain type safety throughout the stack
- Keep tRPC procedures thin (extract logic to commands/queries)

### 4. Testing Mindset
- Write tests for new backend commands and queries
- Test tRPC procedures with proper mocking (see existing __tests__/)
- Consider edge cases in BLE operations (connection failures, timeouts)
- Manual testing required for actual BLE functionality

### 5. Performance Considerations
- Database queries already optimized with proper indexing
- Use React Query for efficient data fetching (automatic via tRPC)
- Consider lazy loading for future heavy components
- BLE operations are inherently slow (user expectations)

### 6. Security Awareness
- Always validate inputs (Zod schemas where appropriate)
- Ensure tenant/farm isolation in all database queries
- Never expose sensitive data to the client
- HTTPS required for Web Bluetooth API
- Clerk handles authentication - trust the JWT

### 7. Documentation Updates
- Update docs/ when making architectural changes
- Keep PROJECT_STRUCTURE.md in sync with actual structure
- Document new tRPC procedures in code comments
- Update DATABASE_SCHEMA.md if schema changes

### 8. Deployment Awareness
- Frontend and backend deploy separately
- Pi deployment is independent (use deployment scripts)
- AWS IoT Core requires proper IAM configuration
- Environment variables differ between dev and production

## Current Project State & Next Steps

### What's Working ✅
1. **Machine IoT Platform** - Fully functional
   - BLE device discovery and onboarding
   - WiFi provisioning via Web Bluetooth
   - Machine dashboard with real-time status
   - AWS IoT Core connectivity monitoring
   - Multi-tenant machine management
   - Admin portal for cross-tenant viewing

2. **Infrastructure** - Production ready
   - Fastify + tRPC backend
   - PostgreSQL with multi-tenant schema
   - Clerk authentication
   - Docker development environment
   - Raspberry Pi deployment scripts
   - AWS IoT Core integration

3. **Development Tools** - Operational
   - TypeScript throughout
   - Vitest for testing
   - Prisma for database management
   - ESLint + Prettier for code quality

### What's Not Implemented 🚧
1. **Rooted Planner Platform** - Not started
   - No frontend features (only placeholder)
   - No backend domain (`planner-domain/` doesn't exist)
   - Database schema defined but not used
   - Full implementation required

2. **Redis Caching** - Not integrated
   - Infrastructure ready but not used
   - Can be added for performance optimization

3. **E2E Testing** - Not implemented
   - Manual testing only
   - Playwright or Cypress could be added

### Next Major Milestones

**Milestone 1: Rooted Planner Foundation**
1. Create `apps/api/src/domains/planner-domain/` structure
2. Implement product management (CRUD operations)
3. Build frontend product catalog
4. Test end-to-end product workflow

**Milestone 2: Order Management**
1. Implement order creation and management
2. Build customer management features
3. Create order dashboard
4. Test order workflow

**Milestone 3: Production Workflow**
1. Implement task generation from orders
2. Build task management interface
3. Create calendar and specialized views
4. Test complete production cycle

**Milestone 4: Advanced Features**
1. Farm layout editor
2. Recurring orders
3. Inventory management
4. Reporting and analytics

### Agent Guidance for New Features

**When adding Machine IoT features:**
- Reference existing patterns in `machine-domain/`
- Test with actual Raspberry Pi devices
- Consider BLE connection limitations
- Update documentation

**When starting Rooted Planner:**
- Study DATABASE_SCHEMA.md for data model
- Reference REQUIREMENTS.md and ARCH.md in `docs/rooted-planner/`
- Follow domain-driven design patterns from `machine-domain/`
- Start with simplest feature (products) and build up
- Create comprehensive tests from the beginning

This guide enables AI agents to effectively support developers by understanding the actual project state, implemented features, and realistic next steps for the Rooted Web App codebase.
