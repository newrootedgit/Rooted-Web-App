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

---

## Deployment Guide

### Local Development

#### 1. Setup Clerk Admin User

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to your application
3. Go to **Users** section
4. Find or create user with email: `support@rootedrobotics.com`
5. Click on the user → **Metadata** tab
6. Under **Public metadata**, add:
   ```json
   {
     "isAdmin": true
   }
   ```
7. Save changes

#### 2. Start Development Servers

```bash
# Terminal 1: Start backend API
cd apps/api
pnpm dev

# Terminal 2: Start user frontend
pnpm dev

# Terminal 3: Start admin frontend (optional - same dev server serves both)
# Access at http://localhost:5173/admin.html
```

#### 3. Access Admin Portal

- Navigate to: `http://localhost:5173/admin.html`
- Sign in with: `support@rootedrobotics.com`
- You should see the admin dashboard

---

### Production Deployment

#### Option A: Same Server, Different Paths

Deploy both apps to same server with nginx routing:

**Nginx Configuration:**

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # User app
    location / {
        root /var/www/user-app;
        try_files $uri $uri/ /index.html;
    }

    # Admin app
    location /admin {
        alias /var/www/admin-app;
        try_files $uri $uri/ /admin.html;
    }

    # API
    location /trpc {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Build & Deploy:**

```bash
# Build both apps
pnpm build

# Deploy files
scp -r dist/* user@server:/var/www/user-app/
scp -r dist/admin.html dist/assets/* user@server:/var/www/admin-app/
```

---

#### Option B: Separate Subdomains (Recommended)

Deploy admin to separate subdomain with additional security.

**DNS Configuration:**

```
A    yourdomain.com        → Server IP
A    admin.yourdomain.com  → Server IP (or different server)
```

**Nginx Configuration:**

```nginx
# User app
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        root /var/www/user-app;
        try_files $uri $uri/ /index.html;
    }

    location /trpc {
        proxy_pass http://localhost:3001;
    }
}

# Admin app
server {
    listen 80;
    server_name admin.yourdomain.com;

    # Optional: IP whitelist
    allow 1.2.3.4;  # Your office IP
    deny all;

    location / {
        root /var/www/admin-app;
        try_files $uri $uri/ /index.html;
    }

    location /trpc {
        proxy_pass http://localhost:3001;
    }
}
```

**Build & Deploy:**

```bash
# Build user app
pnpm build

# Build admin app separately
pnpm build:admin

# Deploy to separate locations
scp -r dist/* user@server:/var/www/user-app/
scp -r dist-admin/* user@server:/var/www/admin-app/
```

---

#### Option C: AWS S3 + CloudFront

Deploy static files to S3 with CloudFront distribution.

**S3 Buckets:**
- `yourdomain.com` - User app
- `admin.yourdomain.com` - Admin app

**CloudFront Distributions:**

1. **User Distribution:**
   - Origin: `yourdomain.com.s3.amazonaws.com`
   - Alternate domain: `yourdomain.com`
   - SSL Certificate: ACM certificate

2. **Admin Distribution:**
   - Origin: `admin.yourdomain.com.s3.amazonaws.com`
   - Alternate domain: `admin.yourdomain.com`
   - SSL Certificate: ACM certificate
   - **Security:** Add WAF with IP whitelist rule

**Deploy Script:**

```bash
#!/bin/bash

# Build apps
pnpm build
pnpm build:admin

# Deploy user app
aws s3 sync dist/ s3://yourdomain.com --delete
aws cloudfront create-invalidation --distribution-id E1234567890ABC --paths "/*"

# Deploy admin app
aws s3 sync dist-admin/ s3://admin.yourdomain.com --delete
aws cloudfront create-invalidation --distribution-id E0987654321XYZ --paths "/*"
```

---

## Security Considerations

### 1. Authentication Layers

**Layer 1: Clerk Authentication**
- User must be signed in with valid Clerk session
- Session token validated on every API request

**Layer 2: Admin Metadata Check**
- Backend validates `publicMetadata.isAdmin === true`
- Enforced on all `/admin/*` routes via `adminProcedure`

**Layer 3 (Optional): Infrastructure**
- IP whitelist at nginx/CloudFront level
- Restrict admin subdomain to known IPs
- Add WAF rules for additional protection

### 2. API Route Protection

All admin routes use `adminProcedure` which:
1. Requires valid authentication (`authedProcedure`)
2. Validates admin status via Clerk API
3. Throws `ForbiddenError` if not admin

### 3. Frontend Protection

Admin frontend checks `user.publicMetadata.isAdmin`:
- Shows "Access Denied" if not admin
- Prevents UI rendering for non-admins
- Note: This is UX only, real security is backend

### 4. Audit Trail

Clerk provides audit logs for:
- User sign-ins
- Metadata changes
- API token usage

Access via Clerk Dashboard → Logs

---

## Testing

### 1. Test Admin Authentication

```bash
# Get auth token from Clerk
TOKEN="your_clerk_session_token"

# Test admin endpoint
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:3001/trpc/admin.getAllTenants
```

**Expected:**
- Admin user: Returns tenant list
- Non-admin user: Returns 403 Forbidden

### 2. Test Admin UI

1. Sign in as admin user
2. Verify dashboard loads
3. Click on tenant → verify machines load
4. Check machine status display

### 3. Test Non-Admin Access

1. Sign in as regular user
2. Navigate to admin portal
3. Verify "Access Denied" message
4. Attempt API call → verify 403 error

---

## Monitoring & Maintenance

### 1. Admin User Management

**Add new admin:**
1. Go to Clerk Dashboard → Users
2. Find user
3. Add `"isAdmin": true` to public metadata

**Remove admin:**
1. Go to Clerk Dashboard → Users
2. Find user
3. Remove or set `"isAdmin": false` in public metadata

### 2. Logging

Add logging to admin routes:

```typescript
export const adminRouter = router({
  getAllTenants: adminProcedure.query(async ({ ctx }) => {
    ctx.logger.info('Admin accessed tenant list', { 
      userId: ctx.auth.userId 
    });
    return getAllTenants();
  }),
});
```

### 3. Metrics

Track admin portal usage:
- Number of admin logins
- API calls to admin endpoints
- Response times
- Error rates

---

## Troubleshooting

### Issue: "Access Denied" for admin user

**Check:**
1. User has `isAdmin: true` in Clerk public metadata
2. Metadata is saved (refresh Clerk dashboard)
3. User signed out and back in (to refresh token)
4. Browser cache cleared

### Issue: Admin routes return 403

**Check:**
1. `requireAdmin()` function is working
2. Clerk API key is correct in `.env`
3. User token is being sent in request headers
4. Backend logs for specific error

### Issue: Admin app not loading

**Check:**
1. `admin.html` exists in project root
2. Vite config has multi-page setup
3. Build output includes admin files
4. Nginx/server routing is correct

---

## Future Enhancements

### Phase 4: Advanced Features

1. **Real-time Updates**
   - WebSocket connection for live machine status
   - Push notifications for offline machines

2. **Advanced Filtering**
   - Search machines by name/ID
   - Filter by status (online/offline)
   - Sort by last seen date

3. **Machine Actions**
   - Trigger machine restart
   - Update machine configuration
   - View machine logs

4. **Analytics Dashboard**
   - Machine uptime statistics
   - Tenant usage metrics
   - Historical status charts

5. **Multi-Admin Support**
   - Admin roles (super admin, viewer)
   - Activity audit log
   - Admin user management UI

---

## Checklist

### Backend Implementation
- [ ] Create `apps/api/src/lib/auth/admin.ts`
- [ ] Add `adminProcedure` to `apps/api/src/lib/trpc/trpc.ts`
- [ ] Create admin service functions in `apps/api/src/domains/admin-domain/service/`
- [ ] Create `apps/api/src/domains/admin-domain/router.ts`
- [ ] Register admin router in `apps/api/src/router/index.ts`
- [ ] Test admin endpoints with Postman/curl

### Frontend Implementation
- [ ] Create `admin.html` in project root
- [ ] Create `src/admin/main.tsx`
- [ ] Create `src/admin/App.tsx`
- [ ] Create `src/admin/lib/api-client.ts`
- [ ] Create `src/admin/pages/Dashboard.tsx`
- [ ] Create `src/admin/components/TenantList.tsx`
- [ ] Update `vite.config.ts` for multi-page build
- [ ] Test admin UI locally

### Clerk Setup
- [ ] Create/locate admin user in Clerk Dashboard
- [ ] Add `isAdmin: true` to user's public metadata
- [ ] Test authentication with admin user
- [ ] Test access denial with non-admin user

### Deployment
- [ ] Build both user and admin apps
- [ ] Deploy to server/S3
- [ ] Configure nginx/CloudFront routing
- [ ] Set up SSL certificates
- [ ] (Optional) Configure IP whitelist
- [ ] Test production deployment
- [ ] Verify admin access in production

### Documentation
- [ ] Document admin user credentials (secure location)
- [ ] Create runbook for adding new admins
- [ ] Document deployment process
- [ ] Set up monitoring/alerts

---

## Support

For issues or questions:
- Check troubleshooting section above
- Review Clerk documentation: https://clerk.com/docs
- Check application logs in `apps/api/logs/`
- Contact: support@rootedrobotics.com
