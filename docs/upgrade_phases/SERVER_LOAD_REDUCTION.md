# Server & Database Load Reduction

## Overview

This document outlines the strategy for reducing unnecessary load on the API server and PostgreSQL database. The codebase currently has no server-side caching despite Redis being installed, and client-side caching is misconfigured (0ms stale time). These are quick wins with high impact.

---

## Current State

| Aspect | Current State | Problem |
|--------|--------------|---------|
| Redis | Installed (`ioredis`), not initialized | Entire caching layer unused |
| Auth middleware | 1-2 DB queries per request | Most frequent hot path hits DB every time |
| React Query stale time | 0ms (default) | Data refetched on every component mount/focus |
| Prisma field selection | Full row fetches | Over-fetching columns not used by frontend |
| Connection pooling | Not configured | Risk of connection exhaustion under load |

---

## Phase 1 — Quick Wins (Low Effort, High Impact)

### 1A. Increase React Query Stale Times

**File:** `src/lib/trpc/TRPCProvider.tsx`

Currently a bare `new QueryClient()` is used with no configuration, giving every query a 0ms stale time. This means data is considered stale immediately and refetched on every component mount, window focus, and navigation.

**Fix:** Set global defaults and per-query overrides for slow-changing data.

```typescript
// TRPCProvider.tsx
const [queryClient] = useState(() => new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,       // 1 minute default
      gcTime: 5 * 60 * 1000,      // 5 minute garbage collection
      refetchOnWindowFocus: false, // avoid refetch on tab switch
    },
  },
}));
```

For slow-changing data (products, categories, customers), override at the call site:

```typescript
// Long stale time for reference data that rarely changes
trpc.products.list.useQuery({ search, isActive }, { staleTime: 5 * 60 * 1000 });
trpc.products.listCategories.useQuery(undefined, { staleTime: 10 * 60 * 1000 });
```

**Impact:** Eliminates a large fraction of redundant API calls from normal navigation patterns.

---

### 1B. Configure Prisma Connection Pooling

**File:** `apps/api/.env` / database URL

Under concurrent load, Prisma can exhaust the PostgreSQL connection limit. Add `connection_limit` and `pool_timeout` to the database URL:

```
DATABASE_URL="postgresql://user:pass@host:5432/db?connection_limit=10&pool_timeout=20"
```

For production, consider [Prisma Accelerate](https://www.prisma.io/data-platform/accelerate) or [PgBouncer](https://www.pgbouncer.org/) as a connection pooler sitting in front of PostgreSQL.

**Impact:** Prevents connection exhaustion errors; reduces connection overhead per request.

---

## Phase 2 — Redis Caching (Medium Effort, High Impact)

Redis (`ioredis`) is already a dependency and is defined in `docker/docker-compose.yml` but is never initialized or used anywhere in the codebase.

### 2A. Initialize Redis Client

**New file:** `apps/api/src/lib/cache/redis.ts`

```typescript
import Redis from 'ioredis';

export const redis = new Redis({
  host: process.env.REDIS_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PORT ?? 6379),
  lazyConnect: true,
});

redis.on('error', (err) => {
  // Log but don't crash — degrade gracefully without cache
  console.error('Redis error', err);
});
```

**New file:** `apps/api/src/lib/cache/withCache.ts`

Generic helper to wrap any async function with Redis caching:

```typescript
import { redis } from './redis';

export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fn: () => Promise<T>,
): Promise<T> {
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached) as T;

  const result = await fn();
  await redis.setex(key, ttlSeconds, JSON.stringify(result));
  return result;
}

export function invalidateCache(key: string) {
  return redis.del(key);
}

export function invalidateCachePattern(pattern: string) {
  return redis.keys(pattern).then((keys) =>
    keys.length ? redis.del(...keys) : 0,
  );
}
```

---

### 2B. Cache Auth Middleware Farm Lookups

**File:** `apps/api/src/lib/auth/middleware.ts`

The `farmProcedure` middleware currently runs 1-2 DB queries on every single request to resolve `farm_users` → `tenantId + farmId + role`. This is the hottest code path in the entire API.

**Cache key pattern:** `auth:user:{userId}:farm:{farmId}`
**TTL:** 5 minutes (short enough to reflect role changes quickly)

```typescript
import { withCache } from '../cache/withCache';

// Inside middleware, replace the prisma.farm_users.findFirst(...) call with:
const farmUser = await withCache(
  `auth:user:${userId}:farm:${farmId}`,
  300, // 5 minutes
  () => prisma.farm_users.findFirst({
    where: { user_id: userId, farm_id: farmId },
    include: { farms: { select: { tenant_id: true } } },
  }),
);
```

When a user's role changes, invalidate their cache key explicitly in the update command.

**Impact:** Eliminates the most frequent DB hit in the entire application.

---

### 2C. Cache Slow-Changing Reference Data

Product categories and blends rarely change. Cache them at the query level:

**File:** `apps/api/src/domains/planner-domain/products/queries/listCategories.ts`

```typescript
import { withCache } from '../../../../lib/cache/withCache';

export async function listCategories(prisma, farmId: string) {
  return withCache(
    `farm:${farmId}:categories`,
    600, // 10 minutes
    () => prisma.product_categories.findMany({ where: { farm_id: farmId } }),
  );
}
```

Invalidate on create/update/delete commands:

```typescript
import { invalidateCache } from '../../../../lib/cache/withCache';

// In createCategory command after prisma mutation:
await invalidateCache(`farm:${farmId}:categories`);
```

**Candidates for caching:**
| Data | Cache Key Pattern | TTL |
|------|------------------|-----|
| Auth / farm user role | `auth:user:{userId}:farm:{farmId}` | 5 min |
| Product categories | `farm:{farmId}:categories` | 10 min |
| Blends list | `farm:{farmId}:blends` | 10 min |
| Active products list (no search) | `farm:{farmId}:products:active` | 5 min |

---

## Phase 3 — Query Optimization (Medium Effort, Medium Impact)

### 3A. Add Prisma `select` to Large List Queries

Prisma fetches all columns by default. List endpoints only need a subset of fields for rendering table rows. Full objects should only be loaded on detail views.

**Example — listProducts:**

```typescript
// Before: fetches all columns including large text fields
prisma.products.findMany({ where: { farm_id: farmId } })

// After: select only what the list UI actually renders
prisma.products.findMany({
  where: { farm_id: farmId },
  select: {
    id: true,
    name: true,
    sku: true,
    unit: true,
    price_per_unit: true,
    is_active: true,
    created_at: true,
    product_categories: { select: { id: true, name: true } },
  },
})
```

**Priority targets** (largest tables / most frequent queries):
- `listProducts` — `apps/api/src/domains/planner-domain/products/queries/listProducts.ts`
- `listOrders` — `apps/api/src/domains/planner-domain/orders/queries/listOrders.ts`
- `listTasks` — `apps/api/src/domains/planner-domain/tasks/queries/listTasks.ts`
- `listCustomers` — `apps/api/src/domains/planner-domain/customers/queries/listCustomers.ts`

### 3B. Prefetch on Navigation Intent

For predictable navigation (e.g., sidebar click), prefetch data before the user lands:

```typescript
// On sidebar link hover/focus
const utils = trpc.useUtils();
<SidebarLink
  onMouseEnter={() => utils.orders.list.prefetch(defaultOrdersInput)}
  to="/orders"
>
  Orders
</SidebarLink>
```

---

## Implementation Order

| Step | Change | File(s) | Effort | Impact |
|------|--------|---------|--------|--------|
| 1 | React Query stale time config | `TRPCProvider.tsx` | 30 min | High |
| 2 | Prisma connection pooling | `.env` / DB URL | 15 min | Medium |
| 3 | Redis client + `withCache` helper | `lib/cache/` (new) | 1 hr | Enables Phase 2 |
| 4 | Cache auth middleware lookups | `lib/auth/middleware.ts` | 1 hr | High |
| 5 | Cache categories + blends | `queries/listCategories.ts`, `listBlends.ts` | 1 hr | Medium |
| 6 | Add `select` to list queries | All `list*.ts` query files | 2 hr | Medium |
| 7 | Prefetch on nav intent | Sidebar component | 1 hr | Low-Medium |

---

## Acceptance Criteria

- [ ] Redis client initializes on server start; failure logs a warning but does not crash the server
- [ ] Auth middleware cache hit rate > 80% under normal usage (verify via Redis `INFO stats`)
- [ ] React Query default stale time set to ≥ 60 seconds globally
- [ ] No `findMany` on large tables without a `select` or pagination
- [ ] Cache invalidation called in all relevant mutation commands
- [ ] Existing test suite (72 tests) continues to pass after changes
