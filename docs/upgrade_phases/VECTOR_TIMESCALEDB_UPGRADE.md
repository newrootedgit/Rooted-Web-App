# Telemetry Infrastructure Upgrade — Vector + TimescaleDB

## Overview

This document covers the two-tool upgrade to the telemetry pipeline:

- **TimescaleDB** — a PostgreSQL extension that adds hypertable partitioning, continuous
  aggregates, and retention policies to the existing `machine_telemetry` table.
- **Vector** — a Rust-based edge pipeline agent that replaces the manual
  file-reading and MQTT-publishing logic in `telemetry.py`.

Both tools are additive. TimescaleDB extends the existing Postgres instance. Vector
runs as a new systemd service alongside the existing Pi Python stack. No changes
to AWS IoT Core configuration, Prisma schema relations, or the tRPC API layer.

---

## Current State (Before Upgrade)

### Pi — `pi-src/aws/telemetry.py`

`fetch_unsynced_jsonl()` reads the **entire** JSONL file into RAM on every drain cycle:

```python
# telemetry.py:59–60  — reads the full file, not just unsynced lines
with open(LOG_JSONL_PATH, "r") as f:
    content = f.read()           # ← whole file in memory every 5 minutes
lines = content.splitlines()
batch = lines[cursor: cursor + BATCH_SIZE]
```

`publish_batch()` publishes **one record per MQTT message**, blocking on each PUBACK:

```python
# telemetry.py:84–92  — 50 messages per drain cycle
for record in records:
    payload = json.dumps(record)
    pub_future, _ = mqtt_connection.publish(
        topic=topic, payload=payload, qos=QoS.AT_LEAST_ONCE
    )
    pub_future.result()  # blocks until each puback individually
```

Cursor is advanced after publish but the JSONL file is **never truncated**. After one
year of operation the file is ~1.2 GB; the Pi loads it all into RAM every 5 minutes.

### API — `apps/api/src/domains/machine-domain/mqtt/machine-telemetry/handleTelemetry.ts`

Each MQTT message triggers a single-record transaction:

```ts
// handleTelemetry.ts:94–122 — one create + one update per message
await prisma.$transaction([
    prisma.machine_telemetry.create({ data: { ... } }),
    prisma.machines.update({ where: { id: machine.id }, data: { last_seen_at: now, ...aggregateData } }),
]);
```

The aggregate computation is a **read-compute-write** pattern:

```ts
// handleTelemetry.ts:58–59 — reads current value from machine row, adds delta in app code
aggregateData.total_steps = machine.total_steps + BigInt(payload.delta_steps);
```

If two messages for the same device arrive concurrently (possible during a post-reconnect
flood), both read the same `machine.total_steps`, both add their delta, and one write
wins — the other is silently lost.

There is **no deduplication** — a duplicate QoS-1 delivery inserts a second row and
double-increments every aggregate counter.

### Schema — `apps/api/prisma/schema.prisma`

`machine_telemetry` has no unique constraint and no time partitioning:

```prisma
model machine_telemetry {
  id          String   @id @default(dbgenerated("uuid_generate_v4()")) @db.Uuid
  machine_id  String   @db.Uuid
  received_at DateTime @db.Timestamp(6)
  boot_id     BigInt?
  seq         Int?
  // ... no @@unique([machine_id, boot_id, seq])
  // ... no TimescaleDB hypertable declaration
}
```

AWS payload values such as `trays_processed` are currently not persisted in
`machine_telemetry`.

Rows accumulate indefinitely. At 10 devices: ~39M rows / year (~19 GB) with no
retention or compression.

### Already Fixed — `apps/api/src/lib/aws/config-store.ts`

Issue 5 from `TELEMETRY_IMPROVEMENTS.md` (in-memory preset store with no TTL) **is
already resolved**. `config-store.ts` has a 100-second TTL and a 60-second cleanup
interval with `unref()` for graceful shutdown. No action needed here.

---

## Goals After Upgrade

| # | Problem | Solution |
|---|---|---|
| 1 | Full-file read into RAM every 5 min | Vector file source tails from checkpoint |
| 2 | No deduplication on ingest | Partial unique index + `createMany skipDuplicates` |
| 3 | 50 individual MQTT messages per drain | Vector batches 50 records into one message |
| 4 | Read-compute-write aggregate race | Atomic `{ increment }` + row lock for stateful logic |
| 5 | ~~No TTL on preset store~~ | Already fixed in `config-store.ts` |
| 6 | No data retention policy | TimescaleDB `add_retention_policy` |
| 7 | Single MQTT connection drops all processing | Vector disk buffer survives disconnects |
| 8 | `trays_processed` from AWS is not stored | Add nullable `trays_processed` column and map it during ingest |

---

## Phase 1 — TimescaleDB Backend Foundation

**Files changed:** Prisma migration only. No TypeScript changes.

### 1.1 — Enable the extension

If you are on Supabase or RDS with TimescaleDB available, run this once:

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb;
```

On self-managed Postgres, swap the Docker image:

```yaml
# docker-compose.yml (or equivalent)
image: timescale/timescaledb:latest-pg16   # was: postgres:16
```

### 1.2 — Convert `machine_telemetry` to a hypertable

Create a new Prisma migration file (`prisma/migrations/<timestamp>_timescaledb/migration.sql`)
and write raw SQL (Prisma does not know about TimescaleDB functions):

```sql
-- Convert to hypertable, partitioned by received_at in 7-day chunks.
-- if_not_exists prevents errors on re-run.
SELECT create_hypertable(
  'machine_telemetry',
  'received_at',
  chunk_time_interval => INTERVAL '7 days',
  if_not_exists => TRUE
);
```

After this, `machine_telemetry` looks identical to the rest of the codebase — it is
still queryable as one table. TimescaleDB manages the chunk files transparently.

### 1.2.1 — Add `trays_processed` column for AWS telemetry

This keeps the schema aligned with the AWS payload and is safe for older rows/events
that do not include the field.

```sql
ALTER TABLE machine_telemetry
  ADD COLUMN IF NOT EXISTS trays_processed INTEGER;
```

### 1.3 — Add the deduplication index

This is a **partial** unique index: only rows where both `boot_id` and `seq` are
non-null are constrained. Event-type rows (`boot_id IS NULL`) are excluded, matching
the current schema where events omit these fields.

```sql
CREATE UNIQUE INDEX IF NOT EXISTS machine_telemetry_dedup_idx
  ON machine_telemetry (machine_id, boot_id, seq)
  WHERE boot_id IS NOT NULL AND seq IS NOT NULL;
```

### 1.4 — Enable compression

Compresses chunks older than 7 days. Reduces storage ~90% for cold data. Segmenting
by `machine_id` keeps per-device queries fast even on compressed chunks.

```sql
ALTER TABLE machine_telemetry SET (
  timescaledb.compress,
  timescaledb.compress_segmentby = 'machine_id',
  timescaledb.compress_orderby   = 'received_at DESC'
);

SELECT add_compression_policy('machine_telemetry', INTERVAL '7 days');
```

### 1.5 — Add retention policy

Drops raw chunks older than 90 days. Dropping a chunk is `O(1)` (a file delete),
not a slow `DELETE` that locks the table and generates WAL.

```sql
SELECT add_retention_policy('machine_telemetry', INTERVAL '90 days');
```

### 1.6 — Create the daily summary continuous aggregate

This replaces the manual aggregate columns on the `machines` row for historical
reporting. TimescaleDB refreshes it incrementally in the background — no application
code involved, no concurrent-write race possible.

```sql
CREATE MATERIALIZED VIEW machine_telemetry_daily
WITH (timescaledb.continuous) AS
SELECT
  machine_id,
  time_bucket('1 day', received_at)            AS day,
  SUM(delta_steps)                             AS total_steps,
  COALESCE(SUM(trays_processed), 0)            AS total_trays_processed,
  AVG(torque_pct)                              AS avg_torque_pct,
  COUNT(*) FILTER (WHERE belt_fault  > 0)      AS belt_fault_count,
  COUNT(*) FILTER (WHERE blade_fault > 0)      AS blade_fault_count,
  COUNT(DISTINCT boot_id)                      AS boot_count,
  MAX(uptime_ms)                               AS max_uptime_ms
FROM machine_telemetry
WHERE received_at < NOW()   -- required by TimescaleDB for continuous aggregates
GROUP BY machine_id, time_bucket('1 day', received_at);

-- Refresh every hour, covering data from 2 hours ago to now.
SELECT add_continuous_aggregate_policy(
  'machine_telemetry_daily',
  start_offset => INTERVAL '2 hours',
  end_offset   => INTERVAL '1 hour',
  schedule_interval => INTERVAL '1 hour'
);
```

> **Real-time note:** The continuous aggregate lags by ~1 hour. For the current
> machine status dashboard (live `total_steps`, last fault), continue reading directly
> from the `machines` row. The aggregate view is for historical charts and reporting.

### Phase 1 Checklist

- [ ] TimescaleDB extension enabled on Postgres instance
- [ ] Migration file created and applied (`prisma migrate deploy`)
- [ ] Hypertable confirmed: `SELECT * FROM timescaledb_information.hypertables;`
- [ ] Column confirmed: `\d machine_telemetry` includes `trays_processed`
- [ ] Dedup index confirmed: `\d machine_telemetry_dedup_idx`
- [ ] Retention policy confirmed: `SELECT * FROM timescaledb_information.jobs;`
- [ ] Continuous aggregate refreshing: `SELECT * FROM machine_telemetry_daily LIMIT 5;`

---

## Phase 2 — API: Batched Ingest + Aggregate Race Fix

**Files changed:** `handleTelemetry.ts`, `subscriber.ts`

This phase prepares the API to receive the batch payloads that Vector will send in
Phase 3. The current single-record path stays working in parallel during the transition.

### 2.1 — Update `handleTelemetry.ts` to accept an array

The current signature:
```ts
// handleTelemetry.ts:35 — current
export async function handleTelemetry(deviceId: string, payload: TelemetryPayload): Promise<void>
```

New signature — accepts an array. Single records are wrapped automatically in
`subscriber.ts` to keep both paths working during rollout.

```ts
export async function handleTelemetry(deviceId: string, payloads: TelemetryPayload[]): Promise<void>
```

### 2.2 — Replace `create` with `createMany` + `skipDuplicates`

The unique partial index from Phase 1.3 makes this safe. Duplicate QoS-1 redeliveries
that collide on `(machine_id, boot_id, seq)` are silently skipped at the DB level.

```ts
// handleTelemetry.ts — replace prisma.machine_telemetry.create with:
const rows = payloads.map(payload => ({
    machine_id:     machine.id,
    session_id:     payload.session_id     ?? null,
    received_at:    now,
    type:           payload.type           ?? null,
    schema_ver:     payload.schema_ver     ?? null,
    boot_id:        payload.boot_id        != null ? BigInt(payload.boot_id)   : null,
    seq:            payload.seq            ?? null,
    uptime_ms:      payload.uptime_ms      != null ? BigInt(payload.uptime_ms) : null,
    uptime_s:       payload.uptime_s       ?? null,
    delta_steps:    payload.delta_steps    ?? null,
    trays_processed: payload.trays_processed ?? null,
    torque_pct:     payload.torque_pct     ?? null,
    belt_fault:     payload.belt_fault     ?? null,
    blade_fault:    payload.blade_fault    ?? null,
    alert_bits:     payload.alert_bits     ?? null,
    kill_switch:    payload.kill_switch    ?? null,
    cmd_age_ms:     payload.cmd_age_ms     ?? null,
    udp_fail_count: payload.udp_fail_count ?? null,
    event_code:     payload.event_code     ?? null,
    event_value:    payload.event_value    ?? null,
}));

await prisma.machine_telemetry.createMany({ data: rows, skipDuplicates: true });
```

### 2.3 — Fix the aggregate update race condition

The current code (`handleTelemetry.ts:58–91`) reads `machine.total_steps` then adds
the delta in application code — this is the race condition.

**Simple counters** (`total_steps`, `last_seen_at`) use Prisma atomic operations.
No read required; the DB increments the column atomically:

```ts
// Simple counters — atomic, no race possible
const totalDeltaSteps = payloads.reduce((sum, p) => sum + (p.delta_steps ?? 0), 0);

await prisma.machines.update({
    where: { id: machine.id },
    data: {
        last_seen_at: now,
        total_steps: { increment: totalDeltaSteps },
    },
});
```

**Stateful logic** (boot detection, fault edge detection) requires reading the
current row before deciding what to write. Use `SELECT ... FOR UPDATE` inside an
interactive transaction to lock the row for the duration of the computation:

```ts
// Stateful counters — lock the row, compute, write once
await prisma.$transaction(async (tx) => {
    // Lock the machines row for this device — no concurrent update can race
    const [current] = await tx.$queryRaw<{ current_boot_id: bigint | null; current_boot_uptime_ms: bigint; reboot_count: number; last_belt_fault: number; last_blade_fault: number; total_uptime_ms: bigint }[]>`
        SELECT current_boot_id, current_boot_uptime_ms, reboot_count,
               last_belt_fault, last_blade_fault, total_uptime_ms
        FROM machines WHERE id = ${machine.id} FOR UPDATE
    `;

    const update: MachineAggregateUpdate = {};
    let workingBootId = current.current_boot_id;
    let workingUptimeMs = current.current_boot_uptime_ms;
    let workingRebootCount = current.reboot_count;
    let workingTotalUptimeMs = current.total_uptime_ms;
    let workingLastBelt = current.last_belt_fault;
    let workingLastBlade = current.last_blade_fault;
    let beltFaultDelta = 0;
    let bladeFaultDelta = 0;

    // Process records in order — boot changes and fault edges are sequential state
    for (const p of payloads.filter(p => p.type === 'status_update')) {
        if (p.boot_id != null && p.uptime_ms != null) {
            const newBootId = BigInt(p.boot_id);
            const newUptimeMs = BigInt(p.uptime_ms);
            if (workingBootId === null || newBootId !== workingBootId) {
                workingTotalUptimeMs = workingTotalUptimeMs + workingUptimeMs;
                workingRebootCount += workingBootId !== null ? 1 : 0;
                workingBootId = newBootId;
                workingUptimeMs = newUptimeMs;
            } else if (newUptimeMs > workingUptimeMs) {
                workingUptimeMs = newUptimeMs;
            }
        }
        if (p.belt_fault != null) {
            if (p.belt_fault > 0 && workingLastBelt === 0) beltFaultDelta++;
            workingLastBelt = p.belt_fault;
        }
        if (p.blade_fault != null) {
            if (p.blade_fault > 0 && workingLastBlade === 0) bladeFaultDelta++;
            workingLastBlade = p.blade_fault;
        }
    }

    await tx.machines.update({
        where: { id: machine.id },
        data: {
            current_boot_id:        workingBootId,
            current_boot_uptime_ms: workingUptimeMs,
            reboot_count:           workingRebootCount,
            total_uptime_ms:        workingTotalUptimeMs,
            last_belt_fault:        workingLastBelt,
            last_blade_fault:       workingLastBlade,
            ...(beltFaultDelta  > 0 && { belt_fault_count:  { increment: beltFaultDelta  } }),
            ...(bladeFaultDelta > 0 && { blade_fault_count: { increment: bladeFaultDelta } }),
        },
    });
});
```

> **Why two separate updates?** `total_steps` can use an atomic `increment` without
> reading the row, so it doesn't need the lock. Boot detection and fault edges require
> stateful reads and must be inside the `FOR UPDATE` transaction. Keeping them separate
> avoids holding the lock any longer than necessary.

### 2.4 — Update `subscriber.ts` to handle both single and array payloads

During the Vector rollout, some messages will still be single records (from the old
`telemetry.py`). The subscriber normalises both:

```ts
// subscriber.ts:101–119 — update the telemetry handler
await connection.subscribe(TELEMETRY_TOPIC, mqtt.QoS.AtLeastOnce, (topic, payload) => {
    try {
        const raw = JSON.parse(new TextDecoder().decode(payload));
        const deviceId = topic.split('/')[2];
        if (!deviceId) {
            console.warn('[MQTT] Could not extract deviceId from telemetry topic:', topic);
            return;
        }

        // Normalise: Vector sends an array, legacy telemetry.py sends a single object
        const records: TelemetryPayload[] = Array.isArray(raw) ? raw : [raw];

        handleTelemetry(deviceId, records).catch((err) => {
            console.error('[MQTT] Error handling telemetry:', err);
        });
    } catch (err) {
        console.error('[MQTT] Error processing telemetry message:', err);
    }
});
```

### Phase 2 Checklist

- [ ] `handleTelemetry.ts` updated to accept `TelemetryPayload[]`
- [ ] `createMany` with `skipDuplicates` replaces `create`
- [ ] `trays_processed` is mapped from AWS payload into `machine_telemetry`
- [ ] Atomic `{ increment }` used for `total_steps`
- [ ] `SELECT ... FOR UPDATE` transaction handles boot + fault state
- [ ] `subscriber.ts` normalises single-object and array payloads
- [ ] Existing `handleTelemetry` unit tests updated for array input
- [ ] Manual test: send duplicate batch — confirm single DB row, no double-counted steps

---

## Phase 3 — Edge: Replace `telemetry.py` with Vector

**Files changed:** New systemd service + Vector config. `telemetry.py` publish logic
removed or replaced with a no-op stub.

### Architecture after Phase 3

```
Firmware
  │
  └─ appends to /home/rooted/telemetry_log.jsonl
                    │
                    ▼
           Vector (systemd service)
           ├── source: tail JSONL from last checkpoint
           ├── transform: add device_id field, drop mid-write lines
           ├── buffer: disk-backed on NVMe (bounded, crash-safe)
           └── sink: MQTT to AWS IoT Core
                 topic: rooted/machines/<device_id>/telemetry
                 payload: JSON array of up to 50 records
                 batch flush: every 30 seconds OR 50 events
                    │
                    ▼
           AWS IoT Core  →  subscriber.ts  →  handleTelemetry (array)
```

Vector uses its **own** MQTT connection and certs. The Python stack keeps its MQTT
connection for commands and preset responses — the two are independent.

### 3.1 — Install Vector on the Pi

```bash
# ARM64 (Pi 4/5)
curl -1sLf 'https://repositories.timber.io/public/vector/cfg/setup/bash.deb.sh' | bash
apt-get install vector

# Pin the version to avoid silent upgrades
apt-mark hold vector
```

### 3.2 — Vector configuration

Create `/etc/vector/rooted-telemetry.toml`:

```toml
# /etc/vector/rooted-telemetry.toml

[sources.telemetry_log]
type       = "file"
include    = ["/home/rooted/telemetry_log.jsonl"]
read_from  = "checkpoint"           # resumes from last confirmed position after restart
# Vector's checkpoint file lives in its data_dir (default: /var/lib/vector)

[transforms.parse_json]
type   = "remap"
inputs = ["telemetry_log"]
source = '''
  # Each line from the JSONL file is a raw string — parse it to a structured event
  . = parse_json!(.message)

  # Attach device_id so we can template the MQTT topic
  .device_id = get_env_var!("ROOTED_DEVICE_ID")
'''

[transforms.drop_incomplete]
type   = "filter"
inputs = ["parse_json"]
# Drop records with no type — these are mid-write partial lines that survived parsing
condition = 'exists(.type)'

[sinks.aws_iot_telemetry]
type    = "mqtt"
inputs  = ["drop_incomplete"]
host    = "${AWS_IOT_ENDPOINT}"
port    = 8883
topic   = "rooted/machines/{{ device_id }}/telemetry"
quality_of_service = 1   # AT_LEAST_ONCE

# TLS with device certificate — same certs currently used by telemetry.py
tls.enabled  = true
tls.ca_file  = "/home/rooted/certs/AmazonRootCA1.pem"
tls.crt_file = "/home/rooted/certs/device.cert.pem"
tls.key_file = "/home/rooted/certs/private.key"

# Encoding: batch up to 50 events into a single JSON array message
encoding.codec = "json"
[sinks.aws_iot_telemetry.batch]
max_events   = 50
timeout_secs = 30   # flush even if under 50 records after 30s

# Disk-backed buffer — survives Pi restarts and AWS IoT outages
# max_size = 268_435_456 = 256 MB on NVMe (non-issue; NVMe has 128+ GB free)
[sinks.aws_iot_telemetry.buffer]
type     = "disk"
max_size = 268_435_456
when_full = "block"   # backpressure to source; never drop records
```

Create `/etc/vector/vector.toml` (global config):

```toml
[data_dir]
path = "/var/lib/vector"   # checkpoint and disk buffer live here (NVMe)
```

### 3.3 — Environment variables for Vector

Create `/etc/vector/env`:

```bash
ROOTED_DEVICE_ID=<device_id_from_device_config>
AWS_IOT_ENDPOINT=<your-iot-endpoint>.iot.<region>.amazonaws.com
```

Read `device_id` from the same source as `get_device_config()`:

```bash
# One-time setup on the Pi
DEVICE_ID=$(python3 -c "from pi_src.aws.aws_iot_registration import get_device_config; print(get_device_config()['device_id'])")
echo "ROOTED_DEVICE_ID=$DEVICE_ID" >> /etc/vector/env
```

### 3.4 — systemd service

Create `/etc/systemd/system/rooted-vector.service`:

```ini
[Unit]
Description=Rooted telemetry uplink (Vector)
After=network-online.target
Wants=network-online.target

[Service]
Type=simple
User=root
EnvironmentFile=/etc/vector/env
ExecStart=/usr/bin/vector --config /etc/vector/rooted-telemetry.toml
Restart=on-failure
RestartSec=5s

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable rooted-vector
systemctl start rooted-vector
systemctl status rooted-vector
```

### 3.5 — Retire the publish logic in `telemetry.py`

Once Vector is confirmed working, `publish_batch()` and `_run_loop()` in `telemetry.py`
can be removed. The file source, cursor, and JSONL path are now owned by Vector.
Keep the module importable to avoid breaking `start_telemetry_thread()` callsites
until they are updated:

```python
# telemetry.py — replace _run_loop and publish_batch with a no-op after Vector is stable
def start_telemetry_thread(mqtt_connection, topic: str) -> threading.Event:
    """No-op: telemetry uplink is now handled by the Vector systemd service."""
    stop_event = threading.Event()
    print("[telemetry] Uplink delegated to Vector service. Thread is a no-op.")
    return stop_event
```

### Phase 3 Checklist

- [ ] Vector installed and pinned on Pi
- [ ] `/etc/vector/rooted-telemetry.toml` created with correct cert paths
- [ ] `/etc/vector/env` populated with `ROOTED_DEVICE_ID` and `AWS_IOT_ENDPOINT`
- [ ] `rooted-vector.service` enabled and running
- [ ] Confirm batched messages arriving in AWS IoT: check CloudWatch or IoT rule logs
- [ ] Confirm `subscriber.ts` logs show array-type payloads
- [ ] Confirm DB rows inserted correctly, no duplicates
- [ ] Simulate disconnect: pull network, reconnect, confirm buffered records replay
- [ ] `telemetry.py` publish logic stubbed out
- [ ] Old `telemetry_cursor.json` can be removed (Vector manages its own checkpoint)

---

## Rollback Plan

| Phase | How to roll back |
|---|---|
| Phase 1 (TimescaleDB) | Drop the hypertable policies: `SELECT remove_retention_policy('machine_telemetry')`. The table continues to work as plain Postgres. Dedup index can stay (harmless). |
| Phase 2 (API) | Revert `handleTelemetry.ts` and `subscriber.ts` to single-record path. No schema change needed. |
| Phase 3 (Vector) | `systemctl stop rooted-vector && systemctl disable rooted-vector`. Un-stub `telemetry.py` to restore the old publish loop. The JSONL file is untouched by Vector (read-only source). |

---

## What This Does NOT Change

- AWS IoT Core topic structure (`rooted/machines/+/telemetry`)
- Device certificate management or provisioning
- The `machines` aggregate columns — they stay as the real-time source of truth for
  dashboards; the TimescaleDB continuous aggregate is for historical reporting only
- Any tRPC routes or frontend code
- The preset/command MQTT flow (`pong`, lifecycle events)
- `config-store.ts` — already has TTL; no changes needed
