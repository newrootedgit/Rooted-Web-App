# Project Structure

## Overview

Rooted Web App is a multi-entry Vite application with three active surfaces:

- `index.html` -> the authenticated app for `/machines`, `/planner`, `/onboarding`, and `/auth`
- `admin.html` -> the separate admin portal
- `apps/api` -> the Fastify + tRPC backend

The repository also includes Raspberry Pi code, AWS/Terraform infrastructure, local Docker services, and project documentation.

## Current Status

- Machine IoT: implemented
- Rooted Planner: implemented for products, customers, orders, tasks, production views, and farm layout
- Admin portal: implemented as a separate Vite entrypoint
- Telemetry split architecture: implemented with PostgreSQL for relational data and TimescaleDB for telemetry
- Still planned: support widget, staging environment workflow, server-side caching/load reduction, inventory/employee/recurring-order modules

## Top-Level Layout

```text
Rooted-Web-App/
├── src/                    # Main frontend app
├── apps/api/               # Fastify + tRPC API
├── shared/                 # Shared UI, styles, and types
├── pi-src/                 # Raspberry Pi BLE + AWS IoT code
├── docker/                 # Local Postgres, TimescaleDB, Redis, API stack
├── infra/                  # Terraform and Lambda assets
├── scripts/                # EC2 bootstrap and deployment scripts
├── docs/                   # Project documentation
├── index.html              # Main frontend entry
├── admin.html              # Admin frontend entry
└── README.md
```

## Frontend

### `src/`

```text
src/
├── App.tsx
├── main.tsx
├── index.css
├── auth/                   # Clerk auth page and protected route
├── onboarding/             # Tenant/farm bootstrap flow
├── machines/               # Machine IoT UI
├── planner/                # Planner UI
├── admin/                  # Admin portal app
└── lib/
    ├── bluetooth/          # Web Bluetooth helpers
    ├── env.ts
    └── trpc/               # Frontend tRPC client/provider
```

### `src/machines/`

- `MachinesPage.tsx` hosts the machine app shell.
- `dashboard/` contains machine cards, fault history, BLE status, and WiFi flows.
- `device-discovery/` contains onboarding via Web Bluetooth.
- `wifi-provisioning/` contains WiFi update flows.
- `presets/` contains machine preset/config sync UI.
- `utils/` contains machine image helpers.

### `src/planner/`

```text
src/planner/
├── PlannerPage.tsx
├── products/              # Products, categories, blends
├── customers/             # Customer CRUD
├── orders/                # Order list and form flows
├── tasks/                 # Task list and completion flows
├── production/            # Calendar, seeding, transplant, harvest views
└── farm-layout/           # Canvas-based layout editor
```

### `src/admin/`

- Separate bundle rendered from `admin.html`
- Uses Clerk auth plus `publicMetadata.isAdmin`
- Surfaces tenant and machine admin views

## Shared Frontend Code

### `shared/`

```text
shared/
├── ui/
│   ├── components/        # AppLayout, AppHeader, Header, Sidebar, Logo, ComingSoon
│   ├── img/
│   └── styles/
├── types/                 # Shared machine and Bluetooth types
├── api-types/
└── index.ts
```

## Backend

### `apps/api/`

```text
apps/api/
├── src/
│   ├── index.ts
│   ├── domains/
│   │   ├── machine-domain/
│   │   ├── planner-domain/
│   │   ├── admin-domain/
│   │   ├── onboarding-domain/
│   │   └── user-domain/
│   └── lib/
│       ├── auth/
│       ├── aws/
│       ├── db/
│       ├── errors/
│       ├── logger/
│       └── trpc/
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── package.json
```

### Domain Summary

- `machine-domain`
  - machine CRUD
  - fault history queries
  - AWS IoT preset/config request-response flows
  - MQTT lifecycle + telemetry ingestion
- `planner-domain/products`
  - products, categories, blends
- `planner-domain/customers`
  - customer CRUD and deactivation
- `planner-domain/orders`
  - order CRUD and status changes
- `planner-domain/tasks`
  - task listing, completion, status updates, drag-drop rescheduling
- `planner-domain/farm-layout`
  - saved layouts and active layout lookup
- `admin-domain`
  - tenant overview, tenant machines, machine faults
- `onboarding-domain`
  - first-tenant / first-farm setup
- `user-domain`
  - current user's farm memberships

### Auth and Context

- Clerk auth is enforced in `apps/api/src/lib/auth/middleware.ts`.
- Farm-scoped procedures require `X-Farm-Id`.
- `tenantProcedure` supports tenant-wide queries with an optional farm filter.

## Data and Infrastructure

### `docker/`

- `docker-compose.yml` starts:
  - PostgreSQL on `localhost:5433`
  - TimescaleDB on `localhost:5434`
  - Redis on `localhost:6379`
  - optional local API container on `localhost:8000`
- `init.sql` initializes relational DB extensions/schema prerequisites.
- `init-timescale.sql` initializes telemetry hypertables, indexes, policies, and aggregates.

### `infra/`

- `infra/terraform/` manages EC2, RDS, IAM, security groups, IoT resources, and Lambda infrastructure.
- `infra/lambda/machine-lifecycle/` contains the lifecycle Lambda source.

### `scripts/`

- `setup-ec2.sh` bootstraps app services on EC2, including TimescaleDB.
- `deploy-scp.sh` copies deployment artifacts to EC2.

## Raspberry Pi Code

### `pi-src/`

```text
pi-src/
├── provisioner.py             # BLE peripheral / provisioning service
├── aws/                       # IoT registration, telemetry ingest, command handling
├── vector/                    # Vector config and service files
├── setup-scripts/             # Pi provisioning helpers
├── *.service / *.timer        # systemd units
└── deploy-*.sh                # Pi deployment scripts
```

Key responsibilities:

- BLE onboarding and WiFi provisioning
- AWS IoT registration and MQTT command handling
- telemetry ingest to JSONL
- Vector shipping telemetry to AWS IoT Core

## Documentation Layout

```text
docs/
├── machine-iot/
├── rooted-planner/
├── testing/
├── user-guides/
├── upgrade_phases/           # Active or incomplete upgrade plans
└── done_upgrade_phases/      # Completed upgrade work and summaries
```

Use `docs/upgrade_phases` for open work. When implementation is complete, move the phase document into `docs/done_upgrade_phases`.

## Runtime Reference

- Frontend dev server: `http://localhost:3000`
- Admin portal dev URL: `http://localhost:3000/admin.html`
- API dev server: `http://localhost:8000`
- tRPC endpoint in dev: `http://localhost:8000/trpc`
- Health check: `http://localhost:8000/health`
