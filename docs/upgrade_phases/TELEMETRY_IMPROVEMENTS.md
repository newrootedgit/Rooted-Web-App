# Telemetry System — Improvements & Known Issues

## How the System Works

### Pi Side (`pi-src/aws/telemetry.py`)
Every 5 minutes, `telemetry.py` reads up to **50 records** from a local append-only JSONL log
(`/home/rooted/telemetry_log.jsonl`) and publishes each one individually to AWS IoT Core
over MQTT at `QoS.AT_LEAST_ONCE`.

The Pi tracks its sync position with a cursor file (`telemetry_cursor.json`). After a batch
is confirmed (PUBACK received for all records), the cursor advances. On restart, it resumes
from the last confirmed position.

### API Side (`apps/api/src/domains/machine-domain/mqtt/`)
`subscriber.ts` maintains a single MQTT WebSocket connection to AWS IoT and listens on:

| Topic | Handler |
|---|---|
| `rooted/machines/+/telemetry` | `handleTelemetry.ts` |
| `$aws/events/presence/connected/+` | `handleLifecycleEvent.ts` |
| `$aws/events/presence/disconnected/+` | `handleLifecycleEvent.ts` |
| `rooted/machines/+/pong` | `handleConfigResponse.ts` |

For each telemetry message, `handleTelemetry.ts` runs a single Prisma transaction:
1. `INSERT` a new row into `machine_telemetry` (full raw record)
2. `UPDATE` aggregate columns on the `machines` row (`total_steps`, fault counts, uptime, etc.)

---

## Data Volume Baseline

> Assumes: 1 record/second from firmware, 3 hours/day of machine operation.

| Metric | Value |
|---|---|
| Records generated per day | 10,800 (3 hrs × 3,600) |
| MQTT publishes per day | ~216 drain cycles × up to 50 records |
| DB rows inserted per device/day | ~10,800 |
| Storage per row (`machine_telemetry`) | ~400–500 bytes |
| **DB storage per device/year** | **~1.9 GB** |
| Pi JSONL file growth per day | ~3.2 MB (10,800 × 300 bytes) |
| Pi JSONL file growth per year | ~1.2 GB (NVMe: non-issue) |

At **10 devices**: ~19 GB/year in the database with no retention policy.

---

## Issues & Tasks

---

### Issue 1 — Pi JSONL Log Is Never Cleaned Up `[HIGH]`

**File:** `pi-src/aws/telemetry.py:50–75`

**Problem:**
`fetch_unsynced_jsonl()` reads the **entire file into memory** on every drain cycle, then
seeks to the cursor position in Python:

```python
with open(LOG_JSONL_PATH, "r") as f:
    content = f.read()           # reads ENTIRE file
lines = content.splitlines()
batch = lines[cursor:cursor + BATCH_SIZE]  # skips to cursor
```

Synced lines are never removed. After a year the file is ~1.2 GB, meaning the Pi loads
1.2 GB into RAM every 5 minutes just to grab 50 lines. Pi 5 has 8 GB RAM so it won't
crash, but this is significant waste that compounds over time.

**Storage on Pi NVMe is not the concern** — at 3.2 MB/day a 128 GB NVMe lasts 100+ years.
The concern is **memory pressure and unnecessary I/O** on each drain cycle.

**Fix:**
After a successful batch publish, rewrite the JSONL file keeping only unsynced lines,
then reset the cursor to 0. This keeps the file perpetually small — it only ever contains
records not yet confirmed to AWS.

```python
# In telemetry.py, after write_cursor(cursor + synced_count):
remaining_lines = all_lines[cursor + synced_count:]
with open(LOG_JSONL_PATH, "w") as f:
    if remaining_lines:
        f.write("\n".join(remaining_lines) + "\n")
write_cursor(0)  # reset since file was rewritten from position 0
```

**Cleanup interval:** Continuous — truncate on every successful drain. No cron job needed.

---

### Issue 2 — No Deduplication on Ingest `[HIGH]`

**File:** `apps/api/src/domains/machine-domain/mqtt/machine-telemetry/handleTelemetry.ts`

**Problem:**
MQTT `QoS.AT_LEAST_ONCE` guarantees delivery but **not exactly-once**. If a PUBACK is
delayed (e.g. reconnect mid-publish), the Pi re-publishes the same record. The API has
no deduplication — it blindly inserts every message:

```ts
await prisma.machine_telemetry.create({ data: { ... } })
```

Result: duplicate rows in `machine_telemetry`, and double-counted aggregates
(`total_steps`, `belt_fault_count`, etc.) on the `machines` row.

**Fix:**
Add a unique constraint on `(machine_id, boot_id, seq)` in a new migration, then use
`upsert` or `createMany` with `skipDuplicates`:

```ts
// Migration
@@unique([machine_id, boot_id, seq])

// handleTelemetry.ts
await prisma.machine_telemetry.createMany({
  data: records,
  skipDuplicates: true,   // ON CONFLICT DO NOTHING
})
```

> Note: `boot_id` and `seq` can be null for event-type messages.
> The unique constraint should be a partial index covering only rows where both are non-null.

---

### Issue 3 — No DB Batching (50 Transactions Per Drain Cycle) `[HIGH]`

**File:** `apps/api/src/domains/machine-domain/mqtt/machine-telemetry/handleTelemetry.ts`

**Problem:**
The Pi publishes **one record per MQTT message**, even though it drains 50 at a time.
On the API side, each message triggers its own Prisma transaction:

```
Drain cycle (50 records) →
  50 MQTT messages →
    50 × (INSERT machine_telemetry + UPDATE machines) →
      100 DB round trips per drain cycle
```

At 10 devices all draining simultaneously, that's 1,000 DB writes in a short burst
every 5 minutes.

**Fix:**
Change the Pi to publish a single MQTT message containing an array of records, and
change the API to process the whole batch in one transaction:

```python
# telemetry.py — publish batch as array instead of individual records
payload = json.dumps(records)  # list of dicts
mqtt_connection.publish(topic=topic, payload=payload, qos=QoS.AT_LEAST_ONCE)
```

```ts
// handleTelemetry.ts — receive array, one createMany + one aggregate update
const records: TelemetryPayload[] = JSON.parse(message.toString())

await prisma.$transaction([
  prisma.machine_telemetry.createMany({ data: records.map(toDbRow), skipDuplicates: true }),
  prisma.machines.update({ where: { id: machine.id }, data: computeAggregates(records) }),
])
```

This reduces DB round trips from **100 → 2** per drain cycle.

---

### Issue 4 — Aggregate Update Has Race Condition `[MEDIUM]`

**File:** `apps/api/src/domains/machine-domain/mqtt/machine-telemetry/handleTelemetry.ts`

**Problem:**
The aggregate update follows a read-compute-write pattern:
1. Read current `machines` row (e.g. `total_steps = 5000`)
2. Compute new value in application code (`5000 + delta_steps`)
3. Write it back

If two telemetry messages for the same device are processed concurrently (possible
at scale or with multiple API instances), both reads see `total_steps = 5000` and
both write `5000 + N`, losing one update.

**Fix:**
Use Prisma atomic operations for simple counters. For complex logic (fault onset
detection, boot_id change detection), use `SELECT ... FOR UPDATE` within the transaction:

```ts
// Simple counters — use atomic increment
prisma.machines.update({
  where: { id: machine.id },
  data: {
    total_steps: { increment: payload.delta_steps ?? 0 },
    reboot_count: { increment: bootChanged ? 1 : 0 },
  }
})

// Complex logic — lock the row first
await prisma.$transaction(async (tx) => {
  const machine = await tx.$queryRaw`
    SELECT * FROM machines WHERE id = ${machineId} FOR UPDATE
  `
  // compute and write aggregates safely
})
```

---

### Issue 5 — In-Memory Preset Store Has No TTL `[MEDIUM]`

**File:** `apps/api/src/domains/machine-domain/mqtt/machine-presets/handleConfigResponse.ts`

**Problem:**
Preset query responses are stored in-memory keyed by `requestId` with no expiry:

```ts
configStore.set(requestId, { action, config, success, error })
```

Every `get_presets` or `update_presets` call adds an entry that is never cleaned up.
Over time this is a slow memory leak — not critical today, but compounds with usage.

**Fix:**
Add a TTL of 5 minutes with a cleanup interval:

```ts
const TTL_MS = 5 * 60 * 1000

function set(requestId: string, value: ConfigResponse) {
  configStore.set(requestId, { ...value, expiresAt: Date.now() + TTL_MS })
}

// Sweep expired entries every minute
setInterval(() => {
  const now = Date.now()
  for (const [key, val] of configStore.entries()) {
    if (val.expiresAt < now) configStore.delete(key)
  }
}, 60_000)
```

---

### Issue 6 — No Data Retention Policy `[HIGH]`

**Table:** `machine_telemetry`

**Problem:**
The `machine_telemetry` table grows indefinitely. With no TTL or archival:

| Devices | Rows/Year | Storage/Year |
|---|---|---|
| 1 | ~3.9M | ~1.9 GB |
| 10 | ~39M | ~19 GB |
| 50 | ~197M | ~95 GB |

PostgreSQL query performance degrades as the table grows, even with indexes, because
index scans must traverse more pages. Autovacuum on this high-write table also competes
with the rest of the database.

**Fix (two-step):**

**Step 1 — Add a scheduled deletion job** (implement now):
```ts
// Run nightly via cron or pg_cron
DELETE FROM machine_telemetry
WHERE received_at < NOW() - INTERVAL '90 days'
```

**Step 2 — Roll up before deleting** (before hitting 50+ devices):
Before deleting raw rows, aggregate them into a summary table:
```sql
INSERT INTO machine_telemetry_daily_summary
  (machine_id, date, total_steps, avg_torque_pct, belt_fault_count, blade_fault_count)
SELECT
  machine_id,
  DATE(received_at),
  SUM(delta_steps),
  AVG(torque_pct),
  COUNT(*) FILTER (WHERE belt_fault = 1),
  COUNT(*) FILTER (WHERE blade_fault = 1)
FROM machine_telemetry
WHERE received_at < NOW() - INTERVAL '90 days'
GROUP BY machine_id, DATE(received_at)
ON CONFLICT (machine_id, date) DO NOTHING;

DELETE FROM machine_telemetry WHERE received_at < NOW() - INTERVAL '90 days';
```

---

### Issue 7 — Single MQTT Subscriber Connection `[LOW]`

**File:** `apps/api/src/domains/machine-domain/mqtt/subscriber.ts`

**Problem:**
All topics (telemetry, lifecycle, pong) share a single MQTT WebSocket connection.
If it drops, all event processing halts until reconnect. AWS IoT queues messages
for `cleanSession: false` clients, so a reconnect causes a flood of queued messages
hitting the DB simultaneously.

**Fix:**
At current scale this is acceptable. Add a monitoring alert if the subscriber
connection is down for more than 2 minutes (CloudWatch metric on MQTT disconnect
events, or a heartbeat check from the API process).

Separate connections per topic type is a future option if throughput requires it.

---

## Priority Summary

| Priority | Issue | Effort | File(s) |
|---|---|---|---|
| **High** | Add deduplication (`skipDuplicates` + unique constraint) | Low | `handleTelemetry.ts`, migration |
| **High** | Add data retention / nightly deletion job | Medium | New job + optional summary table |
| **High** | Batch 50 records into one MQTT message + one DB transaction | Medium | `telemetry.py`, `handleTelemetry.ts` |
| **High** | Truncate JSONL log after each drain (Pi memory/IO fix) | Low | `telemetry.py` |
| **Medium** | Fix preset response memory leak (add TTL) | Low | `handleConfigResponse.ts` |
| **Medium** | Use atomic increments for aggregate counters | Low | `handleTelemetry.ts` |
| **Low** | Multi-connection MQTT resilience + monitoring alert | High | `subscriber.ts` |
