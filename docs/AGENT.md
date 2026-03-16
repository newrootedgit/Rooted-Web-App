# Agent Guide

## Purpose

This document is the fast path for coding agents and contributors working in the Rooted Web App repository.

## Current Product Surface

- Machine IoT is active and includes onboarding, WiFi provisioning, telemetry-backed dashboards, fault history, and preset/config sync.
- Rooted Planner is active for products, customers, orders, tasks, production scheduling, and farm layout editing.
- The admin portal is a separate frontend entrypoint at `admin.html`.

## Local Setup

```bash
pnpm install
cp .env.example .env
cd docker && docker compose up -d postgres timescaledb redis
pnpm dev
pnpm --filter @rooted/api dev
```

Local URLs:

- frontend: `http://localhost:3000`
- admin: `http://localhost:3000/admin.html`
- API: `http://localhost:8000`
- health: `http://localhost:8000/health`

## Important Constraints

- Frontend talks to the API through tRPC.
- Farm-scoped API procedures require the `X-Farm-Id` header.
- Clerk is the only auth provider in use.
- Telemetry writes depend on `TIMESCALE_DATABASE_URL`.
- Redis is installed as a dependency and local service, but the caching/load-reduction work is still not implemented.

## Code Map

### Frontend

- `src/machines/`: machine dashboard, onboarding, WiFi flows, presets
- `src/planner/`: products, customers, orders, tasks, production, farm layout
- `src/admin/`: separate admin app
- `src/lib/trpc/`: frontend tRPC client/provider
- `src/lib/bluetooth/`: Web Bluetooth helpers

### Backend

- `apps/api/src/domains/machine-domain/`: machine CRUD, MQTT, telemetry, config sync
- `apps/api/src/domains/planner-domain/`: planner CRUD and scheduling flows
- `apps/api/src/domains/admin-domain/`: tenant and machine admin queries
- `apps/api/src/domains/onboarding-domain/`: first-run tenant/farm creation
- `apps/api/src/lib/auth/`: Clerk middleware and admin checks
- `apps/api/src/lib/db/`: Prisma and TimescaleDB clients

### Device and Infra

- `pi-src/`: Raspberry Pi BLE, AWS IoT, telemetry ingest, Vector config
- `infra/terraform/`: AWS infrastructure
- `scripts/`: EC2 bootstrap and deploy helpers

## Recommended Workflow

1. Identify the surface you are changing: machine UI, planner UI, API domain, Pi code, or infra.
2. Read the matching domain router and its command/query files before editing.
3. If the change touches planner or machine dashboards, check both frontend and backend contracts.
4. For telemetry work, verify both the PostgreSQL and TimescaleDB effects.
5. Update docs when the architecture, workflow, or upgrade status changes.

## Testing Focus

- API tests live mainly under `apps/api/src/**/__tests__`.
- Telemetry behavior is covered in `apps/api/src/domains/machine-domain/mqtt/machine-telemetry/__tests__`.
- Planner behavior is partly covered by domain-level tests; verify order-task generation paths carefully.
- Pi-side and telemetry validation guides live under `docs/testing/`.

## Documentation Map

- [Project Structure](/Users/VishalVunnam/Desktop/Rooted/Rooted-Web-App/docs/PROJECT_STRUCTURE.md)
- [Database Schema](/Users/VishalVunnam/Desktop/Rooted/Rooted-Web-App/docs/DATABASE_SCHEMA.md)
- [Machine IoT Architecture](/Users/VishalVunnam/Desktop/Rooted/Rooted-Web-App/docs/machine-iot/ARCH.md)
- [Rooted Planner Architecture](/Users/VishalVunnam/Desktop/Rooted/Rooted-Web-App/docs/rooted-planner/ARCH.md)
- [Upgrade Phases](/Users/VishalVunnam/Desktop/Rooted/Rooted-Web-App/docs/upgrade_phases)
- [Completed Upgrade Phases](/Users/VishalVunnam/Desktop/Rooted/Rooted-Web-App/docs/done_upgrade_phases)
