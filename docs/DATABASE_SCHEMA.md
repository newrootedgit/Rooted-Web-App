# Database Schema

## Overview

The application uses two databases:

- PostgreSQL (`rooted_planner`) for relational application data managed through Prisma
- TimescaleDB (`rooted_telemetry`) for raw telemetry ingestion and aggregate machine stats

This split is implemented in the current codebase.

## Relational Database

### Core Multi-Tenant Tables

These tables are active and used by onboarding, auth, machine access, and planner features:

- `tenants`
- `farms`
- `farm_users`

Relationship:

```text
tenants
  └── farms
        ├── farm_users
        ├── machines
        ├── products / categories / blends
        ├── customers
        ├── orders / order_items
        ├── tasks
        └── farm_layouts
```

Notes:

- Clerk user IDs are stored in `farm_users.clerk_user_id`.
- API middleware resolves tenant and farm context from Clerk plus `X-Farm-Id`.
- RLS comments remain in the Prisma schema, but access is primarily enforced in application code.

### Machine IoT Tables

#### `machines`

Used in production.

Important fields:

- `tenant_id`
- `farm_id`
- `name`
- `display_name`
- `device_id`
- `aws_iot_thing_name`
- `status`
- `current_wifi_ssid`
- `last_seen_at`

Purpose:

- canonical machine registry
- machine identity and ownership
- current connectivity metadata

#### `machine_faults`

Used in production.

Important fields:

- `machine_id`
- `fault_type`
- `fault_value`
- `event_code`
- `motor`
- `torque_pct`
- `created_at`

Purpose:

- discrete fault event history in PostgreSQL
- latest fault lookups for machine dashboards and admin views
- event-based fault routing from MQTT telemetry

### Planner Tables

#### Implemented in UI and API

- `product_categories`
- `products`
- `blends`
- `blend_ingredients`
- `customers`
- `orders`
- `order_items`
- `tasks`
- `farm_layouts`
- `rack_assignments`

These back the current planner screens:

- product catalog
- category management
- blend management
- customer management
- order entry and order status changes
- generated production tasks
- production calendar / seeding / transplant / harvest views
- farm layout editor

#### Present in Schema but Not Yet Wired Into the App

- `employees`
- `recurring_order_schedules`
- `supplies`
- `supply_categories`
- `supply_purchases`
- `supply_usage`

These remain schema-level groundwork for future modules.

## Telemetry Database

TimescaleDB is not represented in Prisma. It is initialized from [docker/init-timescale.sql](/Users/VishalVunnam/Desktop/Rooted/Rooted-Web-App/docker/init-timescale.sql).

### `raw_telemetry`

Primary hypertable for machine telemetry batches written by `handleTelemetry.ts`.

Important columns:

- `machine_id`
- `session_id`
- `received_at`
- `type`
- `boot_id`
- `seq`
- `uptime_ms`
- `delta_steps`
- `belt_motor_uptime_ms`
- `blade_motor_uptime_ms`
- `torque_pct`
- `belt_fault`
- `blade_fault`
- `event_code`
- `event_value`
- `trays_processed`
- `fault_type`
- `motor`

Characteristics:

- hypertable partitioned on `received_at`
- dedup via unique index and `ON CONFLICT DO NOTHING`
- compression policy
- retention policy

### `machine_stats`

Continuous aggregate built on `raw_telemetry`.

Used for:

- dashboard metrics
- machine enrichment queries
- rollups of uptime, trays, and motor usage

## Write Paths

### Relational Writes

- onboarding -> `tenants`, `farms`, `farm_users`
- planner CRUD -> planner tables via Prisma
- lifecycle events -> `machines.status`, `machines.last_seen_at`
- fault routing -> `machine_faults`

### Telemetry Writes

- Pi ingest timestamps payloads
- AWS IoT delivers telemetry to the API subscriber
- `apps/api/src/domains/machine-domain/mqtt/subscriber.ts` buffers batches
- `apps/api/src/domains/machine-domain/mqtt/machine-telemetry/handleTelemetry.ts` inserts into `raw_telemetry`

## Local Development Ports

- PostgreSQL: `localhost:5433`
- TimescaleDB: `localhost:5434`
- Redis: `localhost:6379`

## Source of Truth

- Relational schema: [apps/api/prisma/schema.prisma](/Users/VishalVunnam/Desktop/Rooted/Rooted-Web-App/apps/api/prisma/schema.prisma)
- Telemetry schema/bootstrap: [docker/init-timescale.sql](/Users/VishalVunnam/Desktop/Rooted/Rooted-Web-App/docker/init-timescale.sql)
- Telemetry ingestion: [handleTelemetry.ts](/Users/VishalVunnam/Desktop/Rooted/Rooted-Web-App/apps/api/src/domains/machine-domain/mqtt/machine-telemetry/handleTelemetry.ts)
