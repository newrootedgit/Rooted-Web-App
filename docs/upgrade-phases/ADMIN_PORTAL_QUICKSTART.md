# Admin Portal - Quick Start Guide

## Overview

This is a condensed implementation guide for the admin portal. For full details, see [ADMIN_PORTAL.md](./ADMIN_PORTAL.md).

---

## Prerequisites

- [ ] Clerk account with application set up
- [ ] Admin user email: `support@rootedrobotics.com`
- [ ] Database with tenants, farms, and machines tables
- [ ] Existing API running on port 3001

---

## Step 1: Clerk Setup (5 minutes)

1. Go to [Clerk Dashboard](https://dashboard.clerk.com)
2. Navigate to **Users**
3. Find/create user: `support@rootedrobotics.com`
4. Click user → **Metadata** tab → **Public metadata**
5. Add:
   ```json
   {
     "isAdmin": true
   }
   ```
6. Save

---

## Step 2: Backend Implementation (30 minutes)

### 2.1 Create Admin Auth Helper

```bash
touch apps/api/src/lib/auth/admin.ts
```

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

### 2.2 Add Admin Procedure

Edit `apps/api/src/lib/trpc/trpc.ts`:

```typescript
import { requireAdmin } from '../auth/admin.js';

// Add after existing procedures
export const adminProcedure = authedProcedure.use(async ({ ctx, next }) => {
  await requireAdmin(ctx.auth.userId);
  return next({ ctx });
});
```

### 2.3 Create Admin Domain

```bash
mkdir -p apps/api/src/domains/admin-domain/service
touch apps/api/src/domains/admin-domain/router.ts
touch apps/api/src/domains/admin-domain/types.ts
touch apps/api/src/domains/admin-domain/service/getAllTenants.ts
touch apps/api/src/domains/admin-domain/service/getTenantMachines.ts
```

**`service/getAllTenants.ts`:**
```typescript
import { prisma } from '../../../lib/db/index.js';

export async function getAllTenants() {
  return prisma.tenants.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
      _count: { select: { farms: true, machines: true } },
    },
    orderBy: { name: 'asc' },
  });
}
```

**`service/getTenantMachines.ts`:**
```typescript
import { prisma } from '../../../lib/db/index.js';

export async function getTenantMachines(tenantId: string) {
  return prisma.machines.findMany({
    where: { tenant_id: tenantId },
    include: { farms: { select: { id: true, name: true } } },
    orderBy: { name: 'asc' },
  });
}
```

**`types.ts`:**
```typescript
import { z } from 'zod';

export const getTenantMachinesSchema = z.object({
  tenantId: z.string().uuid(),
});
```

**`router.ts`:**
```typescript
import { router, adminProcedure } from '../../lib/trpc/trpc.js';
import { getAllTenants } from './service/getAllTenants.js';
import { getTenantMachines } from './service/getTenantMachines.js';
import { getTenantMachinesSchema } from './types.js';

export const adminRouter = router({
  getAllTenants: adminProcedure.query(() => getAllTenants()),
  getTenantMachines: adminProcedure
    .input(getTenantMachinesSchema)
    .query(({ input }) => getTenantMachines(input.tenantId)),
});
```

### 2.4 Register Router

Edit `apps/api/src/router/index.ts`:

```typescript
import { adminRouter } from '../domains/admin-domain/router.js';

export const appRouter = router({
  // ... existing routers
  admin: adminRouter,
});
```

---

## Step 3: Frontend Implementation (45 minutes)

### 3.1 Create Admin HTML

```bash
touch admin.html
```

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

### 3.2 Create Admin App Structure

```bash
mkdir -p src/admin/{pages,components,lib}
touch src/admin/main.tsx
touch src/admin/App.tsx
touch src/admin/lib/api-client.ts
touch src/admin/pages/Dashboard.tsx
touch src/admin/components/TenantList.tsx
```

**`src/admin/main.tsx`:**
```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import '../index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <App />
    </ClerkProvider>
  </React.StrictMode>
);
```

**`src/admin/App.tsx`:**
```typescript
import { SignedIn, SignedOut, RedirectToSignIn, useUser } from '@clerk/clerk-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { trpc, trpcClient, queryClient } from './lib/api-client';
import { Dashboard } from './pages/Dashboard';

export default function App() {
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.isAdmin;

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
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
                <p className="mt-2 text-gray-600">Admin privileges required</p>
              </div>
            </div>
          )}
        </SignedIn>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

**`src/admin/lib/api-client.ts`:**
```typescript
import { createTRPCReact } from '@trpc/react-query';
import { httpBatchLink } from '@trpc/client';
import { QueryClient } from '@tanstack/react-query';
import type { AppRouter } from '../../../apps/api/src/router/index';

export const trpc = createTRPCReact<AppRouter>();

export const queryClient = new QueryClient();

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: `${import.meta.env.VITE_API_URL}/trpc`,
    }),
  ],
});
```

**`src/admin/pages/Dashboard.tsx`:**
```typescript
import { trpc } from '../lib/api-client';
import { TenantList } from '../components/TenantList';

export function Dashboard() {
  const { data: tenants, isLoading } = trpc.admin.getAllTenants.useQuery();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">Admin Portal</h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8">
        {isLoading ? <p>Loading...</p> : <TenantList tenants={tenants || []} />}
      </main>
    </div>
  );
}
```

**`src/admin/components/TenantList.tsx`:**
```typescript
import { useState } from 'react';
import { trpc } from '../lib/api-client';

export function TenantList({ tenants }: { tenants: any[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const { data: machines } = trpc.admin.getTenantMachines.useQuery(
    { tenantId: selected! },
    { enabled: !!selected }
  );

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {tenants.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className="p-6 bg-white rounded-lg shadow hover:shadow-md"
          >
            <h3 className="font-semibold">{t.name}</h3>
            <p className="text-sm text-gray-600">{t._count.machines} machines</p>
          </button>
        ))}
      </div>

      {machines && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Machines</h2>
          {machines.map((m: any) => (
            <div key={m.id} className="flex justify-between p-3 border rounded mb-2">
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-sm text-gray-600">{m.farms?.name}</p>
              </div>
              <span className={`px-2 py-1 rounded text-sm ${
                m.status === 'online' ? 'bg-green-100' : 'bg-gray-100'
              }`}>
                {m.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

### 3.3 Update Vite Config

Edit `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
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

## Step 4: Test Locally (10 minutes)

```bash
# Start API
cd apps/api && pnpm dev

# Start frontend (in another terminal)
pnpm dev

# Navigate to admin portal
open http://localhost:5173/admin.html
```

**Test:**
1. Sign in with `support@rootedrobotics.com`
2. Verify dashboard loads
3. Click tenant → verify machines display
4. Sign out, sign in as regular user → verify "Access Denied"

---

## Step 5: Deploy (varies by platform)

### Local/VM Deployment

```bash
# Build
pnpm build

# Files will be in dist/
# - dist/index.html (user app)
# - dist/admin.html (admin app)
# - dist/assets/* (shared assets)

# Deploy both to server
scp -r dist/* user@server:/var/www/app/
```

### AWS S3 + CloudFront

```bash
# Build
pnpm build

# Deploy
aws s3 sync dist/ s3://yourdomain.com --delete
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

---

## Verification Checklist

- [ ] Admin user has `isAdmin: true` in Clerk
- [ ] Backend admin routes return data for admin user
- [ ] Backend admin routes return 403 for non-admin
- [ ] Admin UI loads at `/admin.html`
- [ ] Admin UI shows tenant list
- [ ] Clicking tenant shows machines
- [ ] Non-admin sees "Access Denied"
- [ ] Production deployment works

---

## Troubleshooting

**"Access Denied" for admin user:**
- Check Clerk metadata is saved
- Sign out and back in
- Clear browser cache

**403 on API calls:**
- Check `CLERK_SECRET_KEY` in `.env`
- Verify admin middleware is registered
- Check backend logs

**Admin page not loading:**
- Verify `admin.html` exists
- Check Vite config has multi-page setup
- Check build output includes admin files

---

## Next Steps

See [ADMIN_PORTAL.md](./ADMIN_PORTAL.md) for:
- Advanced features (real-time updates, filtering)
- Security hardening (IP whitelist, WAF)
- Monitoring and logging
- Multi-admin support
