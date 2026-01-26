# Admin Portal Setup Guide

## Overview

This document outlines the implementation of a separate admin portal for monitoring machines across all tenants and farms. The admin portal is completely isolated from the user-facing application with its own deployment, authentication, and routing.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Domain                             │
│                  yourdomain.com                             │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  User Frontend (Vite)                                │  │
│  │  - Machine IoT (BLE provisioning)                    │  │
│  │  - Rooted Planner (Farm management)                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ API Calls
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                   Backend API (Fastify)                     │
│                                                             │
│  ┌──────────────────┐        ┌──────────────────────────┐  │
│  │  User Routes     │        │  Admin Routes            │  │
│  │  /trpc/*         │        │  /admin/*                │  │
│  │  (Farm-scoped)   │        │  (Cross-tenant access)   │  │
│  └──────────────────┘        └──────────────────────────┘  │
│           │                            │                    │
│           │                            │                    │
│           └────────────┬───────────────┘                    │
│                        ▼                                    │
│              ┌──────────────────┐                           │
│              │   PostgreSQL     │                           │
│              └──────────────────┘                           │
└─────────────────────────────────────────────────────────────┘
                            ▲
                            │ API Calls
                            │
┌─────────────────────────────────────────────────────────────┐
│                     Admin Domain                            │
│                admin.yourdomain.com                         │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Admin Frontend (Vite)                               │  │
│  │  - Tenant Overview                                   │  │
│  │  - Farm Machine Status                               │  │
│  │  - Cross-tenant Monitoring                           │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

## Authentication Strategy

### Clerk Public Metadata Approach

**Admin user identification:**
- Single admin account: `support@rootedrobotics.com`
- Admin flag stored in Clerk user's `publicMetadata`
- Same Clerk application as user portal
- Backend validates admin status on protected routes

**Setup Steps:**
1. Create/locate user in Clerk Dashboard
2. Navigate to user profile → Public Metadata
3. Add metadata:
   ```json
   {
     "isAdmin": true
   }
   ```

**Benefits:**
- No separate auth system
- Easy to extend to multiple admins
- Centralized user management
- Audit trail through Clerk

## File Structure

```
Rooted-Web-App/
├── src/
│   ├── admin/                         # NEW: Admin application
│   │   ├── main.tsx                   # Admin entry point
│   │   ├── App.tsx                    # Admin root component
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx          # Overview of all tenants
│   │   │   ├── TenantView.tsx         # Machines per tenant
│   │   │   └── FarmView.tsx           # Machines per farm
│   │   ├── components/
│   │   │   ├── MachineStatusCard.tsx  # Machine status display
│   │   │   ├── TenantList.tsx         # List of tenants
│   │   │   └── FarmList.tsx           # List of farms
│   │   └── lib/
│   │       ├── api-client.ts          # Admin tRPC client
│   │       └── types.ts               # Admin-specific types
│   │
│   ├── machines/                      # Existing: User Machine IoT
│   ├── planner/                       # Existing: User Planner
│   └── lib/                           # Shared utilities
│
├── apps/api/src/
│   ├── domains/
│   │   ├── admin-domain/              # NEW: Admin domain
│   │   │   ├── router.ts              # Admin tRPC routes
│   │   │   ├── service/
│   │   │   │   ├── getAllTenants.ts
│   │   │   │   ├── getTenantMachines.ts
│   │   │   │   ├── getFarmMachines.ts
│   │   │   │   └── getMachineStatus.ts
│   │   │   └── types.ts
│   │   ├── machine-domain/            # Existing
│   │   └── planner-domain/            # Existing
│   │
│   └── lib/
│       ├── auth/
│       │   ├── middleware.ts          # Existing: User auth
│       │   └── admin.ts               # NEW: Admin auth helpers
│       └── trpc/
│           └── trpc.ts                # Update: Add adminProcedure
│
├── shared/                            # Existing: Shared UI components
│
├── index.html                         # Existing: User app HTML
├── admin.html                         # NEW: Admin app HTML
├── vite.config.ts                     # UPDATE: Multi-page build
└── package.json
```

## Implementation Phases

### Phase 1: Backend - Admin Authentication & Routes

#### 1.1 Admin Authentication Helper

**File:** `apps/api/src/lib/auth/admin.ts`

```typescript
import { createClerkClient } from '@clerk/fastify';
import { ForbiddenError } from '../errors/index.js';

const clerk = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function requireAdmin(userId: string): Promise<void> {
  const user = await clerk.users.getUser(userId);
  
  if (!user.publicMetadata.isAdmin) {
    throw new ForbiddenError('Admin access required');
  }
}
```

**Purpose:** Validates that authenticated user has admin flag in Clerk metadata.

---

#### 1.2 Admin tRPC Procedure

**File:** `apps/api/src/lib/trpc/trpc.ts`

Add new procedure type:

```typescript
import { requireAdmin } from '../auth/admin.js';

// Existing procedures...
export const authedProcedure = t.procedure.use(/* ... */);
export const farmProcedure = t.procedure.use(/* ... */);

// NEW: Admin procedure
export const adminProcedure = authedProcedure.use(async ({ ctx, next }) => {
  await requireAdmin(ctx.auth.userId);
  return next({ ctx });
});
```

**Purpose:** Reusable tRPC middleware that enforces admin access on routes.

---

#### 1.3 Admin Domain Service Layer

**File:** `apps/api/src/domains/admin-domain/service/getAllTenants.ts`

```typescript
import { prisma } from '../../../lib/db/index.js';

export async function getAllTenants() {
  return prisma.tenants.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      contact_email: true,
      created_at: true,
      _count: {
        select: {
          farms: true,
          machines: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });
}
```

---

**File:** `apps/api/src/domains/admin-domain/service/getTenantMachines.ts`

```typescript
import { prisma } from '../../../lib/db/index.js';

export async function getTenantMachines(tenantId: string) {
  return prisma.machines.findMany({
    where: { tenant_id: tenantId },
    include: {
      farms: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });
}
```

---

**File:** `apps/api/src/domains/admin-domain/service/getFarmMachines.ts`

```typescript
import { prisma } from '../../../lib/db/index.js';

export async function getFarmMachines(farmId: string) {
  return prisma.machines.findMany({
    where: { farm_id: farmId },
    orderBy: { name: 'asc' },
  });
}
```

---

#### 1.4 Admin Domain Types

**File:** `apps/api/src/domains/admin-domain/types.ts`

```typescript
import { z } from 'zod';

export const getTenantMachinesSchema = z.object({
  tenantId: z.string().uuid(),
});

export const getFarmMachinesSchema = z.object({
  farmId: z.string().uuid(),
});
```

---

#### 1.5 Admin Router

**File:** `apps/api/src/domains/admin-domain/router.ts`

```typescript
import { router, adminProcedure } from '../../lib/trpc/trpc.js';
import { getAllTenants } from './service/getAllTenants.js';
import { getTenantMachines } from './service/getTenantMachines.js';
import { getFarmMachines } from './service/getFarmMachines.js';
import { getTenantMachinesSchema, getFarmMachinesSchema } from './types.js';

export const adminRouter = router({
  // Get all tenants with machine counts
  getAllTenants: adminProcedure.query(() => getAllTenants()),

  // Get all machines for a specific tenant
  getTenantMachines: adminProcedure
    .input(getTenantMachinesSchema)
    .query(({ input }) => getTenantMachines(input.tenantId)),

  // Get all machines for a specific farm
  getFarmMachines: adminProcedure
    .input(getFarmMachinesSchema)
    .query(({ input }) => getFarmMachines(input.farmId)),
});
```

---

#### 1.6 Register Admin Router

**File:** `apps/api/src/router/index.ts`

```typescript
import { adminRouter } from '../domains/admin-domain/router.js';

export const appRouter = router({
  // Existing routers...
  machine: machineRouter,
  planner: plannerRouter,
  
  // NEW: Admin router
  admin: adminRouter,
});
```

---

### Phase 2: Frontend - Admin Application

#### 2.1 Admin HTML Entry Point

**File:** `admin.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Rooted Admin Portal</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/admin/main.tsx"></script>
  </body>
</html>
```

---

#### 2.2 Admin Entry Point

**File:** `src/admin/main.tsx`

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import '../index.css';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPubKey}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
```

---

#### 2.3 Admin Root Component

**File:** `src/admin/App.tsx`

```typescript
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.isAdmin;

  return (
    <>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
      <SignedIn>
        {isAdmin ? (
          <Dashboard />
        ) : (
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
              <p className="mt-2 text-gray-600">
                You do not have admin privileges.
              </p>
            </div>
          </div>
        )}
      </SignedIn>
    </>
  );
}
```

---

#### 2.4 Admin API Client

**File:** `src/admin/lib/api-client.ts`

```typescript
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { QueryClient } from '@tanstack/react-query';
import type { AppRouter } from '../../../apps/api/src/router/index';

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_API_URL}/trpc`,
      headers: async () => {
        // Clerk automatically includes auth token
        return {};
      },
    }),
  ],
});
```

---

#### 2.5 Admin Dashboard Page

**File:** `src/admin/pages/Dashboard.tsx`

```typescript
import { trpc } from '../lib/api-client';
import { TenantList } from '../components/TenantList';

export function Dashboard() {
  const { data: tenants, isLoading } = trpc.admin.getAllTenants.useQuery();

  if (isLoading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Portal - Machine Monitoring
          </h1>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto px-4 py-8">
        <TenantList tenants={tenants || []} />
      </main>
    </div>
  );
}
```

---

#### 2.6 Tenant List Component

**File:** `src/admin/components/TenantList.tsx`

```typescript
import { useState } from 'react';
import { trpc } from '../lib/api-client';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  _count: {
    farms: number;
    machines: number;
  };
}

export function TenantList({ tenants }: { tenants: Tenant[] }) {
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null);
  
  const { data: machines } = trpc.admin.getTenantMachines.useQuery(
    { tenantId: selectedTenant! },
    { enabled: !!selectedTenant }
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {tenants.map((tenant) => (
          <button
            key={tenant.id}
            onClick={() => setSelectedTenant(tenant.id)}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-left"
          >
            <h3 className="text-lg font-semibold">{tenant.name}</h3>
            <div className="mt-2 text-sm text-gray-600">
              <p>{tenant._count.farms} farms</p>
              <p>{tenant._count.machines} machines</p>
            </div>
          </button>
        ))}
      </div>

      {selectedTenant && machines && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Machines</h2>
          <div className="space-y-2">
            {machines.map((machine) => (
              <div key={machine.id} className="flex justify-between p-3 border rounded">
                <div>
                  <p className="font-medium">{machine.name}</p>
                  <p className="text-sm text-gray-600">{machine.farms?.name}</p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 rounded text-sm ${
                    machine.status === 'online' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    {machine.status}
                  </span>
                  {machine.last_seen_at && (
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(machine.last_seen_at).toLocaleString()}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### Phase 3: Build Configuration

#### 3.1 Update Vite Config for Multi-Page Build

**File:** `vite.config.ts`

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        admin: path.resolve(__dirname, 'admin.html'),
      },
    },
  },
});
```

---

#### 3.2 Update Package.json Scripts

**File:** `package.json`

```json
{
  "scripts": {
    "dev": "vite",
    "dev:admin": "vite --mode admin",
    "build": "tsc && vite build",
    "build:admin": "tsc && vite build --mode admin",
    "preview": "vite preview",
    "preview:admin": "vite preview --mode admin"
  }
}
```
