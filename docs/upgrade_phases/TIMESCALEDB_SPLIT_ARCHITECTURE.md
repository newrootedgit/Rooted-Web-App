# Telemetry Split Architecture: RDS + TimescaleDB

**Status:** Planned
**Priority:** Critical
**Supersedes:** `VECTOR_TIMESCALEDB_UPGRADE.md` Phase 1 (which assumed TimescaleDB as an extension on the same Postgres instance)

---

## Problem Statement

The current telemetry aggregation in `handleTelemetry.ts` is fundamentally broken. Three interrelated bugs cause inflated uptime, motor time, and tray counts:

1. **No idempotency** — MQTT QoS `AtLeastOnce` can redeliver the same message. There is no deduplication by `(boot_id, seq)`. Every counter gets double-counted on redelivery.

2. **Buffered replay after server downtime** — Vector's 256MB disk buffer (`pi-src/vector/rooted-telemetry.toml:48-49`) replays everything when connectivity resumes. The API has no way to know which messages it already processed.

3. **Fire-and-forget flush races** — `subscriber.ts:24-34` calls `handleTelemetry()` without `await`. If a flush takes longer than 30 seconds, the next interval fires concurrently, creating overlapping transactions on the same machine row.

These are all the same root cause: **the aggregation has no memory of what it already processed**. The 200-line state machine in `handleTelemetry.ts` treats every message as new.

### Observed Impact

Leaving a machine running for one hour with steady telemetry (`belt_up=0ms, blade_up=0ms, trays=2`) resulted in extremely inflated motor time and tray counts on the dashboard — consistent with duplicate processing of the same payloads.

---

## Solution: Split Database Architecture

| Database | Purpose | Data |
|----------|---------|------|
| **RDS (existing)** | Business data, machine identity, fault events | `machines`, `farms`, `tenants`, `orders`, `tasks`, `machine_faults` (new) |
| **TimescaleDB (new VM)** | Time-series telemetry ingestion + aggregation | `machine_telemetry` hypertable, continuous aggregates |

### Why Split?

- **Performance isolation** — High-throughput telemetry writes don't compete with business queries for RDS connections, I/O, or CPU.
- **Right tool for each job** — TimescaleDB handles time-partitioning, dedup via `ON CONFLICT`, `counter_agg` for monotonic counters, compression, and retention. RDS stays simple relational Postgres.
- **Eliminates application-side aggregation** — The 200-line state machine in `handleTelemetry.ts` is replaced by TimescaleDB continuous aggregates. Zero application-side aggregation code.
- **Independent scaling** — Size the TimescaleDB VM for write-heavy I/O without upsizing the RDS instance.

### Why NOT Keep TimescaleDB as an Extension on RDS?

AWS RDS does not support the TimescaleDB extension. To use TimescaleDB, we need either a self-managed VM or Timescale Cloud. Since we already need a separate instance, a clean split is the natural architecture.

---

## Architecture After Migration

```
ClearCore Firmware
  |
  v
Pi (telemetry_ingest.py) --> /home/rooted/telemetry_log.jsonl
                                    |
                                    v
                              Vector (systemd)
                              - tails JSONL from checkpoint
                              - disk-backed buffer (256MB)
                              - batches up to 50 events / 30s
                                    |
                                    v
                              AWS IoT Core (MQTT)
                                    |
                                    v
                              API subscriber.ts
                              - buffers per-device (30s)
                              - serialized flush (await)
                                    |
                                    v
                              handleTelemetry.ts
                              |                        |
                              v                        v
                        TimescaleDB               RDS (existing)
                        - INSERT raw telemetry     - UPDATE last_seen_at
                        - ON CONFLICT DO NOTHING   - INSERT machine_faults
                        - continuous aggregates      (from EVENT payloads)
                        - compression + retention

Dashboard Load:
  |-- RDS: SELECT * FROM machines WHERE tenant_id = $1
  |-- TimescaleDB: SELECT * FROM machine_stats WHERE machine_id IN (...)
  |-- RDS: SELECT * FROM machine_faults WHERE machine_id IN (...) ORDER BY created_at DESC LIMIT 1
```

---

## What Moves Where

### Stays on RDS `machines` table

These are machine identity/config fields — not telemetry aggregates:

| Column | Reason |
|--------|--------|
| `id`, `tenant_id`, `farm_id`, `name`, `display_name`, `device_id` | Identity |
| `created_at`, `aws_iot_thing_name` | Config |
| `status`, `last_seen_at`, `current_wifi_ssid` | Lifecycle (from `handleLifecycleEvent.ts`, not telemetry) |

### Removed from RDS `machines` table

All 15 aggregate/tracking columns move to TimescaleDB continuous aggregates:

| Column | Replacement |
|--------|-------------|
| `total_steps` | `counter_agg(delta_steps)` continuous aggregate |
| `total_uptime_ms` | `counter_agg(uptime_ms)` continuous aggregate |
| `current_boot_id` | No longer needed — boot tracking is implicit in `counter_agg` reset detection |
| `current_boot_uptime_ms` | `MAX(uptime_ms)` for latest boot in continuous aggregate |
| `reboot_count` | `COUNT(DISTINCT boot_id)` continuous aggregate |
| `belt_fault_count` | `COUNT(*)` from `machine_faults` table in RDS |
| `blade_fault_count` | `COUNT(*)` from `machine_faults` table in RDS |
| `tray_count` | `counter_agg(trays_processed)` continuous aggregate |
| `last_raw_tray_count` | No longer needed — `counter_agg` handles resets |
| `last_belt_fault`, `last_blade_fault` | Latest row from `machine_faults` table |
| `current_belt_motor_uptime_ms` | `counter_agg(belt_motor_uptime_ms)` continuous aggregate |
| `total_belt_motor_uptime_ms` | Same — `counter_agg` sums across resets |
| `current_blade_motor_uptime_ms` | `counter_agg(blade_motor_uptime_ms)` continuous aggregate |
| `total_blade_motor_uptime_ms` | Same |
| `last_raw_belt_motor_uptime_ms` | No longer needed |
| `last_raw_blade_motor_uptime_ms` | No longer needed |
| `last_motor_boot_id` | No longer needed |

### New RDS table: `machine_faults`

Faults are discrete events, not time-series data. They belong in RDS.

```sql
CREATE TABLE machine_faults (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  machine_id  UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
  fault_type  VARCHAR(50) NOT NULL,  -- 'belt' or 'blade'
  fault_value INT NOT NULL,          -- the raw fault flag value
  event_code  VARCHAR(100),          -- from EVENT payload if available
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_machine_faults_machine_id ON machine_faults(machine_id);
CREATE INDEX idx_machine_faults_created_at ON machine_faults(created_at);
```

### TimescaleDB: `machine_telemetry` hypertable

Same columns as today, but with three key differences:

1. **`received_at` uses the Pi-side timestamp** (not server-side `new Date()`) — this is critical for dedup
2. **Unique constraint includes the time column** (TimescaleDB requirement)
3. **No UUID primary key** — hypertables don't need one; the unique constraint serves as the identity

```sql
CREATE TABLE machine_telemetry (
  machine_id              UUID NOT NULL,
  received_at             TIMESTAMPTZ NOT NULL,   -- Pi-side timestamp from payload
  server_received_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  type                    VARCHAR(50),
  schema_ver              INT,
  boot_id                 BIGINT,
  seq                     INT,
  uptime_ms               BIGINT,
  delta_steps             INT,
  belt_motor_uptime_ms    BIGINT,
  blade_motor_uptime_ms   BIGINT,
  torque_pct              SMALLINT,
  belt_fault              SMALLINT,
  blade_fault             SMALLINT,
  alert_bits              INT,
  kill_switch             SMALLINT,
  cmd_age_ms              INT,
  udp_fail_count          INT,
  event_code              VARCHAR(100),
  event_value             INT,
  trays_processed         INT,
  session_id              VARCHAR(36)
);

-- Convert to hypertable with 7-day chunks
SELECT create_hypertable('machine_telemetry', 'received_at',
  chunk_time_interval => INTERVAL '7 days'
);

-- Dedup constraint: unique per (machine, boot, seq, time)
-- TimescaleDB requires the time column in all unique constraints
CREATE UNIQUE INDEX machine_telemetry_dedup_idx
  ON machine_telemetry (machine_id, boot_id, seq, received_at)
  WHERE boot_id IS NOT NULL AND seq IS NOT NULL;
```

**Why `received_at` must be the Pi-side timestamp:**

The dedup constraint includes `received_at` (TimescaleDB requires it). If we stamp `new Date()` on the server, the same message redelivered 5 seconds later gets a different `received_at`, bypasses the unique constraint, and gets inserted as a duplicate. The Pi timestamp from `telemetry_ingest.py` (`time.time()`) is deterministic for a given message — replays produce the same value.

---

## TimescaleDB Continuous Aggregates

These replace the entire hand-rolled state machine. TimescaleDB computes them incrementally in the background.

### Required Extension: `timescaledb_toolkit`

The `counter_agg` function lives in the Toolkit extension, which must be installed separately from the base TimescaleDB extension:

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS timescaledb_toolkit;
```

### `machine_stats` — The Main Dashboard View

This is what the dashboard queries instead of the old `machines` aggregate columns.

```sql
CREATE MATERIALIZED VIEW machine_stats
WITH (timescaledb.continuous) AS
SELECT
  machine_id,
  time_bucket('1 hour', received_at) AS bucket,

  -- Total uptime across all boots (counter_agg handles resets automatically)
  counter_agg(received_at, uptime_ms)              AS uptime_agg,

  -- Motor uptimes (same reset-aware logic)
  counter_agg(received_at, belt_motor_uptime_ms)   AS belt_motor_agg,
  counter_agg(received_at, blade_motor_uptime_ms)  AS blade_motor_agg,

  -- Tray count (monotonic per session, resets on reboot)
  counter_agg(received_at, trays_processed)        AS tray_agg,

  -- Simple aggregates
  COUNT(DISTINCT boot_id)                          AS boot_count,
  SUM(delta_steps)                                 AS total_steps,
  AVG(torque_pct)                                  AS avg_torque_pct,
  MAX(uptime_ms)                                   AS max_uptime_ms

FROM machine_telemetry
WHERE type = 'status_update'
  AND received_at < NOW()
GROUP BY machine_id, time_bucket('1 hour', received_at);

-- Refresh every 5 minutes, covering data from 1 hour ago to now
SELECT add_continuous_aggregate_policy(
  'machine_stats',
  start_offset   => INTERVAL '1 hour',
  end_offset     => INTERVAL '5 minutes',
  schedule_interval => INTERVAL '5 minutes'
);
```

### Querying the Aggregate for the Dashboard

```sql
-- Get all-time stats for a set of machines
SELECT
  machine_id,
  delta(rollup(uptime_agg))             AS total_uptime_ms,
  delta(rollup(belt_motor_agg))         AS total_belt_motor_uptime_ms,
  delta(rollup(blade_motor_agg))        AS total_blade_motor_uptime_ms,
  delta(rollup(tray_agg))              AS total_tray_count,
  SUM(boot_count)                       AS reboot_count,
  SUM(total_steps)                      AS total_steps
FROM machine_stats
WHERE machine_id = ANY($1::uuid[])
GROUP BY machine_id;
```

**How `counter_agg` + `delta` works:**

`counter_agg(time, value)` builds an aggregate that tracks a monotonically increasing counter. When the value decreases compared to its previous value (i.e., the machine rebooted and the counter reset), it interprets this as a reset and accounts for it. The `delta()` accessor returns the total change across the time range, including all resets. This is exactly what we need for `uptime_ms`, motor uptimes, and `trays_processed`.

**How `rollup()` works:**

`rollup()` combines multiple hourly `counter_agg` summaries into a single all-time aggregate. This is what makes the continuous aggregate efficient — TimescaleDB precomputes the hourly buckets, and we roll them up at query time.

### Real-Time Accuracy

The continuous aggregate refreshes every 5 minutes with a 5-minute `end_offset`, meaning the most recent 5 minutes of data are not yet materialized. TimescaleDB's **real-time aggregation** feature (enabled by default) automatically combines the materialized data with the latest raw data on query, so dashboard results are always up-to-date.

---

## Compression and Retention

```sql
-- Compress chunks older than 7 days (~90% storage reduction)
ALTER TABLE machine_telemetry SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'machine_id',
  timescaledb.compress_orderby   = 'received_at DESC'
);
SELECT add_compression_policy('machine_telemetry', INTERVAL '7 days');

-- Drop raw data older than 90 days (continuous aggregates retain the rollups forever)
SELECT add_retention_policy('machine_telemetry', INTERVAL '90 days');
```

**Key point:** Retention drops raw chunks, but the continuous aggregate `machine_stats` retains the precomputed rollups indefinitely. You keep all-time uptime/tray/motor totals without keeping all-time raw data.

---

## Implementation Phases

### Phase 1: Provision TimescaleDB + Create Schema

**Goal:** TimescaleDB VM running with the hypertable, continuous aggregates, and policies. No application code changes yet.

#### 1.1 — Provision the VM

- Provision a VM in the **same VPC/region** as the API server (sub-millisecond latency)
- Install PostgreSQL 16 + TimescaleDB extension + TimescaleDB Toolkit
- Recommended: Ubuntu 22.04+, 2 vCPUs, 4GB RAM, SSD storage
- Configure `pg_hba.conf` to allow connections from the API server's security group
- Set `max_connections`, `shared_buffers`, `work_mem` appropriately for write-heavy workload

```bash
# On the VM (Ubuntu example)
sudo apt install -y postgresql-16 timescaledb-2-postgresql-16

# Enable the extension in postgresql.conf
sudo timescaledb-tune --yes

sudo systemctl restart postgresql
```

#### 1.2 — Create the Database and Schema

Connect to the new TimescaleDB instance and run:

```sql
CREATE DATABASE rooted_telemetry;
\c rooted_telemetry

CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS timescaledb_toolkit;

-- Create the hypertable (full SQL from "TimescaleDB: machine_telemetry hypertable" section above)
CREATE TABLE machine_telemetry ( ... );
SELECT create_hypertable('machine_telemetry', 'received_at', chunk_time_interval => INTERVAL '7 days');
CREATE UNIQUE INDEX machine_telemetry_dedup_idx
  ON machine_telemetry (machine_id, boot_id, seq, received_at)
  WHERE boot_id IS NOT NULL AND seq IS NOT NULL;

-- Create the continuous aggregate (full SQL from "machine_stats" section above)
CREATE MATERIALIZED VIEW machine_stats WITH (timescaledb.continuous) AS ...;
SELECT add_continuous_aggregate_policy('machine_stats', ...);

-- Compression + retention
ALTER TABLE machine_telemetry SET ( ... );
SELECT add_compression_policy('machine_telemetry', INTERVAL '7 days');
SELECT add_retention_policy('machine_telemetry', INTERVAL '90 days');
```

#### 1.3 — Verify

```sql
-- Confirm hypertable
SELECT * FROM timescaledb_information.hypertables;

-- Confirm continuous aggregate
SELECT * FROM timescaledb_information.continuous_aggregates;

-- Confirm policies
SELECT * FROM timescaledb_information.jobs WHERE hypertable_name = 'machine_telemetry';
```

#### Phase 1 Checklist

- [ ] VM provisioned in same VPC/region as API
- [ ] PostgreSQL 16 + TimescaleDB + Toolkit installed
- [ ] `rooted_telemetry` database created
- [ ] `machine_telemetry` hypertable created with dedup index
- [ ] `machine_stats` continuous aggregate created with refresh policy
- [ ] Compression and retention policies active
- [ ] API server can connect to TimescaleDB VM (test with `psql` from API host)

---

### Phase 2: Add `machine_faults` Table to RDS + Second DB Client

**Goal:** Fault events stored in RDS. API has a working connection to both databases.

#### 2.1 — Create `machine_faults` Migration in RDS

New Prisma migration: `prisma/migrations/<timestamp>_add_machine_faults/migration.sql`

```sql
CREATE TABLE machine_faults (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  machine_id  UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
  fault_type  VARCHAR(50) NOT NULL,
  fault_value INT NOT NULL,
  event_code  VARCHAR(100),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_machine_faults_machine_id ON machine_faults(machine_id);
CREATE INDEX idx_machine_faults_created_at ON machine_faults(created_at);
```

Update `schema.prisma`:

```prisma
model machine_faults {
  id          String   @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  machine_id  String   @db.Uuid
  fault_type  String   @db.VarChar(50)
  fault_value Int
  event_code  String?  @db.VarChar(100)
  created_at  DateTime @default(now()) @db.Timestamptz(6)

  machines machines @relation(fields: [machine_id], references: [id], onDelete: Cascade)

  @@index([machine_id], map: "idx_machine_faults_machine_id")
  @@index([created_at], map: "idx_machine_faults_created_at")
}
```

Add the relation to the `machines` model:

```prisma
model machines {
  // ... existing fields ...
  machine_faults machine_faults[]
}
```

#### 2.2 — Create TimescaleDB Client

The TimescaleDB connection does not use Prisma — raw SQL via a `pg` Pool is simpler and lower-overhead for bulk inserts and aggregate queries.

Create `apps/api/src/lib/db/timescale.ts`:

```typescript
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.TIMESCALE_DATABASE_URL,
  max: 10,
  idleTimeoutMillis: 30000,
});

export const timescale = pool;
```

Add `TIMESCALE_DATABASE_URL` to `.env`:

```
TIMESCALE_DATABASE_URL=postgresql://rooted:password@timescale-vm-host:5432/rooted_telemetry
```

#### 2.3 — Test Both Connections

```typescript
// Quick sanity check on startup (add to server boot sequence)
import { timescale } from './lib/db/timescale.js';

const result = await timescale.query('SELECT 1 AS ok');
console.log('[TimescaleDB] Connection verified:', result.rows[0]);
```

#### Phase 2 Checklist

- [ ] `machine_faults` migration created and applied to RDS
- [ ] `machine_faults` model added to Prisma schema
- [ ] `pg` package added to `apps/api` dependencies
- [ ] `timescale.ts` client created
- [ ] `TIMESCALE_DATABASE_URL` env var set in all environments
- [ ] Both connections verified on API startup

---

### Phase 3: Rewrite `handleTelemetry.ts`

**Goal:** Replace the 350-line state machine with a ~60-line insert function. This is where the bugs die.

#### 3.1 — Serialize the Flush in `subscriber.ts`

The current fire-and-forget pattern allows concurrent flushes. Fix this first.

**Current code** (`subscriber.ts:24-34`):
```typescript
function flushAllTelemetry(): void {
  for (const [deviceId, batch] of telemetryBuffers) {
    if (batch.length > 0) {
      handleTelemetry(deviceId, batch).catch((err) => {  // fire-and-forget!
        console.error('[MQTT] Error handling telemetry:', err);
      });
    }
  }
  telemetryBuffers.clear();
}
```

**New code:**
```typescript
let flushing = false;

async function flushAllTelemetry(): Promise<void> {
  if (flushing) {
    console.warn('[MQTT] Previous flush still running, skipping this interval');
    return;
  }
  flushing = true;
  try {
    // Snapshot and clear buffer atomically
    const snapshot = new Map(telemetryBuffers);
    telemetryBuffers.clear();

    for (const [deviceId, batch] of snapshot) {
      if (batch.length > 0) {
        console.log(`[MQTT] Flushing ${batch.length} telemetry events for ${deviceId}`);
        try {
          await handleTelemetry(deviceId, batch);
        } catch (err) {
          console.error(`[MQTT] Error handling telemetry for ${deviceId}:`, err);
        }
      }
    }
  } finally {
    flushing = false;
  }
}
```

**Why:** Prevents concurrent flushes from creating overlapping transactions. The `flushing` guard ensures the next interval is skipped if the previous one is still processing (e.g., after a large backlog from reconnection).

#### 3.2 — Rewrite `handleTelemetry.ts`

The new version does three things:
1. Look up `machine_id` from RDS (same as today)
2. Insert raw telemetry into TimescaleDB with dedup
3. Route fault events to RDS `machine_faults` table

**New `handleTelemetry.ts`:**

```typescript
import { prisma } from '../../../../lib/db/index.js';
import { timescale } from '../../../../lib/db/timescale.js';

export interface TelemetryPayload {
  type?: string;
  session_id?: string;
  schema_ver?: number;
  boot_id?: number;
  seq?: number;
  uptime_ms?: number;
  uptime_s?: number;
  delta_steps?: number;
  torque_pct?: number;
  belt_fault?: number;
  blade_fault?: number;
  alert_bits?: number;
  kill_switch?: number;
  cmd_age_ms?: number;
  belt_motor_uptime_ms?: number;
  blade_motor_uptime_ms?: number;
  udp_fail_count?: number;
  event_code?: string;
  event_value?: number;
  trays_processed?: number;
  received_at?: number;  // Pi-side timestamp (Unix seconds from time.time())
}

export async function handleTelemetry(
  deviceId: string,
  payloads: TelemetryPayload[]
): Promise<void> {
  const valid = payloads.filter(
    (p) => p.type === 'status_update' || p.type === 'event'
  );

  if (valid.length === 0) return;

  // 1. Look up machine in RDS
  const machine = await prisma.machines.findFirst({
    where: { device_id: deviceId },
    select: { id: true },
  });

  if (!machine) {
    console.warn(
      `[MQTT] handleTelemetry: machine not found for device ID: ${deviceId}`
    );
    return;
  }

  const now = new Date();

  // 2. Insert raw telemetry into TimescaleDB (ON CONFLICT DO NOTHING for dedup)
  //    Uses the Pi-side timestamp for received_at (critical for dedup constraint)
  const insertQuery = `
    INSERT INTO machine_telemetry (
      machine_id, received_at, server_received_at, type, schema_ver,
      boot_id, seq, uptime_ms, delta_steps,
      belt_motor_uptime_ms, blade_motor_uptime_ms,
      torque_pct, belt_fault, blade_fault, alert_bits, kill_switch,
      cmd_age_ms, udp_fail_count, event_code, event_value,
      trays_processed, session_id
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11,
              $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22)
    ON CONFLICT DO NOTHING
  `;

  // Build parameterized rows and execute in a single transaction
  const tsClient = await timescale.connect();
  try {
    await tsClient.query('BEGIN');
    for (const p of valid) {
      // Convert Pi timestamp (Unix seconds float) to JS Date
      const piTimestamp = p.received_at
        ? new Date(p.received_at * 1000)
        : now;

      await tsClient.query(insertQuery, [
        machine.id,
        piTimestamp,
        now,
        p.type ?? null,
        p.schema_ver ?? null,
        p.boot_id ?? null,
        p.seq ?? null,
        p.uptime_ms ?? null,
        p.delta_steps ?? null,
        p.belt_motor_uptime_ms ?? null,
        p.blade_motor_uptime_ms ?? null,
        p.torque_pct ?? null,
        p.belt_fault ?? null,
        p.blade_fault ?? null,
        p.alert_bits ?? null,
        p.kill_switch ?? null,
        p.cmd_age_ms ?? null,
        p.udp_fail_count ?? null,
        p.event_code ?? null,
        p.event_value ?? null,
        p.trays_processed ?? null,
        p.session_id ?? null,
      ]);
    }
    await tsClient.query('COMMIT');
  } catch (err) {
    await tsClient.query('ROLLBACK');
    throw err;
  } finally {
    tsClient.release();
  }

  // 3. Update last_seen_at on RDS (lightweight, no aggregation)
  await prisma.machines.update({
    where: { id: machine.id },
    data: { last_seen_at: now },
  });

  // 4. Route fault events to RDS machine_faults table
  //    Detect fault onset: belt_fault or blade_fault transitioning to > 0
  //    For now, insert EVENT-type payloads with fault-related event codes
  const faultEvents = valid.filter(
    (p) =>
      p.type === 'event' &&
      p.event_code != null &&
      (p.event_code.includes('fault') || p.event_code.includes('FAULT'))
  );

  if (faultEvents.length > 0) {
    await prisma.machine_faults.createMany({
      data: faultEvents.map((p) => ({
        machine_id: machine.id,
        fault_type: p.event_code!.toLowerCase().includes('belt')
          ? 'belt'
          : 'blade',
        fault_value: p.event_value ?? 1,
        event_code: p.event_code ?? null,
      })),
    });
  }
}
```

**What's gone:**
- The entire `LockedMachineBase` / `LockedMachineWithTray` type system
- The `isMissingTrayColumnError` fallback
- The `warnedTrayColumnsMissing` module-level state
- The `SELECT ... FOR UPDATE` lock
- All boot_id / uptime / motor / tray state machine logic (lines 185-341)
- The `$transaction` with interactive Prisma client

**What's left:** ~60 lines. Insert raw data, update `last_seen_at`, route faults. The database does the math.

#### 3.3 — Handle `delta_steps` Accumulation

`delta_steps` is an incremental value (not a monotonic counter), so it works with `SUM()` in the continuous aggregate rather than `counter_agg`. The current `{ increment: totalDeltaSteps }` on the RDS `machines.total_steps` column is no longer needed — the continuous aggregate's `SUM(delta_steps)` gives the total.

No special handling needed in `handleTelemetry` — it's just another column in the INSERT.

#### Phase 3 Checklist

- [ ] `subscriber.ts` flush serialized with `flushing` guard
- [ ] `handleTelemetry.ts` rewritten (~60 lines)
- [ ] `timescale` client imported and used for inserts
- [ ] Fault events routed to `machine_faults` in RDS
- [ ] Old types (`LockedMachineBase`, etc.) removed
- [ ] Tests updated (see Phase 5)

---

### Phase 4: Rewrite `getMachinesByTenant.ts` (Dashboard Query)

**Goal:** Dashboard fetches machine identity from RDS, stats from TimescaleDB, and fault info from RDS.

#### 4.1 — Current Code

```typescript
// getMachinesByTenant.ts — current (single DB, join via Prisma include)
const machines = await prisma.machines.findMany({
  where,
  include: {
    machine_telemetry: {
      where: { type: 'event', event_code: { not: null } },
      orderBy: { received_at: 'desc' },
      take: 1,
      select: { event_code: true, event_value: true, received_at: true },
    },
  },
  ...options,
});
```

#### 4.2 — New Code

```typescript
import { timescale } from '../../../lib/db/timescale.js';

export async function getMachinesByTenant(
  prisma: PrismaClient,
  tenantId: string,
  farmId: string | null,
  options: GetMachinesByTenantOptions
): Promise<Machine[]> {
  const where: Prisma.machinesWhereInput = { tenant_id: tenantId };
  if (farmId) where.farm_id = farmId;

  // 1. Fetch machine identity + latest fault from RDS
  const machines = await prisma.machines.findMany({
    where,
    include: {
      machine_faults: {
        orderBy: { created_at: 'desc' },
        take: 1,
        select: {
          fault_type: true,
          fault_value: true,
          event_code: true,
          created_at: true,
        },
      },
    },
    ...options,
  });

  if (machines.length === 0) return [];

  // 2. Fetch aggregated stats from TimescaleDB
  const machineIds = machines.map((m) => m.id);

  const statsResult = await timescale.query(
    `SELECT
      machine_id,
      delta(rollup(uptime_agg))::BIGINT          AS total_uptime_ms,
      delta(rollup(belt_motor_agg))::BIGINT       AS belt_motor_uptime_ms,
      delta(rollup(blade_motor_agg))::BIGINT      AS blade_motor_uptime_ms,
      delta(rollup(tray_agg))::BIGINT             AS tray_count,
      SUM(boot_count)::INT                        AS reboot_count,
      COALESCE(SUM(total_steps), 0)::BIGINT       AS total_steps,
      MAX(max_uptime_ms)::BIGINT                  AS current_boot_uptime_ms
    FROM machine_stats
    WHERE machine_id = ANY($1::uuid[])
    GROUP BY machine_id`,
    [machineIds]
  );

  // Index stats by machine_id for O(1) lookup
  const statsMap = new Map<string, (typeof statsResult.rows)[0]>();
  for (const row of statsResult.rows) {
    statsMap.set(row.machine_id, row);
  }

  // 3. Fetch latest event from TimescaleDB
  const eventsResult = await timescale.query(
    `SELECT DISTINCT ON (machine_id)
      machine_id, event_code, event_value, received_at
    FROM machine_telemetry
    WHERE machine_id = ANY($1::uuid[])
      AND type = 'event'
      AND event_code IS NOT NULL
    ORDER BY machine_id, received_at DESC`,
    [machineIds]
  );

  const eventsMap = new Map<string, (typeof eventsResult.rows)[0]>();
  for (const row of eventsResult.rows) {
    eventsMap.set(row.machine_id, row);
  }

  // 4. Merge results
  return machines.map((m) => {
    const stats = statsMap.get(m.id);
    const latestEvent = eventsMap.get(m.id);
    const latestFault = m.machine_faults[0];

    return {
      id: m.id,
      tenantId: m.tenant_id,
      farmId: m.farm_id,
      name: m.name,
      displayName: m.display_name,
      deviceId: m.device_id,
      createdAt: m.created_at,
      awsIotThingName: m.aws_iot_thing_name,
      status: m.status as 'online' | 'offline' | undefined,
      lastSeenAt: m.last_seen_at,
      currentWifiSsid: m.current_wifi_ssid,
      totalSteps: stats?.total_steps?.toString() ?? '0',
      totalUptimeMs: stats?.total_uptime_ms?.toString() ?? '0',
      currentBootUptimeMs: stats?.current_boot_uptime_ms?.toString() ?? '0',
      rebootCount: stats?.reboot_count ?? 0,
      trayCount: stats?.tray_count != null ? Number(stats.tray_count) : 0,
      beltMotorUptimeMs: stats?.belt_motor_uptime_ms?.toString() ?? '0',
      bladeMotorUptimeMs: stats?.blade_motor_uptime_ms?.toString() ?? '0',
      // Fault counts from RDS
      beltFaultCount: latestFault ? undefined : 0,  // TODO: count query or cache
      bladeFaultCount: latestFault ? undefined : 0,
      lastBeltFault: latestFault?.fault_type === 'belt' ? latestFault.fault_value : 0,
      lastBladeFault: latestFault?.fault_type === 'blade' ? latestFault.fault_value : 0,
      // Latest event from TimescaleDB
      lastEventCode: latestEvent?.event_code ?? null,
      lastEventValue: latestEvent?.event_value ?? null,
      lastEventAt: latestEvent?.received_at ?? null,
    };
  });
}
```

**Performance note:** The `DISTINCT ON` query for latest events is efficient with the existing `(machine_id, received_at)` index. The `machine_stats` aggregate query is precomputed — it reads from the materialized view, not raw data.

#### 4.3 — Update Fault Counts

For belt/blade fault counts, add a simple count query or use Prisma's `_count`:

```typescript
// In getMachinesByTenant, after fetching machines:
const faultCounts = await prisma.machine_faults.groupBy({
  by: ['machine_id', 'fault_type'],
  where: { machine_id: { in: machineIds } },
  _count: true,
});

// Build a lookup: { machineId -> { belt: N, blade: N } }
const faultCountMap = new Map<string, { belt: number; blade: number }>();
for (const row of faultCounts) {
  const entry = faultCountMap.get(row.machine_id) ?? { belt: 0, blade: 0 };
  if (row.fault_type === 'belt') entry.belt = row._count;
  else if (row.fault_type === 'blade') entry.blade = row._count;
  faultCountMap.set(row.machine_id, entry);
}
```

#### Phase 4 Checklist

- [ ] `getMachinesByTenant.ts` rewritten with dual-DB queries
- [ ] Stats fetched from TimescaleDB `machine_stats` continuous aggregate
- [ ] Latest event fetched from TimescaleDB `machine_telemetry`
- [ ] Fault counts fetched from RDS `machine_faults`
- [ ] `Machine` type interface unchanged (frontend doesn't need to change)
- [ ] Dashboard verified: all stats display correctly

---

### Phase 5: Clean Up RDS `machines` Table + Update Types

**Goal:** Remove the 15 aggregate columns from `machines` that are now served by TimescaleDB and `machine_faults`.

#### 5.1 — RDS Migration: Drop Aggregate Columns

New Prisma migration: `prisma/migrations/<timestamp>_remove_telemetry_aggregates/migration.sql`

```sql
ALTER TABLE machines
  DROP COLUMN IF EXISTS total_steps,
  DROP COLUMN IF EXISTS total_uptime_ms,
  DROP COLUMN IF EXISTS current_boot_id,
  DROP COLUMN IF EXISTS current_boot_uptime_ms,
  DROP COLUMN IF EXISTS reboot_count,
  DROP COLUMN IF EXISTS belt_fault_count,
  DROP COLUMN IF EXISTS blade_fault_count,
  DROP COLUMN IF EXISTS tray_count,
  DROP COLUMN IF EXISTS last_raw_tray_count,
  DROP COLUMN IF EXISTS last_belt_fault,
  DROP COLUMN IF EXISTS last_blade_fault,
  DROP COLUMN IF EXISTS current_belt_motor_uptime_ms,
  DROP COLUMN IF EXISTS total_belt_motor_uptime_ms,
  DROP COLUMN IF EXISTS current_blade_motor_uptime_ms,
  DROP COLUMN IF EXISTS total_blade_motor_uptime_ms,
  DROP COLUMN IF EXISTS last_raw_belt_motor_uptime_ms,
  DROP COLUMN IF EXISTS last_raw_blade_motor_uptime_ms,
  DROP COLUMN IF EXISTS last_motor_boot_id;
```

#### 5.2 — Update Prisma Schema

Remove all 15+ aggregate columns from the `machines` model. Remove the `machine_telemetry` relation (telemetry is no longer in RDS). Add the `machine_faults` relation.

The `machines` model becomes clean:

```prisma
model machines {
  id                      String    @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  tenant_id               String?   @db.Uuid
  farm_id                 String?   @db.Uuid
  name                    String    @db.VarChar(255)
  display_name            String?   @db.VarChar(255)
  device_id               String    @db.VarChar(255)
  created_at              DateTime? @default(now()) @db.Timestamp(6)
  aws_iot_thing_name      String?   @unique @db.VarChar(255)
  status                  String?   @default("offline") @db.VarChar(50)
  last_seen_at            DateTime? @db.Timestamp(6)
  current_wifi_ssid       String?   @db.VarChar(255)

  farms                   farms?    @relation(fields: [farm_id], references: [id], onDelete: Cascade, onUpdate: NoAction)
  tenants                 tenants?  @relation(fields: [tenant_id], references: [id], onDelete: Cascade, onUpdate: NoAction)
  machine_faults          machine_faults[]

  @@index([device_id], map: "idx_machines_device_id")
  @@index([farm_id], map: "idx_machines_farm_id")
  @@index([tenant_id], map: "idx_machines_tenant_id")
}
```

#### 5.3 — Remove `machine_telemetry` Model from Prisma

The `machine_telemetry` table no longer lives in RDS. Remove the model from `schema.prisma` entirely. All telemetry access goes through the `timescale` pg client.

#### 5.4 — Update `createOrUpdateMachine.ts`

Remove all aggregate fields from the return value mapping (lines 50-58 of current file). These values now come from `getMachinesByTenant` which queries TimescaleDB.

#### 5.5 — Update Shared Types

The `Machine` interface in `shared/types/machines.ts` and `apps/api/src/domains/machine-domain/types.ts` stays the same — the fields are still there, they're just populated from different sources now. No frontend changes needed.

#### 5.6 — Update `mockPrisma.ts`

Remove `machine_telemetry` mock factories and add `machine_faults` mock factories.

#### Phase 5 Checklist

- [ ] Migration dropping 15+ columns from `machines` created and applied
- [ ] `machine_telemetry` model removed from Prisma schema
- [ ] `machine_faults` model added to Prisma schema
- [ ] `machines` model cleaned up (identity + config + status only)
- [ ] `createOrUpdateMachine.ts` updated
- [ ] `mockPrisma.ts` updated
- [ ] `Machine` interface unchanged (frontend unaffected)
- [ ] All TypeScript compiles with no errors

---

### Phase 6: Update Tests

**Goal:** All tests pass against the new architecture.

#### 6.1 — `handleTelemetry.test.ts`

Rewrite tests to mock:
- `prisma.machines.findFirst` (RDS lookup — same as before)
- `timescale.connect()` / `tsClient.query()` (TimescaleDB inserts)
- `prisma.machines.update` (RDS `last_seen_at` update)
- `prisma.machine_faults.createMany` (fault routing)

Test cases:
- Status update inserts into TimescaleDB, updates `last_seen_at` on RDS
- Event with fault code inserts into TimescaleDB AND creates `machine_faults` row in RDS
- Unknown type filtered out (no insert)
- Machine not found (no insert, warning logged)
- Duplicate payloads (TimescaleDB `ON CONFLICT DO NOTHING` — mock verifies INSERT sent, dedup is DB-level)

#### 6.2 — `getMachinesByTenant.test.ts`

Rewrite tests to mock:
- `prisma.machines.findMany` with `machine_faults` include
- `timescale.query` for `machine_stats` aggregate
- `timescale.query` for latest event
- `prisma.machine_faults.groupBy` for fault counts

#### 6.3 — `createOrUpdateMachine.test.ts`

Simplify — no more aggregate fields in return value mapping.

#### Phase 6 Checklist

- [ ] `handleTelemetry.test.ts` rewritten for new dual-DB architecture
- [ ] `getMachinesByTenant.test.ts` rewritten for dual-DB queries
- [ ] `createOrUpdateMachine.test.ts` updated
- [ ] All tests pass: `cd apps/api && pnpm test`

---

## Data Migration Strategy

### Existing telemetry in RDS

The current `machine_telemetry` table in RDS has historical data. Options:

1. **Migrate to TimescaleDB** — Export from RDS, import into TimescaleDB hypertable. One-time `pg_dump` / `COPY` operation. This preserves historical continuity for `counter_agg` aggregates.

2. **Start fresh** — The continuous aggregate starts accumulating from the first insert. Historical totals are lost. Acceptable if the current data is known to be inflated/incorrect (which it is, due to the bugs).

**Recommendation:** Start fresh. The current aggregate values are unreliable due to the inflation bugs. Document the cutover date and accept that all-time totals begin from that point.

### Existing aggregate values on `machines`

The `total_uptime_ms`, `tray_count`, etc. values on the `machines` row are known to be inflated. Do not attempt to preserve or migrate them. The new TimescaleDB aggregates will build correct values from scratch.

---

## Rollback Plan

| Phase | How to Roll Back |
|-------|-----------------|
| Phase 1 (TimescaleDB VM) | VM is standalone — shut it down. No impact on existing system. |
| Phase 2 (machine_faults + client) | Drop `machine_faults` table. Remove `timescale.ts`. No other impact. |
| Phase 3 (handleTelemetry rewrite) | Revert `handleTelemetry.ts` and `subscriber.ts` to current versions. Telemetry goes back to RDS. |
| Phase 4 (getMachinesByTenant) | Revert to current version (reads from RDS `machines` columns + `machine_telemetry` include). |
| Phase 5 (column cleanup) | **Not easily reversible** — only run this phase after Phases 3-4 are verified in production. If needed, re-add columns with a migration and backfill from TimescaleDB. |

**Critical:** Phases 1-4 are fully reversible and can be deployed independently. Phase 5 (dropping columns) is the point of no return — only execute after the new architecture is verified.

---

## Monitoring

After deployment, verify:

| Check | How |
|-------|-----|
| TimescaleDB is receiving data | `SELECT COUNT(*) FROM machine_telemetry WHERE received_at > NOW() - INTERVAL '5 minutes';` |
| Continuous aggregate is refreshing | `SELECT * FROM timescaledb_information.job_stats WHERE job_id = (SELECT job_id FROM timescaledb_information.jobs WHERE hypertable_name = 'machine_stats');` |
| Dedup is working | `SELECT COUNT(*) FROM machine_telemetry WHERE received_at > NOW() - INTERVAL '1 hour';` — should match expected rate (~3600 per machine per hour) |
| Compression is running | `SELECT * FROM timescaledb_information.compressed_chunk_stats;` |
| Dashboard values are sane | Compare `total_uptime_ms` from `machine_stats` aggregate with expected value based on machine runtime |
| Faults recording in RDS | `SELECT * FROM machine_faults ORDER BY created_at DESC LIMIT 10;` |
| No inflation over time | Leave running for 1 hour with steady telemetry, check that totals increase linearly |

---

## Files Changed Summary

| File | Action | Phase |
|------|--------|-------|
| `apps/api/src/lib/db/timescale.ts` | **Create** — pg Pool for TimescaleDB | 2 |
| `apps/api/prisma/schema.prisma` | **Edit** — add `machine_faults`, remove `machine_telemetry`, clean `machines` | 2, 5 |
| `apps/api/prisma/migrations/` | **Create** — add `machine_faults` table; drop aggregate columns | 2, 5 |
| `apps/api/src/domains/machine-domain/mqtt/machine-telemetry/handleTelemetry.ts` | **Rewrite** — 350 lines -> ~60 lines | 3 |
| `apps/api/src/domains/machine-domain/mqtt/subscriber.ts` | **Edit** — serialize flush | 3 |
| `apps/api/src/domains/machine-domain/queries/getMachinesByTenant.ts` | **Rewrite** — dual-DB queries | 4 |
| `apps/api/src/domains/machine-domain/commands/createOrUpdateMachine.ts` | **Edit** — remove aggregate return fields | 5 |
| `apps/api/src/domains/machine-domain/types.ts` | **No change** — `Machine` interface stays the same | - |
| `shared/types/machines.ts` | **No change** — frontend types stay the same | - |
| `src/machines/dashboard/components/MachineCard.tsx` | **No change** — reads same `Machine` shape | - |
| `apps/api/src/test/mockPrisma.ts` | **Edit** — swap `machine_telemetry` mocks for `machine_faults` | 6 |
| All test files in `__tests__/` | **Rewrite** | 6 |

---

## Local Development Setup

### Current Local Setup

The current local dev environment uses Docker Compose (`docker/docker-compose.yml`) with:

- `postgres:16-alpine` on port **5433** (maps to 5432 inside container)
- `redis:7-alpine` on port **6379**
- `rooted-api` container built from `apps/api/Dockerfile`
- `docker/init.sql` seeds the schema on first boot

The API reads `DATABASE_URL` from `.env` — currently pointing at the local Postgres container.

### Adding TimescaleDB to Docker Compose

Add a second Postgres container running the TimescaleDB image. This mirrors the production split architecture locally.

**Edit `docker/docker-compose.yml`:**

```yaml
services:
  postgres:
    # ... existing RDS-equivalent config (unchanged) ...

  timescaledb:
    image: timescale/timescaledb:latest-pg16
    container_name: rooted-timescale
    environment:
      POSTGRES_USER: rooted
      POSTGRES_PASSWORD: rooted_dev_password
      POSTGRES_DB: rooted_telemetry
    ports:
      - "5434:5432"
    volumes:
      - timescale_data:/var/lib/postgresql/data
      - ./init-timescale.sql:/docker-entrypoint-initdb.d/init-timescale.sql:ro
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U rooted -d rooted_telemetry"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    # ... existing config (unchanged) ...

  rooted-api:
    # ... existing config ...
    environment:
      NODE_ENV: development
      PORT: 8000
      DATABASE_URL: postgresql://rooted:rooted_dev_password@postgres:5432/rooted_planner
      TIMESCALE_DATABASE_URL: postgresql://rooted:rooted_dev_password@timescaledb:5432/rooted_telemetry
      REDIS_URL: redis://redis:6379
      AWS_REGION: us-west-2
    depends_on:
      postgres:
        condition: service_healthy
      timescaledb:
        condition: service_healthy
      redis:
        condition: service_healthy

volumes:
  postgres_data:
  timescale_data:
  redis_data:
```

**Key details:**
- TimescaleDB runs on port **5434** on the host (5432 inside container) — avoids collision with RDS Postgres on 5433
- Uses the official `timescale/timescaledb:latest-pg16` image, which includes both the TimescaleDB extension and the Toolkit
- Separate named volume `timescale_data` for persistence
- The API container gets `TIMESCALE_DATABASE_URL` pointing at the TimescaleDB container

### Create `docker/init-timescale.sql`

This initializes the TimescaleDB schema on first container boot (mirrors what we'll run in production).

```sql
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS timescaledb_toolkit;

-- Create telemetry hypertable
CREATE TABLE machine_telemetry (
  machine_id              UUID NOT NULL,
  received_at             TIMESTAMPTZ NOT NULL,
  server_received_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  type                    VARCHAR(50),
  schema_ver              INT,
  boot_id                 BIGINT,
  seq                     INT,
  uptime_ms               BIGINT,
  delta_steps             INT,
  belt_motor_uptime_ms    BIGINT,
  blade_motor_uptime_ms   BIGINT,
  torque_pct              SMALLINT,
  belt_fault              SMALLINT,
  blade_fault             SMALLINT,
  alert_bits              INT,
  kill_switch             SMALLINT,
  cmd_age_ms              INT,
  udp_fail_count          INT,
  event_code              VARCHAR(100),
  event_value             INT,
  trays_processed         INT,
  session_id              VARCHAR(36)
);

SELECT create_hypertable('machine_telemetry', 'received_at',
  chunk_time_interval => INTERVAL '7 days'
);

-- Dedup index (time column required by TimescaleDB for unique constraints)
CREATE UNIQUE INDEX machine_telemetry_dedup_idx
  ON machine_telemetry (machine_id, boot_id, seq, received_at)
  WHERE boot_id IS NOT NULL AND seq IS NOT NULL;

-- Continuous aggregate for dashboard stats
CREATE MATERIALIZED VIEW machine_stats
WITH (timescaledb.continuous) AS
SELECT
  machine_id,
  time_bucket('1 hour', received_at) AS bucket,
  counter_agg(received_at, uptime_ms)              AS uptime_agg,
  counter_agg(received_at, belt_motor_uptime_ms)   AS belt_motor_agg,
  counter_agg(received_at, blade_motor_uptime_ms)  AS blade_motor_agg,
  counter_agg(received_at, trays_processed)        AS tray_agg,
  COUNT(DISTINCT boot_id)                          AS boot_count,
  SUM(delta_steps)                                 AS total_steps,
  AVG(torque_pct)                                  AS avg_torque_pct,
  MAX(uptime_ms)                                   AS max_uptime_ms
FROM machine_telemetry
WHERE type = 'status_update'
  AND received_at < NOW()
GROUP BY machine_id, time_bucket('1 hour', received_at);

SELECT add_continuous_aggregate_policy(
  'machine_stats',
  start_offset    => INTERVAL '1 hour',
  end_offset      => INTERVAL '5 minutes',
  schedule_interval => INTERVAL '5 minutes'
);

-- Compression (optional in dev, but good to mirror prod)
ALTER TABLE machine_telemetry SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'machine_id',
  timescaledb.compress_orderby   = 'received_at DESC'
);
SELECT add_compression_policy('machine_telemetry', INTERVAL '7 days');
```

### Update `.env.example`

```bash
# Database — RDS equivalent (business data)
DATABASE_URL="postgresql://rooted:rooted_dev_password@localhost:5433/rooted_planner"

# TimescaleDB — telemetry data
TIMESCALE_DATABASE_URL="postgresql://rooted:rooted_dev_password@localhost:5434/rooted_telemetry"
```

### Update `docker/init.sql`

Remove the `machine_telemetry` table definition and its indexes from `init.sql` — telemetry no longer lives in the RDS-equivalent Postgres. Add the `machine_faults` table instead.

Remove from `init.sql`:
```sql
-- REMOVE THIS ENTIRE BLOCK:
CREATE TABLE "machine_telemetry" ( ... );
CREATE INDEX "idx_machine_telemetry_machine_id" ...
CREATE INDEX "idx_machine_telemetry_session_id" ...
CREATE INDEX "idx_machine_telemetry_received_at" ...
```

Add to `init.sql`:
```sql
-- ============================================
-- Machine Faults (discrete fault events)
-- ============================================

CREATE TABLE "machine_faults" (
  "id"          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "machine_id"  UUID NOT NULL REFERENCES "machines"("id") ON DELETE CASCADE,
  "fault_type"  VARCHAR(50) NOT NULL,
  "fault_value" INT NOT NULL,
  "event_code"  VARCHAR(100),
  "created_at"  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX "idx_machine_faults_machine_id" ON "machine_faults"("machine_id");
CREATE INDEX "idx_machine_faults_created_at" ON "machine_faults"("created_at");
```

### Local Dev Workflow

```bash
# Start everything (first time — creates volumes, runs init scripts)
cd docker && docker compose up -d

# Verify both databases
psql -h localhost -p 5433 -U rooted -d rooted_planner -c "SELECT COUNT(*) FROM machines;"
psql -h localhost -p 5434 -U rooted -d rooted_telemetry -c "SELECT * FROM timescaledb_information.hypertables;"

# Reset TimescaleDB (if schema changes during development)
docker compose down timescaledb
docker volume rm docker_timescale_data
docker compose up -d timescaledb

# Run API locally (outside Docker, reading from .env)
cd apps/api && pnpm dev
```

### Test Environment

Tests use mocked database clients (vitest + `mockPrisma.ts`), so they don't need a running TimescaleDB instance. The `timescale` pg Pool will be mocked in tests:

```typescript
// apps/api/src/test/mockTimescale.ts
import { vi } from 'vitest';

const mockClient = {
  query: vi.fn().mockResolvedValue({ rows: [] }),
  release: vi.fn(),
};

const mockPool = {
  connect: vi.fn().mockResolvedValue(mockClient),
  query: vi.fn().mockResolvedValue({ rows: [] }),
  end: vi.fn(),
};

vi.mock('../../lib/db/timescale.js', () => ({
  timescale: mockPool,
}));

export { mockPool as mockTimescale, mockClient as mockTimescaleClient };
```

CI tests (`test-api` job) don't need a TimescaleDB service container — all DB calls are mocked. This keeps CI fast and avoids needing the TimescaleDB Docker image in GitHub Actions.

---

## Terraform: Provisioning the TimescaleDB EC2 Instance

### Current Infrastructure

| Resource | Terraform File | Details |
|----------|---------------|---------|
| VPC | `vpc.tf` | Default VPC, default subnets |
| EC2 (API server) | `ec2.tf` | `t3.small`, Ubuntu 22.04, Node.js + Nginx + PM2 |
| RDS | `rds.tf` | `db.t3.micro`, Postgres 15, 20GB gp3, private (EC2 SG only) |
| Security Groups | `security.tf` | `ec2` SG (SSH/HTTP/HTTPS) + `rds` SG (5432 from EC2 only) |
| IoT Core | `iot.tf` | Device policies, thing types |

TimescaleDB will be a second EC2 instance running Postgres 16 + TimescaleDB, in the same VPC, accessible only from the API EC2 instance.

### New File: `infra/terraform/timescaledb.tf`

```hcl
# -------------------------------------------------------------------
# TimescaleDB EC2 Instance
# -------------------------------------------------------------------

resource "aws_instance" "timescaledb" {
  ami           = data.aws_ami.ubuntu.id   # Same Ubuntu 22.04 AMI as API server
  instance_type = "t3.small"

  vpc_security_group_ids = [aws_security_group.timescaledb.id]
  key_name               = var.ec2_key_name
  subnet_id              = data.aws_subnets.default.ids[0]

  root_block_device {
    volume_size = 50          # More storage for telemetry data
    volume_type = "gp3"
    encrypted   = true
    iops        = 3000        # gp3 baseline
    throughput  = 125         # gp3 baseline (MB/s)
  }

  user_data = <<-EOF
              #!/bin/bash
              set -e

              # Update system
              apt-get update
              apt-get upgrade -y

              # Add TimescaleDB APT repository
              apt-get install -y gnupg postgresql-common apt-transport-https lsb-release wget
              echo "yes" | /usr/share/postgresql-common/pgdg/apt.postgresql.org.sh
              echo "deb https://packagecloud.io/timescale/timescaledb/ubuntu/ $(lsb_release -c -s) main" \
                > /etc/apt/sources.list.d/timescaledb.list
              wget --quiet -O - https://packagecloud.io/timescale/timescaledb/gpgkey | gpg --dearmor -o /etc/apt/trusted.gpg.d/timescaledb.gpg
              apt-get update

              # Install PostgreSQL 16 + TimescaleDB + Toolkit
              apt-get install -y timescaledb-2-postgresql-16 timescaledb-toolkit-postgresql-16

              # Configure TimescaleDB
              timescaledb-tune --yes --quiet

              # Configure pg_hba.conf to allow connections from VPC CIDR
              PG_HBA="/etc/postgresql/16/main/pg_hba.conf"
              echo "host    rooted_telemetry    rooted    ${data.aws_vpc.default.cidr_block}    scram-sha-256" >> $PG_HBA

              # Listen on all interfaces (within VPC, firewalled by SG)
              PG_CONF="/etc/postgresql/16/main/postgresql.conf"
              sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/" $PG_CONF

              # Restart PostgreSQL
              systemctl restart postgresql

              # Create database and user
              sudo -u postgres psql -c "CREATE USER rooted WITH PASSWORD '${var.timescale_db_password}';"
              sudo -u postgres psql -c "CREATE DATABASE rooted_telemetry OWNER rooted;"
              sudo -u postgres psql -d rooted_telemetry -c "CREATE EXTENSION IF NOT EXISTS timescaledb;"
              sudo -u postgres psql -d rooted_telemetry -c "CREATE EXTENSION IF NOT EXISTS timescaledb_toolkit;"

              echo "TimescaleDB provisioning complete."
              EOF

  tags = {
    Name        = "${var.project_name}-${var.environment}-timescaledb"
    Environment = var.environment
    Project     = var.project_name
  }
}

# -------------------------------------------------------------------
# Security Group: Only accessible from the API EC2 instance
# -------------------------------------------------------------------

resource "aws_security_group" "timescaledb" {
  name        = "${var.project_name}-${var.environment}-timescaledb-sg"
  description = "Security group for TimescaleDB instance"
  vpc_id      = data.aws_vpc.default.id

  # PostgreSQL access from API EC2 only
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ec2.id]
    description     = "PostgreSQL access from API EC2"
  }

  # SSH access (for initial setup and maintenance)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "SSH access"
  }

  # Outbound traffic (for apt-get, updates)
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound"
  }

  tags = {
    Name        = "${var.project_name}-${var.environment}-timescaledb-sg"
    Environment = var.environment
    Project     = var.project_name
  }
}
```

### Update `infra/terraform/variables.tf`

Add the TimescaleDB password variable:

```hcl
variable "timescale_db_password" {
  description = "The password for the TimescaleDB rooted user."
  type        = string
  sensitive   = true
}
```

### Update `infra/terraform/outputs.tf`

Add outputs for the new instance:

```hcl
output "timescaledb_private_ip" {
  description = "TimescaleDB instance private IP (use this in TIMESCALE_DATABASE_URL)"
  value       = aws_instance.timescaledb.private_ip
}

output "timescaledb_instance_id" {
  description = "TimescaleDB EC2 instance ID"
  value       = aws_instance.timescaledb.id
}
```

### Schema Initialization After Terraform Apply

The `user_data` script installs TimescaleDB and creates the database + user. But the hypertable, continuous aggregate, and policies need to be applied separately (they're too complex for user_data, and you want to version-control them).

After `terraform apply`:

```bash
# Get the private IP from Terraform output
TSDB_IP=$(terraform output -raw timescaledb_private_ip)

# SSH tunnel through the API EC2 to reach TimescaleDB (it's not publicly accessible)
ssh -i ~/.ssh/deploy_key -L 5434:$TSDB_IP:5432 ubuntu@<ec2-public-ip>

# In another terminal, apply the schema
psql -h localhost -p 5434 -U rooted -d rooted_telemetry -f docker/init-timescale.sql
```

Alternatively, create a one-time setup script on the API EC2:

```bash
# On the API EC2 instance
psql -h <timescaledb-private-ip> -U rooted -d rooted_telemetry -f /var/www/rooted/apps/api/scripts/init-timescale.sql
```

### Why Not RDS for TimescaleDB?

AWS RDS does not support the TimescaleDB extension. The alternatives are:
- **EC2 self-managed** (what we're doing) — full control, lowest cost for our scale
- **Timescale Cloud** — managed service, higher cost, less operational burden
- **Amazon Timestream** — different query language, not Postgres-compatible

At our current scale (1-5 machines), a `t3.small` EC2 is more than sufficient and costs ~$15/month.

---

## CI/CD Pipeline Changes

### Current Pipeline

**CI (`ci.yml`):**
1. `lint-and-typecheck` — ESLint + `tsc` on frontend and API
2. `security` — `pnpm audit`
3. `test-api` — `pnpm test:run` (vitest, mocked DB)
4. `build-verification` — `pnpm build` for frontend and API

**Deploy (`deploy.yml`):**
1. Build frontend + API locally in GitHub Actions
2. `rsync` built artifacts to EC2
3. SSH into EC2: `pnpm install --prod`, `prisma generate`, `prisma migrate deploy`, `pm2 reload`

### Changes to CI (`ci.yml`)

**No TimescaleDB service container needed in CI.** Tests mock all DB calls. The only changes are:

#### Update `test-api` job

Add `TIMESCALE_DATABASE_URL` dummy env var so the `timescale.ts` module can import without crashing (the Pool constructor reads the connection string at import time, but tests mock it before any queries run):

```yaml
  test-api:
    name: Test API
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Generate Prisma Client
        env:
          DATABASE_URL: "postgresql://dummy:dummy@localhost:5432/dummy"
        run: cd apps/api && pnpm exec prisma generate

      - name: Run API Tests
        env:
          TIMESCALE_DATABASE_URL: "postgresql://dummy:dummy@localhost:5432/dummy"
        run: cd apps/api && pnpm test:run
```

#### Update `lint-and-typecheck` and `build-verification` jobs

Same change — add `TIMESCALE_DATABASE_URL` env var wherever `DATABASE_URL` is set, so `timescale.ts` can be imported during type-checking and builds:

```yaml
      - name: Type-check API
        env:
          DATABASE_URL: "postgresql://dummy:dummy@localhost:5432/dummy"
          TIMESCALE_DATABASE_URL: "postgresql://dummy:dummy@localhost:5432/dummy"
        run: cd apps/api && pnpm exec tsc
```

### Changes to Deploy (`deploy.yml`)

The deploy workflow needs two additions:

1. **Add `TIMESCALE_DATABASE_URL` to the EC2 environment** (in `.env.production` on the EC2)
2. **Run TimescaleDB schema migrations** (one-time, not on every deploy — unlike Prisma migrations)

#### Update `deploy.yml` — Finalize deployment step

```yaml
      - name: Finalize deployment on EC2
        run: |
          ssh -i ~/.ssh/deploy_key ${{ env.EC2_USER }}@${{ secrets.EC2_HOST }} << 'ENDSSH'
          set -e
          cd /var/www/rooted/apps/api

          # Install dependencies
          pnpm install --prod

          # Install Prisma CLI
          pnpm add -D prisma@6

          # Generate Prisma Client for Linux
          pnpm exec prisma generate

          # Copy Prisma client to dist
          mkdir -p dist/generated
          cp -r src/generated/prisma dist/generated/

          # Run RDS migrations (business data)
          pnpm exec prisma migrate deploy

          # Reload API (sources existing .env.production)
          set -a; source .env.production; set +a
          pm2 reload rooted-api

          # Health check
          sleep 5
          curl -sf http://localhost:8000/health || (pm2 logs rooted-api --lines 20 && exit 1)

          echo "Deployment complete!"
          ENDSSH
```

**What changed:** Nothing structurally — the key difference is that `.env.production` on the EC2 now contains `TIMESCALE_DATABASE_URL` pointing at the TimescaleDB private IP. This is a one-time manual step during the Phase 1 rollout, not managed by the deploy workflow.

#### Add `TIMESCALE_DATABASE_URL` to EC2 `.env.production`

This is a one-time manual step after Terraform provisioning:

```bash
# SSH into the API EC2
ssh -i ~/.ssh/deploy_key ubuntu@<ec2-public-ip>

# Get the TimescaleDB private IP from Terraform output
TSDB_IP="<terraform output timescaledb_private_ip>"

# Add to .env.production
echo "TIMESCALE_DATABASE_URL=postgresql://rooted:<password>@${TSDB_IP}:5432/rooted_telemetry" \
  >> /var/www/rooted/apps/api/.env.production
```

#### TimescaleDB Schema Migrations

Unlike Prisma, TimescaleDB schema changes (new continuous aggregates, policy changes) are raw SQL files. These don't need to run on every deploy — only when the telemetry schema changes.

**Strategy:** Keep a `scripts/timescale-migrations/` directory with numbered SQL files:

```
apps/api/scripts/timescale-migrations/
  001_initial_schema.sql      # Hypertable, dedup index, continuous aggregate, policies
  002_add_compression.sql     # Compression policy (if not in 001)
  ...
```

Run manually via SSH when needed:

```bash
# From API EC2
psql -h <timescale-private-ip> -U rooted -d rooted_telemetry \
  -f /var/www/rooted/apps/api/scripts/timescale-migrations/001_initial_schema.sql
```

**Future improvement:** Add a `timescale-migrate` step to the deploy workflow that tracks applied migrations in a `schema_migrations` table on TimescaleDB. But at our current scale (infrequent schema changes), manual application is fine.

### GitHub Secrets to Add

| Secret | Value | Used By |
|--------|-------|---------|
| `TIMESCALE_DB_PASSWORD` | Password for the `rooted` user on TimescaleDB | Terraform (`timescale_db_password` variable) |

The `TIMESCALE_DATABASE_URL` is NOT a GitHub secret — it lives in `.env.production` on the EC2 instance, which is not committed to the repo.

---

## Environment Variable Summary

| Variable | Local Dev | CI | Production |
|----------|-----------|----|----|
| `DATABASE_URL` | `localhost:5433` (Docker Postgres) | `dummy://...` (mocked) | RDS endpoint (in `.env.production`) |
| `TIMESCALE_DATABASE_URL` | `localhost:5434` (Docker TimescaleDB) | `dummy://...` (mocked) | TimescaleDB private IP (in `.env.production`) |

### Graceful Degradation

The `timescale.ts` client should handle the case where `TIMESCALE_DATABASE_URL` is not set (e.g., during the transition period before Phase 3 is deployed):

```typescript
// apps/api/src/lib/db/timescale.ts
import pg from 'pg';

const connectionString = process.env.TIMESCALE_DATABASE_URL;

if (!connectionString) {
  console.warn('[TimescaleDB] TIMESCALE_DATABASE_URL not set — telemetry writes will fail');
}

export const timescale = new pg.Pool({
  connectionString: connectionString || 'postgresql://localhost:5432/dummy',
  max: 10,
  idleTimeoutMillis: 30000,
});
```
