# Machine Parts Lifespan Upgrade Phase

## Overview

Track the wear of replaceable machine parts (belts, motors, etc.) and notify users
as parts approach end-of-life. Each part type has a default lifespan measured in
either **runtime hours** or **cycles**, configurable per farm via an admin page.
Alerts are tiered: a **WARNING** fires at a configurable percentage of lifespan
(default 80%) and a **CRITICAL** fires at 100%.

In-app banner + per-machine panel ship in v1. Email delivery and the cron host for
the alert engine are deferred until the in-app flow is working end-to-end.

### Locked decisions

| Question | Decision |
|----------|----------|
| Parts catalog source | Fully DB-driven, managed in an admin page |
| Lifespan metric | Mixed: `HOURS` and `CYCLES` |
| Cycles source (v1) | Reuse the existing roller/motor counter telemetry field |
| Catalog defaults | Seed global defaults (`farm_id = NULL`); per-farm override rows allowed |
| Notification surfaces (v1) | In-app banner + email (email transport TBD) |
| Threshold model | Tiered WARNING + CRITICAL, configurable per part type |
| Email transport | **Deferred** — pick once in-app flow works |
| Alert engine host | **Deferred** — pick once in-app flow works |

---

## Step 1: Database Migration

New Prisma migration under `apps/api/prisma/migrations/`. All tables are
farm-scoped and follow the existing snake_case + RLS conventions.

### `machine_part_types` — catalog of part *kinds*

| Column             | Type                          | Notes                                                  |
|--------------------|-------------------------------|--------------------------------------------------------|
| `id`               | uuid pk                       | `uuid_generate_v4()`                                   |
| `farm_id`          | uuid?                         | `NULL` = global default; non-null = per-farm override  |
| `machine_type`     | varchar(50)                   | `SEEDER` \| `HARVESTER` \| `OTHER` (matches `machineType.ts`) |
| `name`             | varchar(255)                  | e.g. `"belt"`, `"belt motor"`                          |
| `metric`           | varchar(20)                   | `HOURS` \| `CYCLES`                                    |
| `default_lifespan` | int                           | hours or cycles                                        |
| `warning_pct`      | int default 80                |                                                        |
| `critical_pct`     | int default 100               |                                                        |
| `created_at`       | timestamp default now()       |                                                        |
| `updated_at`       | timestamp                     |                                                        |

Indexes: `(farm_id, machine_type)`, unique `(farm_id, machine_type, name)`
(treat `NULL` farm as a distinct key with `COALESCE`).

### `machine_parts` — actual installed parts on a specific machine

| Column              | Type                    | Notes                                                  |
|---------------------|-------------------------|--------------------------------------------------------|
| `id`                | uuid pk                 |                                                        |
| `machine_id`        | uuid fk → `machines`    | `ON DELETE CASCADE`                                    |
| `part_type_id`      | uuid fk → `machine_part_types` | `ON DELETE RESTRICT`                            |
| `installed_at`      | timestamp               |                                                        |
| `lifespan_override` | int?                    | per-install override; falls back to part type default  |
| `usage_at_install`  | numeric(12,2)           | snapshot of machine total (hours or cycles) at install |
| `replaced_at`       | timestamp?              | soft-retire on replacement                             |
| `notes`             | text?                   |                                                        |
| `created_at`        | timestamp default now() |                                                        |

Indexes: `(machine_id, replaced_at)` for "active parts on machine" queries.

### `machine_part_alerts` — fired alert log

| Column              | Type                    | Notes                                                  |
|---------------------|-------------------------|--------------------------------------------------------|
| `id`                | uuid pk                 |                                                        |
| `machine_part_id`   | uuid fk → `machine_parts` | `ON DELETE CASCADE`                                  |
| `level`             | varchar(20)             | `WARNING` \| `CRITICAL`                                |
| `triggered_at`      | timestamp default now() |                                                        |
| `acknowledged_at`   | timestamp?              |                                                        |
| `email_sent_at`     | timestamp?              | populated once email transport ships                   |

Unique partial index: `(machine_part_id, level) WHERE acknowledged_at IS NULL`
prevents re-firing the same level until the user acknowledges.

### `machine_usage_totals` — rolling cumulative counters per machine

| Column          | Type                    | Notes                                                |
|-----------------|-------------------------|------------------------------------------------------|
| `machine_id`    | uuid pk fk → `machines` |                                                      |
| `runtime_hours` | numeric(12,2)           | monotonic                                            |
| `cycle_count`   | bigint                  | from existing roller/motor counter telemetry         |
| `as_of`         | timestamp               | last refresh timestamp                               |

Refresh strategy: extend the existing telemetry enrichment path
(`apps/api/src/domains/machine-domain/queries/enrichMachinesWithTelemetry.ts`)
to upsert this row alongside the data it already pulls from TimescaleDB.

### Seed: global default catalog

Insert `farm_id = NULL` rows for the starter parts. Concrete values to be
finalized with the team, suggested starting point:

| machine_type | name        | metric  | default_lifespan |
|--------------|-------------|---------|------------------|
| SEEDER       | belt        | HOURS   | 200              |
| SEEDER       | belt motor  | HOURS   | 300              |
| HARVESTER    | blade       | CYCLES  | 50000            |
| HARVESTER    | drive motor | HOURS   | 500              |

---

## Step 2: Update mock Prisma + shared types

- `apps/api/src/test/mockPrisma.ts` — add types, factories, and mock fns for
  `machine_part_types`, `machine_parts`, `machine_part_alerts`,
  `machine_usage_totals`.
- `shared/types/machines.ts` — add `MachinePartMetric`, `MachinePartAlertLevel`,
  and DTO interfaces (camelCase).

---

## Step 3: Backend domain — `apps/api/src/domains/machine-parts-domain/`

Following the structure laid out in CLAUDE.md.

```
machine-parts-domain/
  types.ts                         # Zod schemas + camelCase interfaces + mapDb* fns
  logger.ts                        # createLogger({ service: 'machine-parts' })
  router.ts                        # farmProcedure tRPC routes
  queries/
    listPartTypes.ts               # filterable by machine_type; merges global + farm overrides
    getPartTypeById.ts
    listMachineParts.ts            # parts for a machine, with computed wear % + status
    listPartsNearingLifespan.ts    # cross-machine, used by banner
    listAlerts.ts                  # open alerts for a farm
    __tests__/
  commands/
    createPartType.ts
    updatePartType.ts
    deletePartType.ts
    installPart.ts                 # snapshots usage_at_install from machine_usage_totals
    replacePart.ts                 # soft-retire current row + insert new one in one tx
    acknowledgeAlert.ts
    runAlertScan.ts                # the engine pass; callable from a cron or manually
    __tests__/
```

Register the router in `apps/api/src/lib/trpc/router.ts`.

`runAlertScan` reads all active `machine_parts`, joins
`machine_usage_totals`, computes `pct = (current_total − usage_at_install) /
effective_lifespan * 100`, and inserts alerts where the unique partial index
permits. Pure function on top of Prisma — no transport coupling, so we can wire
it to any cron host later.

---

## Step 4: Frontend — admin page

Path: `src/machines/parts-admin/PartTypesAdminPage.tsx`

- Table of part types, grouped by `machine_type`.
- Toggle "Global defaults" vs "Farm overrides".
- Inline edit: name, metric, default lifespan, warning %, critical %.
- "Override globally" action duplicates a global row into the current farm.

Reuses `trpc` from `src/lib/trpc/index.ts` and the existing table primitives.

---

## Step 5: Frontend — per-machine parts panel

Path: `src/machines/parts/MachinePartsPanel.tsx`

Embedded inside `src/machines/dashboard/components/MachineCard.tsx` (or the
analytics page if that's where wear lives best — verify when implementing):

- List of currently installed parts (`replaced_at IS NULL`).
- Each row: progress bar with wear %, color-coded by WARNING/CRITICAL.
- Actions: **Install part** (pick from catalog), **Replace** (soft-retire +
  install in one call), **Acknowledge alert**.

---

## Step 6: Frontend — banner / notification surface

- Banner component on `src/machines/MachinesPage.tsx` showing counts of
  WARNING and CRITICAL parts, linking to a filtered list view.
- Use `listPartsNearingLifespan` as the data source.

---

## Step 7: Tests

Vitest, in `__tests__/` dirs next to each query/command. Cover at minimum:

- `installPart` snapshots `usage_at_install` correctly.
- `replacePart` is atomic and sets `replaced_at` on the old row.
- `runAlertScan` fires WARNING then CRITICAL exactly once each, respects
  `acknowledged_at`, and uses per-install `lifespan_override` when set.
- `listMachineParts` correctly merges global defaults with farm overrides when
  computing effective thresholds.

---

## Deferred (post-v1)

1. **Email transport.** Pick provider, wire to `machine_part_alerts.email_sent_at`.
2. **Alert engine host.** Decide between reusing an existing scheduler, Vercel
   cron hitting an internal route, or a Node interval in the API process.
3. **Push/SMS** if requested later.
4. **Maintenance history view** — render `replaced_at` history per machine.

---

## Build order (suggested PRs)

1. Migration + Prisma schema + mockPrisma + shared types + seed.
2. Part-types CRUD backend + admin UI.
3. `machine_parts` install/replace + `machine_usage_totals` rollup hook.
4. `runAlertScan` + `machine_part_alerts` + acknowledge flow (no email yet).
5. Per-machine parts panel + banner.
6. Wire chosen email transport and cron host.
