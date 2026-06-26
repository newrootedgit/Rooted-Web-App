# Public Customer API — Implementation Spec

> **Purpose:** Engineering + hardware implementation spec for exposing a public, API-key-authenticated REST surface (`/v1`) so customers can read machine status/health and update machine presets programmatically. Covers the web-backend build *and* the device-side (firmware) contract that a customer-initiated preset write must satisfy end to end.
>
> **Status:** Proposed — not yet built. This document is the design of record.
>
> **Audience:** Backend engineers and the hardware/firmware team.
>
> **Last updated:** 2026-06-09

---

## Table of Contents

1. [Goals & Non-Goals](#1-goals--non-goals)
2. [Where the Public API Sits](#2-where-the-public-api-sits)
3. [API Key Model](#3-api-key-model)
4. [Authentication (the `/v1` preHandler)](#4-authentication-the-v1-prehandler)
5. [Endpoints (v1)](#5-endpoints-v1)
6. [Hardware Contract — Preset Writes & Telemetry](#6-hardware-contract--preset-writes--telemetry)
7. [Rate Limiting](#7-rate-limiting)
8. [Deployment & Routing](#8-deployment--routing)
9. [Security Considerations](#9-security-considerations)
10. [Phased Rollout](#10-phased-rollout)

---

## 1. Goals & Non-Goals

**Goals**

- Let a customer authenticate with their own API key (no Clerk login) and:
  - List the machines on their farm.
  - Read a machine's status/health (online/offline, last seen, uptime, fault counts, motor uptimes).
  - Read and update a machine's presets (variety configs).
- Keep the public surface **small, deliberate, and versioned** (`/v1`) — decoupled from the internal tRPC API.
- Reuse existing domain functions and the existing `AuthContext` shape so downstream tenancy logic is unchanged.

**Non-Goals (for the first cut)**

- No auto-generated OpenAPI spec or SDKs. The full, formalized API contract is a **paid deliverable** built per customer — see [`CUSTOMER_API_GUIDE.md`](./CUSTOMER_API_GUIDE.md).
- No exposure of the planner domains (products, orders, tasks, etc.) — machines only.
- No customer self-serve key UI in v1 (keys are admin-issued; see §3).

---

## 2. Where the Public API Sits

Same Fastify process, same EC2/PM2 deploy. The public API is one additional plugin registered alongside the existing tRPC plugin in `apps/api/src/index.ts`.

```
nginx (/api/ → :8000, strips /api)
   │
   ▼
Fastify :8000
   ├── farmAuthMiddleware  (Clerk JWT, global preHandler — SKIPS /v1)
   ├── /v1   → publicApiPlugin   (API-key preHandler → REST routes)   ← NEW
   └── /trpc → fastifyTRPCPlugin (internal app + admin portal)
```

Integration footprint:

1. Add `/v1` to `PUBLIC_ROUTES` in `apps/api/src/lib/auth/middleware.ts` so the **Clerk** middleware skips it (it has *different* auth, not *no* auth).
2. Register `publicApiPlugin` at `prefix: '/v1'` in `apps/api/src/index.ts`.
3. Add the `api_keys` Prisma model (§3) + migration.

The plugin's routes are thin wrappers that unwrap the API key's `farmId`/`tenantId`, call **existing** domain functions (`getMachinesByTenant`, `getMachine`, `updateMachineConfig`, …), and return plain JSON.

---

## 3. API Key Model

New Prisma model (`apps/api/prisma/schema.prisma`):

```prisma
model api_keys {
  id           String    @id @default(uuid()) @db.Uuid
  tenant_id    String    @db.Uuid
  farm_id      String    @db.Uuid
  name         String                       // human label, e.g. "Acme harvest integration"
  key_prefix   String                       // "rk_live_a1b2" — safe to display, for identification
  key_hash     String    @unique            // SHA-256 of the full key; raw key shown ONCE at creation
  scopes       String[]  @default([])        // e.g. ["machines:read","machines:write"]
  last_used_at DateTime?
  expires_at   DateTime?
  revoked_at   DateTime?
  created_at   DateTime  @default(now())

  farms        farms     @relation(fields: [farm_id], references: [id], onDelete: Cascade)

  @@index([key_hash])
  @@index([farm_id])
}
```

**Key format:** `rk_live_<32+ random url-safe chars>`. The `rk_live_` / `rk_test_` prefix makes keys greppable in logs and lets us distinguish environments.

**Storage:** Only the SHA-256 hash is stored. The raw key is returned exactly once at creation and never recoverable — standard "regenerate to rotate" behavior.

**Scoping:** Every key is bound to exactly one `(tenant_id, farm_id)`. A customer key can never read or write another farm's machines — this falls out of reusing the existing tenancy filters.

**Issuance (v1):** Admin-issued from the internal admin portal. Add a small `apiKeys` admin tRPC router (`create`, `list`, `revoke`). `create` generates the key, hashes it, stores the row, and returns the raw key once. Self-serve issuance in farm settings is a later phase.

---

## 4. Authentication (the `/v1` preHandler)

The `/v1` plugin brings its own `preHandler` — the API-key analog of `farmAuthMiddleware`. It populates the **same** `AuthContext` (`apps/api/src/lib/auth/types.ts`) so route handlers and domain functions can't tell the difference between a Clerk request and a key request.

```ts
// lib/public-api/auth.ts
fastify.addHook('preHandler', async (request) => {
  const raw = request.headers.authorization?.replace(/^Bearer\s+/i, '');
  if (!raw?.startsWith('rk_')) throw new UnauthorizedError('Missing API key');

  const key = await prisma.api_keys.findFirst({
    where: { key_hash: sha256(raw), revoked_at: null },
  });
  if (!key || (key.expires_at && key.expires_at < new Date())) {
    throw new UnauthorizedError('Invalid or expired API key');
  }

  request.auth = {
    userId: `apikey:${key.id}`,      // traceable in logs/audit
    tenantId: key.tenant_id,
    farmId: key.farm_id,
    role: 'FARM_OPERATOR',
  };

  // fire-and-forget; do not block the request
  void prisma.api_keys.update({
    where: { id: key.id },
    data: { last_used_at: new Date() },
  });
});
```

Note `request.auth` uses the existing `AuthContext` interface and the `userId: 'apikey:<id>'` convention keeps key-driven actions attributable in the existing request logs.

---

## 5. Endpoints (v1)

All paths are under `/v1` (externally `https://app.rootedrobotics.com/api/v1`). All are farm-scoped to the key automatically.

| Method | Path | Backing function | Notes |
|---|---|---|---|
| `GET`  | `/v1/machines` | `getMachinesByTenant(prisma, tenantId, { farmId })` | List the farm's machines. |
| `GET`  | `/v1/machines/:id` | `getMachine(prisma, farmId, id)` | Status + health/telemetry aggregates. |
| `GET`  | `/v1/machines/:id/faults` | `listFaults(prisma, farmId, id)` | Recent faults. |
| `GET`  | `/v1/machines/:id/config` | `requestMachineConfig` + `getConfigResponse` | Current presets (async; see §6). |
| `POST` | `/v1/machines/:id/config` | `updateMachineConfig(prisma, farmId, …)` | Update presets. Returns `202` + `requestId`. |
| `GET`  | `/v1/machines/:id/config/requests/:requestId` | `getConfigResponse(requestId)` | Poll the device's reply. |

**Response shape:** plain JSON, `camelCase`, no tRPC envelope. A shared error shape:

```json
{ "error": { "code": "not_found", "message": "Machine not found" } }
```

Reuse the existing error classes (`UnauthorizedError`, `ForbiddenError`, `NotFoundError`) — map them to HTTP status codes in the plugin's error handler.

> The exact field set returned per endpoint is intentionally **not frozen** here. The full schema is negotiated with each paying customer and formalized as part of the paid API engagement (see customer guide). v1 returns the existing domain objects as-is.

---

## 6. Hardware Contract — Preset Writes & Telemetry

This is the section the **firmware team** owns. A customer preset write is only "done" when the device acknowledges it. The web layer is a relay; the device is the source of truth.

### 6.1 Preset write flow (API → device → API)

```
POST /v1/machines/:id/config
   │  validates values against cached variable_ranges
   ▼
updateMachineConfig() publishes MQTT:
   topic:   rooted/machines/{deviceId}/commands
   payload: { action: "update_presets", requestId, <variety>: {<var>: <value>}, variety_names? }
   │
   ▼
DEVICE applies presets, then replies:
   topic:   rooted/machines/{deviceId}/pong
   payload: { requestId, action: "presets_updated", success: true | false, error?, config? }
   │
   ▼
API caches the reply ~100s; customer polls GET .../config/requests/:requestId
```

**Firmware requirements (no change from today's internal contract — restated for completeness):**

- Subscribe to `rooted/machines/{deviceId}/commands` and handle `action`:
  - `get_presets` → respond with full current config.
  - `update_presets` → apply values, respond with `success`/`error`.
- **Echo the `requestId`** on every `pong` reply. The web layer correlates request↔response purely by `requestId`; a missing or wrong id makes the customer's call appear to time out.
- Report a structured `error` string on rejection (out-of-range value, machine not ready, etc.) so it can be surfaced to the customer verbatim.
- Honor `variable_ranges` as the authority. The API pre-validates against the **last cached** ranges, but the device must still reject anything unsafe — a customer key is an untrusted caller.

### 6.2 Status/health telemetry (device → API → customer)

The customer-readable status/health fields come straight from the existing telemetry pipeline (`rooted/machines/{deviceId}/telemetry` → TimescaleDB + RDS). No new firmware work is required for reads — the public API just exposes already-ingested fields:

- `status` (online/offline), `lastSeenAt` — from AWS IoT presence + telemetry.
- Uptime, `totalSteps`, `trayCount`, `rebootCount`.
- Per-motor uptime (`belt`/`blade`/`roller`) and fault counts.
- `lastEventCode` / `lastEventValue` / `lastEventAt`.

> **Hardware action item:** confirm which of these fields are safe/meaningful to expose externally, and whether any need relabeling for a customer audience (internal event codes vs. human-readable status). This gates the field set in §5.

---

## 7. Rate Limiting

Per-key limiting using the Redis you already run (`REDIS_URL`). A `preHandler` after auth: `INCR ratelimit:{keyId}:{minute}` with a TTL; reject with `429` over the cap. Start conservative (e.g. 60 req/min/key) and tune. Log near-limit usage for capacity planning.

---

## 8. Deployment & Routing

- **No new service.** Same `rooted-api` PM2 process, same `deploy.yml`. The new `api_keys` migration is picked up by the existing `prisma migrate deploy` step.
- **nginx:** the existing `location /api/` block already proxies (and prefix-strips) to `:8000`, so `/api/v1/...` reaches Fastify as `/v1/...` with **no config change**.
- **Optional later:** a dedicated `api.rootedrobotics.com` subdomain for a cleaner customer-facing base URL.

---

## 9. Security Considerations

- **Hashed at rest**, raw key shown once. Treat the `key_hash` column as a credential store.
- **Per-key tenancy** is enforced by reusing existing `tenant_id`/`farm_id` filters — no route may take a `farmId` from the caller; it always comes from the key.
- **Writes are device-validated** (§6.1) — never trust API-side range validation alone.
- **Revocation** is immediate (`revoked_at`) since every request looks up the key.
- **Audit:** `userId: 'apikey:<id>'` flows into existing request logs; `last_used_at` gives coarse activity.
- **Abuse:** rate limiting (§7) + the option to expire keys (`expires_at`).
- Keep `rk_test_` keys pointed at non-production data.

---

## 10. Phased Rollout

1. **Phase 1 — Foundation:** `api_keys` model + migration, admin issuance router, `/v1` plugin with auth preHandler, `GET /v1/machines` and `GET /v1/machines/:id`. Read-only.
2. **Phase 2 — Writes:** `POST /v1/machines/:id/config` + poll endpoint, rate limiting, hardware sign-off on the field set (§6.2).
3. **Phase 3 — Per-customer formalization (paid):** negotiate the exact data/format with the customer, freeze a versioned schema, optionally generate OpenAPI + a client snippet. This is the deliverable customers pay for.
4. **Phase 4 — Self-serve:** farm-settings UI for customers to create/rotate/revoke their own keys.
