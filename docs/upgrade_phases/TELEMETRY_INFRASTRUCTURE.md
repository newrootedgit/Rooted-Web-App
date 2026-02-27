# Telemetry Infrastructure Upgrade

**Status:** Complete
**Priority:** High
**Target:** Capture full Pi telemetry payloads (`status_update` + `event`) in the DB and ensure no messages are lost when the API is offline

---

## Problem Statement

The original telemetry pipeline stored only 3 fields (`session_id`, `uptime_s`, `delta_steps`) while silently dropping everything else the Pi publishes. Additionally, the API's MQTT subscriber used a dynamic client ID and `clean_session: true`, meaning any messages published while the API was offline were permanently lost.

**Before:**
```
Pi → IoT Core → subscriber.ts → handleTelemetry → DB (3 fields saved, rest dropped)
                 clean_session=true, random client ID → messages lost when API offline
```

**After:**
```
Pi → IoT Core → subscriber.ts → handleTelemetry → DB (all fields saved by type)
                 clean_session=false, fixed client ID → IoT buffers messages when API offline
```

---

## Pi Payload Schemas

The Pi publishes to `rooted/machines/{device_id}/telemetry` in two schemas:

### `status_update`
```json
{
  "type":           "status_update",
  "schema_ver":     2,
  "boot_id":        1234567890,
  "seq":            42,
  "uptime_ms":      300000,
  "delta_steps":    50,
  "torque_pct":     40,
  "belt_fault":     0,
  "blade_fault":    0,
  "alert_bits":     0,
  "kill_switch":    0,
  "cmd_age_ms":     5,
  "udp_fail_count": 0
}
```

### `event`
```json
{
  "type":        "event",
  "schema_ver":  2,
  "boot_id":     1234567890,
  "seq":         43,
  "uptime_ms":   310000,
  "event_code":  "blade_fault_cleared",
  "event_value": 0
}
```

`heartbeat_legacy` is not supported — unknown types are logged and dropped without a DB insert.

---

## Changes Made

### 1. `apps/api/prisma/schema.prisma`

Updated `machine_telemetry` model. `session_id`, `uptime_s`, and `delta_steps` made nullable (legacy row compat). 14 new nullable columns added.

| Column | Type | Notes |
|--------|------|-------|
| `type` | `VARCHAR(50)?` | `status_update` or `event` |
| `schema_ver` | `INTEGER?` | Pi payload version |
| `boot_id` | `BIGINT?` | Pi boot identifier |
| `seq` | `INTEGER?` | Per-boot sequence counter |
| `uptime_ms` | `BIGINT?` | Milliseconds since boot |
| `torque_pct` | `SMALLINT?` | Motor torque % |
| `belt_fault` | `SMALLINT?` | Belt fault flag |
| `blade_fault` | `SMALLINT?` | Blade fault flag |
| `alert_bits` | `INTEGER?` | Bitmask of active alerts |
| `kill_switch` | `SMALLINT?` | Kill switch state |
| `cmd_age_ms` | `INTEGER?` | Age of last command received |
| `udp_fail_count` | `INTEGER?` | UDP failure counter |
| `event_code` | `VARCHAR(100)?` | Event type string (`event` rows only) |
| `event_value` | `INTEGER?` | Event payload value (`event` rows only) |

### 2. `apps/api/prisma/migrations/20260227000000_extend_machine_telemetry/migration.sql`

New migration — drops NOT NULL on `session_id`, `uptime_s`, `delta_steps` and adds the 14 new columns. Applied to the live Docker DB.

### 3. `docker/init.sql`

Updated `CREATE TABLE machine_telemetry` to match the full schema for fresh container rebuilds.

### 4. `apps/api/src/domains/machine-domain/mqtt/machine-telemetry/handleTelemetry.ts`

Rewritten to:
- Accept all fields as optional except `type`
- Route `status_update` and `event` to a full DB insert (via `$transaction` with `last_seen_at` update)
- Log and return early for any unknown `type` — no DB insert
- Convert `boot_id` and `uptime_ms` to `BigInt` for PostgreSQL `BIGINT` columns

### 5. `apps/api/src/domains/machine-domain/mqtt/subscriber.ts`

Switched to a persistent MQTT session so AWS IoT queues messages for the API when it is offline and delivers them on reconnect:

```diff
- .with_client_id(`rooted-api-${process.pid}-${Date.now()}`)
- .with_clean_session(true)
+ .with_client_id('rooted-api-subscriber')
+ .with_clean_session(false)
```

### 6. `apps/api/src/domains/machine-domain/mqtt/machine-telemetry/__tests__/handleTelemetry.test.ts`

Updated test suite (5 tests):
- `status_update` — full field mapping including BigInt conversion
- `event` — event_code and event_value present
- Unknown type — no DB insert, console.warn called
- Missing type — same as unknown
- Machine not found — no insert, console.warn called

---

## Reliability Model

| Scenario | Result |
|----------|--------|
| Pi publishes, API online | Message received and inserted immediately |
| Pi publishes, API offline (transient restart) | IoT Core buffers at QoS 1 for `rooted-api-subscriber` persistent session; delivered on reconnect |
| Pi offline, comes back online | Pi drains local SQLite backlog and publishes on reconnect |
| Unknown message type received | Logged, not inserted — no crash |
| Machine not registered in DB | Logged, not inserted — no crash |

**Limitation:** The Pi cannot know if the API *processed* a message — only that the broker received the publish. For telemetry/monitoring data this is acceptable.

---

## Storage Considerations

| Timeframe | Rows (1 machine) | Storage (est.) |
|-----------|-----------------|----------------|
| 1 day | ~14,400 | ~4 MB |
| 1 month | ~432,000 | ~130 MB |
| 1 year | ~5.2M | ~1.6 GB |

**No retention policy exists yet.** The table will grow indefinitely. For the current scale (1–5 machines) this is fine in the near term, but a retention job should be added before the table grows large enough to affect query performance.

---

## Next Step: Retention Policy

Add a nightly job to prune old rows. Simplest implementation — a SQL cron or pg_cron entry:

```sql
DELETE FROM machine_telemetry WHERE received_at < NOW() - INTERVAL '90 days';
```

Alternatively, a small scheduled task in the API process (e.g. using `node-cron`) that runs the same query via Prisma. No schema changes required.

---

## Verification

```bash
# 1. Run tests
cd apps/api && pnpm test

# 2. Check live DB columns
psql -h localhost -p 5433 -U rooted -d rooted_planner \
  -c "SELECT type, uptime_ms, kill_switch FROM machine_telemetry LIMIT 10;"

# 3. Confirm persistent session in subscriber logs
# After API restart, look for: [MQTT] Connected to AWS IoT Core
# Then trigger a Pi telemetry publish and confirm row inserted with all fields
```
