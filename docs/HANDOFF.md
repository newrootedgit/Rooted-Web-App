# Rooted Web App — Technical Handoff Documentation

> **Purpose:** Complete technical handoff for the Rooted Web App. Covers architecture, local development, production deployment, EC2 access, infrastructure, and operational runbooks. Written for an engineering owner taking over the project.
>
> **Last updated:** 2026-06-05

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Repository Layout](#2-repository-layout)
3. [Tech Stack](#3-tech-stack)
4. [Local Development Setup](#4-local-development-setup)
5. [Architecture Deep Dive](#5-architecture-deep-dive)
6. [Databases](#6-databases)
7. [Authentication & Multi-Tenancy](#7-authentication--multi-tenancy)
8. [Machine Telemetry Pipeline (AWS IoT)](#8-machine-telemetry-pipeline-aws-iot)
9. [Production Infrastructure (AWS)](#9-production-infrastructure-aws)
10. [Pushing to Production](#10-pushing-to-production)
11. [Accessing the Production EC2](#11-accessing-the-production-ec2)
12. [Secrets & Environment Variables](#12-secrets--environment-variables)
13. [Testing](#13-testing)
14. [Operational Runbooks](#14-operational-runbooks)
15. [Known Gotchas & Technical Debt](#15-known-gotchas--technical-debt)
16. [Staging Environment (Planned)](#16-staging-environment-planned)

---

## 1. System Overview

Rooted Web App is the customer-facing platform for Rooted Robotics' microgreens harvesting machines. It has three major parts:

1. **Machines product** — dashboard, analytics, presets, and part-lifecycle tracking for deployed harvester machines. Machines (Raspberry Pi + ClearCore) publish telemetry over **AWS IoT MQTT**, which the API ingests into **TimescaleDB**.
2. **Planner product** — farm production planning: products/varieties, blends, SKUs, customers, orders, recurring order schedules, tasks, employees, supplies, and a canvas-based farm layout editor.
3. **Admin portal** — internal tool (separate SPA at `/admin`) for managing tenants, farms, machines, and the machine-part-type catalog.

**Production URL:** `https://app.rootedrobotics.com`
**Admin portal:** `https://app.rootedrobotics.com/admin`
**API health:** `https://app.rootedrobotics.com/health`
**GitHub:** `git@github.com:newrootedgit/Rooted-Web-App.git` (org: `newrootedgit`)

### High-level production topology

```
                         Cloudflare DNS (app.rootedrobotics.com)
                                      │
                                      ▼
┌─────────────────────────────────────────────────────────────────┐
│  EC2 t3.medium (Ubuntu 22.04, Elastic IP)                       │
│                                                                 │
│  Nginx :80/:443                                                 │
│   ├── /            → static frontend  (/var/www/rooted/dist)   │
│   ├── /admin       → admin.html SPA                            │
│   └── /api/        → proxy → Fastify API :8000 (PM2)           │
│                                                                 │
│  Docker containers (localhost only):                            │
│   ├── TimescaleDB :5434  (telemetry — NOT backed up by AWS)    │
│   └── Redis       :6379  (machine config cache)                │
└──────────┬──────────────────────────────────────────────────────┘
           │
     ┌─────┴───────────┐
     ▼                 ▼
 RDS PostgreSQL 15   AWS IoT Core (MQTT)
 db.t3.micro          │  machines publish telemetry/lifecycle
 rooted_planner       ▼
 (7-day backups)     Lambda (rooted-machine-lifecycle-prod)
                      └─ POSTs lifecycle events to API
                         (auth: LAMBDA_SECRET_TOKEN)
```

---

## 2. Repository Layout

pnpm monorepo (`pnpm-workspace.yaml`, pnpm 9.15.0).

```
Rooted-Web-App/
├── src/                    # Frontend React app (main SPA)
│   ├── App.tsx             # Routes: /auth, /onboarding, /machines, /planner
│   ├── main.tsx            # ClerkProvider + TRPCProvider root
│   ├── machines/           # Machines product (MachinesPage.tsx + components)
│   ├── planner/            # Planner product ({entity}/{Entity}Page.tsx + components/)
│   ├── admin/              # Admin portal (separate SPA, entry: admin.html)
│   ├── auth/ onboarding/ support/
│   └── lib/                # trpc client, bluetooth (BLE provisioning)
├── apps/api/               # Backend (@rooted/api) — Fastify + tRPC
│   ├── src/index.ts        # Entrypoint: Fastify, MQTT subscriber, recurring-order poller
│   ├── src/domains/        # Domain modules (see §5)
│   ├── src/lib/            # trpc router/procedures, auth middleware, db clients, logger
│   ├── src/test/           # mockPrisma.ts, mockTimescale.ts
│   ├── src/scripts/        # seed-machine-analytics.ts
│   └── prisma/             # schema.prisma + migrations/
├── shared/                 # Shared UI components, styles, types (frontend + admin)
├── pi-src/                 # Raspberry Pi device code (BLE provisioning, IoT,
│                           #   telemetry ingest/ship, systemd .service units)
├── docker/                 # docker-compose.yml (local dev), init.sql, init-timescale.sql
├── infra/terraform/        # All AWS infrastructure as code (see §9)
├── scripts/                # setup-ec2.sh (one-time bootstrap), deploy-scp.sh (manual deploy)
├── .github/workflows/      # ci.yml (push/PR), deploy.yml (manual prod deploy)
├── docs/                   # PROJECT_STRUCTURE.md, DATABASE_SCHEMA.md, user-guides/,
│                           #   upgrade_phases/ (incl. STAGING_ENVIRONMENT_SETUP.md)
├── index.html / admin.html # Two Vite entry points (two separate SPAs)
├── vite.config.ts          # Path aliases: @auth, @machines, @planner, @admin, @shared, @
└── package.json            # Root scripts (see §4)
```

---

## 3. Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + TypeScript 5.7, Vite 6, React Router v7, Tailwind CSS 4, Lucide icons, Recharts, dnd-kit, Zustand (minimal — most state is React Query) |
| API client | tRPC v11 (`@trpc/react-query` + TanStack Query v5), Clerk Bearer token + `x-farm-id` header |
| Backend | Node 20, Fastify 5, tRPC 11 server, TypeScript compiled to `dist/` |
| Auth | Clerk (`@clerk/clerk-react` frontend, `@clerk/fastify` backend JWT verification) |
| Relational DB | PostgreSQL 15 (RDS in prod), Prisma 6 ORM, client generated to `apps/api/src/generated/prisma` |
| Time-series DB | TimescaleDB (pg16, Docker), raw `pg` Pool — **not** Prisma |
| Cache | Redis 7 (machine config request/response store) |
| IoT | AWS IoT Core MQTT via `aws-iot-device-sdk-v2` |
| Infra | Terraform (AWS provider ~5.0), EC2 + RDS + IoT + Lambda + S3 + SQS DLQ |
| Runtime mgmt | PM2 (`rooted-api` app), Nginx reverse proxy |
| CI/CD | GitHub Actions (`ci.yml` automatic, `deploy.yml` manual dispatch) |
| Tests | Vitest (backend only) |

---

## 4. Local Development Setup

### Prerequisites
- Node.js 20, pnpm 9.15.0 (`corepack enable` or `npm i -g pnpm@9.15.0`)
- Docker Desktop (for Postgres/TimescaleDB/Redis)
- A Clerk dev application (test keys)

### First-time setup

```bash
git clone git@github.com:newrootedgit/Rooted-Web-App.git
cd Rooted-Web-App
pnpm install

# Copy env template and fill in Clerk test keys
cp .env.example .env
# Required minimum for local dev:
#   VITE_API_URL=http://localhost:8000/trpc
#   VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
#   CLERK_PUBLISHABLE_KEY=pk_test_...
#   CLERK_SECRET_KEY=sk_test_...
#   DATABASE_URL=postgresql://rooted:rooted_dev_password@localhost:5433/rooted_planner
#   TIMESCALE_DATABASE_URL=postgresql://rooted:rooted_dev_password@localhost:5434/rooted_telemetry
#   MOCK_IOT=true        # skip real AWS IoT connection locally

# Start databases (postgres :5433, timescaledb :5434, redis :6379)
pnpm docker:services

# Apply migrations + generate Prisma client
cd apps/api
pnpm exec prisma migrate dev
cd ../..
```

### Day-to-day commands (root `package.json`)

| Command | What it does |
|---|---|
| `pnpm dev:full` | Docker services + API + frontend, all at once |
| `pnpm dev` | Frontend only (Vite, http://localhost:3000; admin at /admin.html) |
| `pnpm dev:api` | API only (tsx watch, http://localhost:8000) |
| `pnpm dev:backend` | Docker services + API |
| `pnpm build` | `tsc && vite build` → frontend `dist/` |
| `pnpm lint` | ESLint |
| `pnpm docker:up` / `docker:down` / `docker:logs` | Full Docker stack management |
| `pnpm seed:machine-analytics` | Seed fake telemetry (`--days`, `--machine-id`, etc.) |
| `pnpm --filter @rooted/api test` | Backend tests (watch); `test:run` for single pass |
| `pnpm --filter @rooted/api build` | Compile API → `apps/api/dist/` |

---

## 5. Architecture Deep Dive

### Backend domain structure

All domains live in `apps/api/src/domains/`. Every domain follows the same convention:

```
{domain}/
├── types.ts        # Domain interfaces (camelCase) + Zod input schemas + mapDb* converters
├── logger.ts       # createLogger({ service: 'planner-{entity}' })
├── router.ts       # tRPC router
├── queries/        # Read operations: (prisma, farmId, input) => ...   + __tests__/
└── commands/       # Write operations: same signature                  + __tests__/
```

**Convention:** DB columns are `snake_case`; domain interfaces are `camelCase`; explicit `mapDb*` functions convert between them. List endpoints use `paginationInputSchema.extend()` with `getPrismaPaginationOptions` + `createPaginatedResponse` from `apps/api/src/lib/trpc/pagination`.

**Main router** (`apps/api/src/lib/trpc/router.ts`) registers:

| Router | Domain dir | Purpose |
|---|---|---|
| `machines` | `machine-domain/` | Machine CRUD, analytics, faults, varieties, config push/pull over MQTT, demo machines |
| `machineParts` | `machine-parts-domain/` | Part usage tracking and replacement logging |
| `onboarding` | `onboarding-domain/` | Tenant/farm creation, tutorial completion state |
| `admin` | `admin-domain/` | Cross-tenant management (adminProcedure-gated) |
| `user` | `user-domain/` | User's farm list |
| `support` | `support-domain/` | Support tickets → S3 presigned uploads + Airtable |
| `products`, `customers`, `orders`, `tasks`, `farmLayouts`, `recurringSchedules`, `employees` | `planner-domain/*` | Planner product (Phases 1–3 complete) |

**Procedure types** (`apps/api/src/lib/trpc/trpc.ts`):
- `authedProcedure` — any authenticated user
- `tenantProcedure` — tenant-scoped
- `farmProcedure` — farm-scoped (most common; requires `x-farm-id` header)
- `adminProcedure` — internal admins only

**Background jobs started in `apps/api/src/index.ts`:**
- MQTT subscriber (`startMqttSubscriber()`) — skipped if `MOCK_IOT=true` or `MQTT_ENABLED=false`
- Recurring order generator — runs at boot and every `RECURRING_SCHEDULE_POLL_MS` (default 5 min); generates orders from `recurring_order_schedules` (`planner-domain/recurring-schedules/service.ts`)

### Frontend structure

- Two Vite entry points → two SPAs: `index.html` (main app) and `admin.html` (admin portal).
- Routes in `src/App.tsx`: `/auth` (Clerk), `/onboarding`, `/machines`, `/planner` — protected routes redirect to `/auth` when signed out.
- Server state via tRPC + React Query; mutations invalidate via `trpc.useUtils()`.
- tRPC client (`src/lib/trpc/client.ts`): `httpBatchLink` to `VITE_API_URL`, attaches Clerk JWT as `Authorization: Bearer` and the selected farm as `x-farm-id`.
- Web Bluetooth (`src/lib/bluetooth/`) is used during onboarding to provision a machine over BLE and read its `device_id`.

---

## 6. Databases

### Two separate databases — do not confuse them

| | PostgreSQL (Prisma) | TimescaleDB (raw `pg`) |
|---|---|---|
| Contents | All relational app data | Machine telemetry time-series |
| Local | Docker `:5433`, db `rooted_planner` | Docker `:5434`, db `rooted_telemetry` |
| Production | **AWS RDS** PostgreSQL 15 (db.t3.micro) | **Docker container on the EC2** |
| Schema mgmt | `apps/api/prisma/schema.prisma` + migrations | `docker/init-timescale.sql` (applied manually) |
| Backups | RDS automated, 7-day retention, deletion protection ON | ⚠️ **None** — only the EC2 EBS volume |
| Access | Prisma client | `apps/api/src/lib/db/timescale.ts` (pg Pool) |

### Main Prisma models by domain

- **Tenancy:** `tenants` → `farms` → `farm_users` (`clerk_user_id`, role, tutorial state)
- **Machines:** `machines` (device_id, `aws_iot_thing_name`, status, `is_demo`), `machine_faults`, `machine_parts`, `machine_part_types`, `machine_variety_history`
- **Planner:** `products`, `product_categories`, `blends` + `blend_ingredients`, `skus`, `package_types`, `customers`, `orders` + `order_items`, `recurring_order_schedules` (+ items, skips), `tasks`, `employees`, `farm_layouts`, `rack_assignments`, `supplies` (+ categories, purchases, usage)

### Migration workflow

```bash
# Local: create + apply a migration after editing schema.prisma
cd apps/api && pnpm exec prisma migrate dev --name describe_change

# Production: applied automatically by the deploy workflow via
#   pnpm exec prisma migrate deploy   (on the EC2)
```

⚠️ **TimescaleDB schema changes are NOT in Prisma.** Migration dirs that touch Timescale tables (e.g. `20260601000000_machine_analytics_realtime`) contain placeholder `migration.sql` files so `prisma migrate deploy` doesn't fail (P3015). The real DDL lives in `docker/init-timescale.sql` and must be applied to the EC2 Timescale container by hand (see runbook §14).

---

## 7. Authentication & Multi-Tenancy

- **Clerk** issues JWTs on the frontend; every tRPC request carries `Authorization: Bearer <jwt>`.
- Backend middleware (`apps/api/src/lib/auth/middleware.ts`) verifies the JWT via `clerk.authenticateRequest()`, then resolves the user's `farm_users` record (using the `x-farm-id` header, or the user's first farm as default) and attaches `{ userId, tenantId, farmId, role }` to the request.
- Public routes bypass auth: `/health` and `/internal/*` (the latter is authenticated by `LAMBDA_SECRET_TOKEN` instead — used by the IoT lifecycle Lambda).
- Hierarchy: **tenant** (org) → **farms** → **farm_users** (role: ADMIN, FARM_OPERATOR, …). All planner data is farm-scoped; machine listing can be tenant-wide.
- Internal admin access is a hardcoded/`isAdmin(userId)` check gating `adminProcedure`.
- Clerk dashboard config matters: allowed origins/redirects must include `https://app.rootedrobotics.com`. **Note: production currently uses `pk_test_`/`sk_test_` keys — see §15.**

---

## 8. Machine Telemetry Pipeline (AWS IoT)

> ⚠️ **The telemetry ingest format is FROZEN** — machines are deployed in the field and cannot be easily updated. Do not change the payload schema or topic structure without a device-update plan. Faults are communicated via `event` payloads only.

### Flow

```
ClearCore controller ──CSV──▶ Raspberry Pi (pi-src/: ingest → telemetry shipper)
                                      │ MQTT (TLS, AWS IoT Core)
                                      ▼
                  API MQTT subscriber (machine-domain/mqtt/subscriber.ts)
                   ├── status_update / event → handleTelemetry.ts
                   │     └── INSERT into TimescaleDB raw_telemetry
                   │         (ON CONFLICT DO NOTHING dedup on session/boot/seq)
                   │         + reconcileVarietyHistory.ts (variety changes)
                   └── lifecycle events → handleLifecycleEvent.ts
                         └── machines.status online/offline, last_seen_at
                         (also arrives via IoT Rule → Lambda → POST /internal,
                          authed with LAMBDA_SECRET_TOKEN, failures → SQS DLQ)
```

### Key payload fields
`session_id, boot_id, seq, delta_steps, trays_processed, torque_pct, belt_fault, blade_fault, alert_bits, kill_switch, cmd_age_ms, belt/blade/roller_motor_uptime_ms, event_code, event_value, fault_type, motor, active_variety`

### Analytics read path
- `machines.analytics` → `getMachineAnalytics.ts`. Buckets adapt to range (5-min / hourly / daily). Source priority: TimescaleDB aggregates → raw recent data → demo generator (`demoTelemetry.ts`, for `is_demo` machines) → `unavailable`.
- `machine_analytics_realtime` is a Timescale hypertable/continuous aggregate for 5-min realtime buckets.
- `machines.varietyOutput` computes per-variety production using `machine_variety_history.grams_per_tray` (user-editable via `updateVarietyGramsPerTray`).

### Machine config (presets) over MQTT
`machines.requestConfig` / `updateConfig` publish to the machine's topic; responses are cached in Redis (`CONFIG_TTL_MS`) and polled via `getConfigResponse`.

### Raspberry Pi side (`pi-src/`)
Systemd units deployed on each machine: `rooted-ble.service` (BLE provisioning), `rooted-iot.service` (IoT lifecycle), `rooted-ingest.service` (ClearCore CSV ingest), `rooted-telemetry.service` (shipping), `rooted-vector.service` (log shipping).

---

## 9. Production Infrastructure (AWS)

All infrastructure is Terraform-managed in `infra/terraform/` (region **us-west-2**, project `rooted`, env `prod`, default VPC).

| File | Resources |
|---|---|
| `ec2.tf` | t3.medium Ubuntu 22.04, 30GB encrypted gp3, **Elastic IP**, user_data installs Node 20/pnpm/Nginx/Docker/PM2 |
| `rds.tf` | PostgreSQL 15, db.t3.micro, 20→100GB autoscale, encrypted, 7-day backups, deletion protection, final snapshot |
| `iot.tf` | IoT policy `rooted-machine-policy-prod`, topic rule for lifecycle events, CloudWatch error logs |
| `lambda.tf` | `rooted-machine-lifecycle-prod` (Node 18, 256MB, 30s), env: `API_ENDPOINT`, `SECRET_TOKEN`; SQS DLQ |
| `s3.tf` | `rooted-support-uploads` bucket (private, AES256, CORS for app domain presigned PUTs) |
| `iam.tf` | Lambda exec role, IoT rule role, support-S3 IAM user |
| `security.tf` | EC2 SG: 22/80/443 in; RDS SG: 5432 from EC2 SG only |
| `outputs.tf` | `ec2_public_ip`, `rds_endpoint`, `iot_endpoint`, `support_s3_*`, etc. |

```bash
cd infra/terraform
terraform init
terraform plan  -var="db_password=…" -var="lambda_secret_token=…"
terraform apply -var="db_password=…" -var="lambda_secret_token=…"
terraform output            # ec2_public_ip, rds_endpoint, iot_endpoint, …
```

**State file:** check whether `terraform.tfstate` is local-only — if so, **migrate it to an S3 backend before anything else**; losing it means losing the ability to manage the infra safely.

**DNS:** Cloudflare `A` record `app.rootedrobotics.com` → EC2 Elastic IP. Cloudflare account access is required for any DNS change.

**Estimated cost:** ~$50/month (EC2 ~$30, RDS ~$15, EIP ~$4, IoT/Lambda/S3 ~$2).

---

## 10. Pushing to Production

Production deploys are **manual** via GitHub Actions — merging to `main` does **not** auto-deploy.

### Standard flow

1. **Open a PR to `main`.** CI (`.github/workflows/ci.yml`) runs automatically on every push/PR: lint + type-check, `pnpm audit --audit-level high`, API tests (Vitest), and full build verification.
2. **Merge to `main`** once CI is green.
3. **Trigger the deploy:** GitHub → repo → **Actions** → **Deploy to Production** (`deploy.yml`) → **Run workflow** on `main`. The `production` GitHub environment may require an approval click.
4. **What the workflow does** (~5–10 min):
   - Builds frontend with `VITE_API_URL=/api/trpc` and `VITE_CLERK_PUBLISHABLE_KEY` (from secret)
   - Builds API + generates Prisma client
   - `rsync`s over SSH to the EC2: `dist/` → `/var/www/rooted/dist/`, `apps/api/dist/`, `apps/api/prisma/`, `apps/api/package.json`, `docker/init-timescale.sql`
   - On EC2: `pnpm exec prisma migrate deploy` (RDS migrations)
   - `pm2 reload rooted-api` (graceful reload)
   - Health-checks `http://localhost:8000/health`
5. **Verify:** open `https://app.rootedrobotics.com`, check the feature, and `curl https://app.rootedrobotics.com/health`. If anything looks off: SSH in and `pm2 logs rooted-api` (§11).

### Required GitHub secrets (`production` environment)

| Secret | Value |
|---|---|
| `EC2_HOST` | EC2 Elastic IP / hostname |
| `EC2_SSH_KEY` | SSH private key for the `ubuntu` user (contents of `rooted-prod-key.pem`) |
| `CLERK_PUBLISHABLE_KEY` | Clerk publishable key baked into the frontend at build time |

### Important deploy semantics

- `.env.production` on the EC2 is **never touched by deploys** — runtime config changes are made by SSHing in and editing it, then `pm2 reload rooted-api`.
- `VITE_*` values are baked in at **build time**; changing them requires a redeploy.
- TimescaleDB schema changes are **not** applied by the workflow (the SQL file is copied but not executed) — apply manually, see §14.

### Alternative: manual deploy from your laptop

`scripts/deploy-scp.sh` builds locally and rsyncs to the EC2 (reads the IP from `terraform output -raw ec2_public_ip`, expects the key at `~/.ssh/rooted-prod-key.pem`). Use only when GitHub Actions is unavailable; finish with migrations + `pm2 reload` manually.

### Rollback

There is **no automated rollback**. Fastest path: `git revert` the bad commit on `main`, then re-run **Deploy to Production**. Database migrations are forward-only — write a new corrective migration rather than rolling back.

---

## 11. Accessing the Production EC2

### SSH

```bash
# Key: rooted-prod-key.pem (the EC2 key pair named in Terraform var ec2_key_name).
# Get a copy from whoever holds it / the team password manager — it is NOT in the repo.
chmod 600 ~/.ssh/rooted-prod-key.pem

# IP: from Terraform, or the GitHub EC2_HOST secret, or AWS console (Elastic IP)
cd infra/terraform && terraform output -raw ec2_public_ip

ssh -i ~/.ssh/rooted-prod-key.pem ubuntu@<EC2_PUBLIC_IP>
```

### Map of the box

| Thing | Where / how |
|---|---|
| App root | `/var/www/rooted/` (`dist/` = frontend, `apps/api/` = API) |
| Runtime env | `/var/www/rooted/apps/api/.env.production` |
| API process | PM2 app `rooted-api` (1 instance, 1G memory restart cap) |
| Reverse proxy | Nginx (`server_name app.rootedrobotics.com`) |
| TimescaleDB | Docker container, `127.0.0.1:5434` |
| Redis | Docker container, `127.0.0.1:6379` |
| RDS | Remote — reachable from this box only (security group) |

### Common commands once on the box

```bash
# API process
pm2 list
pm2 logs rooted-api --lines 100
pm2 reload rooted-api            # graceful restart
pm2 save                         # persist process list across reboots

# Health
curl http://localhost:8000/health

# Nginx
sudo nginx -t && sudo systemctl reload nginx
sudo systemctl status nginx
sudo tail -f /var/log/nginx/error.log

# Docker services
docker ps                        # expect timescaledb + redis containers
docker logs <container> --tail 100

# Databases
psql "$DATABASE_URL"                                   # RDS (read URL from .env.production)
psql -h localhost -p 5434 -U rooted -d rooted_telemetry  # TimescaleDB

# Migration status
cd /var/www/rooted/apps/api && pnpm exec prisma migrate status
```

### One-time server bootstrap (only for a NEW instance)

`scripts/setup-ec2.sh` provisions a fresh EC2 end-to-end: installs the stack, starts Redis + TimescaleDB containers, applies `init-timescale.sql`, writes `.env.production`, runs migrations, configures Nginx + PM2.

```bash
./scripts/setup-ec2.sh <RDS_ENDPOINT> <DB_PASSWORD> <LAMBDA_SECRET> <CLERK_PUB_KEY> <CLERK_SECRET_KEY>
```

---

## 12. Secrets & Environment Variables

### Where secrets live (none are in git)

| Location | Holds |
|---|---|
| GitHub `production` environment secrets | `EC2_HOST`, `EC2_SSH_KEY`, `CLERK_PUBLISHABLE_KEY` |
| `/var/www/rooted/apps/api/.env.production` on EC2 | All API runtime secrets (below) |
| Terraform variables (passed at apply time) | `db_password`, `lambda_secret_token` |
| `~/.ssh/rooted-prod-key.pem` (whoever deploys) | EC2 SSH key |
| Clerk dashboard | Clerk app config, keys |
| Cloudflare account | DNS |
| `secrets/` dir in repo root | Local-only certs/keys — **verify contents and ensure it stays gitignored** |

### API runtime variables (`.env.production`)

| Variable | Purpose |
|---|---|
| `NODE_ENV`, `PORT=8000`, `HOST` | Server config |
| `DATABASE_URL` | RDS: `postgresql://rooted:<pw>@<rds-endpoint>:5432/rooted_planner` |
| `TIMESCALE_DATABASE_URL` | `postgresql://rooted:<pw>@localhost:5434/rooted_telemetry` |
| `REDIS_URL` | `redis://localhost:6379` |
| `CORS_ORIGIN` | `https://app.rootedrobotics.com` |
| `CLERK_PUBLISHABLE_KEY` / `CLERK_SECRET_KEY` | JWT verification |
| `AWS_REGION`, `AWS_IOT_ENDPOINT`, `AWS_IOT_POLICY_NAME` | IoT Core (`us-west-2`) |
| `AWS_ACCESS_KEY_ID` / `AWS_SECRET_ACCESS_KEY` | IAM creds for IoT + S3 |
| `LAMBDA_SECRET_TOKEN` | Authenticates Lambda → `/internal` lifecycle calls |
| `MQTT_ENABLED`, `MOCK_IOT`, `MQTT_CLIENT_ID`, `MQTT_CLEAN_SESSION` | MQTT subscriber control (prod: enabled, clean_session=false) |
| `RECURRING_SCHEDULE_POLL_MS` | Recurring-order generator interval (default 300000) |
| `CONFIG_TTL_MS`, `CLEANUP_INTERVAL_MS` | Machine config cache |
| `SUPPORT_S3_BUCKET/REGION/ACCESS_KEY_ID/SECRET_ACCESS_KEY` | Support ticket uploads |
| `AIRTABLE_PERSONAL_ACCESS_TOKEN/BASE_ID/TABLE_NAME` | Support → Airtable sync |

### Frontend build-time variables

| Variable | Dev | Prod (set in `deploy.yml`) |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000/trpc` | `/api/trpc` (Nginx-proxied, same origin) |
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_test_…` | GitHub secret |

---

## 13. Testing

- **Framework:** Vitest, backend only (`apps/api/vitest.config.ts`, node env, `src/**/*.test.ts`). No frontend tests currently.
- **Run:** `pnpm --filter @rooted/api test:run` (CI uses this) or `test` for watch mode.
- **Mocks:** `apps/api/src/test/mockPrisma.ts` (add a factory + mock fns when adding a new table) and `mockTimescale.ts`.
- **Convention:** tests live in `__tests__/` dirs inside each domain's `queries/` and `commands/`.
- Planner Phases 1–3 ship with 72 tests across 17 files; machine domain has additional telemetry/analytics tests.

---

## 14. Operational Runbooks

### Site is down

1. `curl https://app.rootedrobotics.com/health` — if Nginx answers but health fails, it's the API.
2. SSH in (§11). `pm2 list` — if `rooted-api` is errored/stopped: `pm2 logs rooted-api --lines 200` then `pm2 restart rooted-api`.
3. If Nginx isn't answering: `sudo systemctl status nginx`, `sudo nginx -t`, `sudo systemctl restart nginx`.
4. If DB errors in logs: check RDS status in AWS console; check `docker ps` for the Timescale/Redis containers (`docker start <name>` if stopped).
5. Whole-instance failure: reboot from AWS console; PM2 (`pm2 startup`/`save`) and Docker restart policies should bring services back — verify each.

### Machines show offline / no telemetry

1. `pm2 logs rooted-api | grep -i mqtt` — check the MQTT subscriber connected.
2. Confirm `.env.production` has `MQTT_ENABLED` not false and `MOCK_IOT` not true.
3. AWS console → IoT Core → MQTT test client → subscribe to the telemetry topics to confirm machines are publishing.
4. Lifecycle events: check Lambda `rooted-machine-lifecycle-prod` logs (CloudWatch) and the SQS DLQ for failed deliveries.
5. Only one consumer may use a given MQTT client ID — a stuck duplicate connection (e.g. a dev machine running with prod creds) will bump the prod subscriber offline.

### Applying a TimescaleDB schema change

```bash
# 1. Edit docker/init-timescale.sql in the repo (and add a placeholder Prisma
#    migration dir if Prisma models reference the table — see P3015 pattern).
# 2. Deploy (the file gets copied to the EC2), then SSH in and apply manually:
docker exec -i <timescale-container> psql -U rooted -d rooted_telemetry < /var/www/rooted/init-timescale.sql
# (init-timescale.sql is written to be idempotent — verify before running)
```

### Changing a production env var

```bash
ssh -i ~/.ssh/rooted-prod-key.pem ubuntu@<IP>
nano /var/www/rooted/apps/api/.env.production
pm2 reload rooted-api
curl http://localhost:8000/health
```

### Rotating the EC2 SSH key

1. Generate a new key pair; add the public key to `~ubuntu/.ssh/authorized_keys` on the EC2 (while you still have access).
2. Update the GitHub `EC2_SSH_KEY` secret.
3. Remove the old key from `authorized_keys`; update Terraform `ec2_key_name` if you created an AWS key pair.

### Database backup / restore

- **RDS:** automated 7-day backups; restore = AWS console → RDS → restore snapshot to new instance → update `DATABASE_URL` on EC2.
- **TimescaleDB:** ⚠️ no managed backups. To snapshot manually:
  `docker exec <container> pg_dump -U rooted rooted_telemetry > telemetry_$(date +%F).sql`
  Strongly consider a cron for this, or migrating telemetry to a managed service.

### Onboarding a new machine (high level)

1. Physical machine pairs over BLE during customer onboarding (frontend `src/lib/bluetooth/`).
2. Pi provisions to AWS IoT (registers thing, gets certs — `pi-src/provisioner.py`, policy `rooted-machine-policy-prod`).
3. Machine record created via `machines.create` with `device_id` + `aws_iot_thing_name`.
4. Telemetry begins flowing; lifecycle Lambda marks it online.

---

## 15. Known Gotchas & Technical Debt

1. **TimescaleDB has no backups** and lives in Docker on the EC2. If the instance or EBS volume is lost, all telemetry history is gone. Highest-priority infra fix.
2. **Clerk keys in production are test keys** (`pk_test_`/`sk_test_`). A production Clerk instance should be created and keys swapped (GitHub secret + `.env.production` + Clerk allowed origins).
3. **Telemetry ingest schema is frozen** — deployed machines can't be trivially updated. Any payload/topic change needs a fleet-update plan. Faults arrive via `event` payloads only.
4. **Pre-existing TS error** in `apps/api/src/lib/auth/middleware.ts` (null vs undefined). Known and intentionally ignored — don't burn time on it.
5. **No staging environment yet** — every deploy is straight to prod. Setup is fully documented in `docs/upgrade_phases/STAGING_ENVIRONMENT_SETUP.md` (see §16).
6. **No automated rollback** — revert + redeploy is the procedure.
7. **Single PM2 instance, single EC2** — no HA. Nginx has no HTTPS block in `setup-ec2.sh`; TLS is presumably terminated by Cloudflare (proxied DNS). Verify the Cloudflare SSL mode if touching this.
8. **Terraform state location** — confirm whether state is local or remote; migrate to S3 + DynamoDB locking if local.
9. **`employees.sendInvite` / `resendInvite`** are placeholder endpoints, not yet wired to Clerk invitations.
10. **Frontend has no test coverage.**
11. **Harvester farm-layout integration** was pending at the time of writing (layout editor exists; machine/rack linkage in progress — see `rack_assignments`).
12. **Vite/admin entry duality** — remember `admin.html` is a separate bundle; Nginx maps `/admin` to it. New admin routes need no Nginx change, but a new top-level SPA would.

---

## 16. Staging Environment (Planned)

Documented in `docs/upgrade_phases/STAGING_ENVIRONMENT_SETUP.md`; not yet provisioned. Summary:

1. `cd infra/terraform && terraform workspace new staging`
2. Create staging tfvars (smaller `t3.small` EC2, separate RDS/IoT/Clerk env).
3. `terraform apply` in the staging workspace.
4. Run `scripts/setup-ec2.sh` on the staging box with staging values.
5. Create `.github/workflows/deploy-staging.yml` (template in the doc) + GitHub `staging` environment secrets.

Estimated extra cost: ~$35/month.

---

## Appendix: Quick Reference Card

```
Production app .......... https://app.rootedrobotics.com
Admin portal ............ https://app.rootedrobotics.com/admin
Health check ............ https://app.rootedrobotics.com/health
GitHub .................. github.com/newrootedgit/Rooted-Web-App

Deploy .................. GitHub → Actions → "Deploy to Production" → Run workflow
SSH ..................... ssh -i ~/.ssh/rooted-prod-key.pem ubuntu@<EC2_IP>
API logs ................ pm2 logs rooted-api
Restart API ............. pm2 reload rooted-api
Env file (prod) ......... /var/www/rooted/apps/api/.env.production
Infra ................... infra/terraform/  (terraform output for IPs/endpoints)
Local dev ............... pnpm install && pnpm docker:services && pnpm dev:full
Backend tests ........... pnpm --filter @rooted/api test:run
DB migration (local) .... cd apps/api && pnpm exec prisma migrate dev
AWS region .............. us-west-2
```
