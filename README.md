# Rooted Web App

Rooted Web App combines two authenticated product surfaces in one repo:

- Machine IoT: BLE onboarding, WiFi provisioning, machine dashboards, telemetry, fault history, and preset/config sync
- Rooted Planner: products, customers, orders, tasks, production scheduling, and farm layout

It also includes a separate admin portal, Raspberry Pi device code, AWS/Terraform infrastructure, and local Docker services.

## Architecture

```text
Frontend (Vite)
  ├── main app: /machines, /planner, /onboarding, /auth
  └── admin app: /admin.html

Fastify + tRPC API
  ├── PostgreSQL (relational app data)
  ├── TimescaleDB (raw telemetry + aggregates)
  ├── Clerk auth
  └── AWS IoT integration

Raspberry Pi
  ├── BLE provisioner
  ├── AWS IoT registration / command handling
  └── telemetry ingest + Vector shipping
```

## Repo Layout

```text
src/            Frontend app surfaces
apps/api/       Fastify + tRPC backend
shared/         Shared UI, styles, and types
pi-src/         Raspberry Pi code
docker/         Local Postgres, TimescaleDB, Redis, API stack
infra/          Terraform and Lambda assets
scripts/        EC2 bootstrap and deployment helpers
docs/           Project documentation
```

## Local Development

### 1. Install

```bash
pnpm install
cp .env.example .env
```

### 2. Start local services

```bash
cd docker
docker compose up -d postgres timescaledb redis
cd ..
```

### 3. Fill in environment variables

Minimum local variables:

```env
VITE_API_URL=http://localhost:8000/trpc
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
DATABASE_URL=postgresql://rooted:rooted_dev_password@localhost:5433/rooted_planner
TIMESCALE_DATABASE_URL=postgresql://rooted:rooted_dev_password@localhost:5434/rooted_telemetry
REDIS_URL=redis://localhost:6379
PORT=8000
AWS_REGION=us-west-2
```

If you want the MQTT subscriber active locally, also set:

```env
AWS_IOT_ENDPOINT=...
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
```

Otherwise set `MOCK_IOT=true`.

### 4. Run the apps

```bash
pnpm dev
pnpm dev:api
```

Local URLs:

- frontend: `http://localhost:3000`
- admin: `http://localhost:3000/admin.html`
- API: `http://localhost:8000`
- tRPC: `http://localhost:8000/trpc`
- health: `http://localhost:8000/health`

## Notes

- Planner and machine APIs are farm-scoped; requests use Clerk auth and `X-Farm-Id`.
- Telemetry is split: PostgreSQL stores relational machine state and fault events, while TimescaleDB stores raw telemetry and aggregates.
- Redis exists in the stack, but the caching/load-reduction upgrade is still open.

## Documentation

- [Project Structure](docs/PROJECT_STRUCTURE.md)
- [Database Schema](docs/DATABASE_SCHEMA.md)
- [Agent Guide](docs/AGENT.md)
- [Machine IoT Architecture](docs/machine-iot/ARCH.md)
- [Machine IoT Requirements](docs/machine-iot/REQUIREMENTS.md)
- [Rooted Planner Architecture](docs/rooted-planner/ARCH.md)
- [Rooted Planner Requirements](docs/rooted-planner/REQUIREMENTS.md)
- [Testing Guides](docs/testing)
- [Active Upgrade Phases](docs/upgrade_phases)
- [Completed Upgrade Phases](docs/done_upgrade_phases)

## Useful Commands

```bash
pnpm build
pnpm lint
pnpm --filter @rooted/api test:run
pnpm docker:up
pnpm docker:down
```
