# Fault Count Fix: Event-Based Fault Routing

**Status:** Completed

## Problem Statement

`belt_fault` and `blade_fault` are sent as persistent flags (0/1) in every `STATUS_UPDATE` frame (~1/sec). The backend was creating a `machine_faults` row for every payload where these flags were >0, causing massive count inflation. A 5-minute fault = ~300 rows instead of 1.

## Solution: Use Existing ClearCore EVENT Frames

The ClearCore firmware **already** sends edge-detected fault events:
- `FAULT_BELT_RAISED` — sent once when belt fault transitions 0→1
- `FAULT_BLADE_RAISED` — sent once when blade fault transitions 0→1
- `FAULT_BELT_CLEARED` / `FAULT_BLADE_CLEARED` — sent once on 1→0

These are one-per-occurrence by design. The fix is simply to route fault rows from these events instead of from STATUS_UPDATE flags.

**No firmware changes required.**

---

## How It Works

### ClearCore (no changes needed)

The firmware already does fault edge detection in the main loop:

```cpp
// Belt fault edge detection
if (beltFault != t.lastBeltFault) {
    if (beltFault) {
        t.faultCountBelt++;
        SendEvent("FAULT_BELT_RAISED", (int32_t)t.faultCountBelt);
    } else {
        SendEvent("FAULT_BELT_CLEARED", (int32_t)t.faultCountBelt);
    }
    t.lastBeltFault = beltFault;
}
```

These events flow through the existing pipeline: ClearCore → UDP → Pi ingest → JSONL → Vector → MQTT → backend.

### Backend (`handleTelemetry.ts`)

Maps fault event codes to motor names:

```typescript
const FAULT_EVENT_MAP: Record<string, string> = {
    'FAULT_BELT_RAISED': 'belt',
    'FAULT_BLADE_RAISED': 'blade',
};
```

When an EVENT payload has an `event_code` matching this map, a `machine_faults` row is created with the `motor` field populated. STATUS_UPDATE flags no longer create fault rows.

### Enrichment (`enrichMachinesWithTelemetry.ts`)

Fault counting changed from filtering by `fault_type` to filtering by `motor`:

```typescript
// Before: fault_type === 'belt_fault' (legacy STATUS_UPDATE-based rows)
// After:  motor === 'belt' (works for both legacy backfilled rows and new event-based rows)
const beltFaults = faults.filter((f) => f.motor === 'belt');
const bladeFaults = faults.filter((f) => f.motor === 'blade');
```

---

## Schema Changes

### Prisma (`machine_faults` table)

Added columns:
```prisma
motor       String?  @db.VarChar(20)    // "belt" or "blade"
torque_pct  Int?                        // torque at time of fault (future use)
```

### Migration (`20260311000000_add_fault_frame_columns`)

```sql
ALTER TABLE "machine_faults" ADD COLUMN "motor" VARCHAR(20);
ALTER TABLE "machine_faults" ADD COLUMN "torque_pct" INTEGER;

-- Backfill motor from legacy fault_type values
UPDATE "machine_faults" SET motor = 'belt' WHERE fault_type = 'belt_fault' AND motor IS NULL;
UPDATE "machine_faults" SET motor = 'blade' WHERE fault_type = 'blade_fault' AND motor IS NULL;
```

### TimescaleDB (`raw_telemetry` table)

Added columns to `docker/init-timescale.sql` for fresh installs:
```sql
fault_type  VARCHAR(50),
motor       VARCHAR(20),
```

For existing instances, run the migration in `timescale_migration.sql`:
```sql
ALTER TABLE raw_telemetry ADD COLUMN IF NOT EXISTS fault_type VARCHAR(50);
ALTER TABLE raw_telemetry ADD COLUMN IF NOT EXISTS motor VARCHAR(20);
```

---

## Pi-Side Ingest Changes

**File:** `pi-src/aws/telemetry_ingest.py`

Added support for a future FAULT frame type (forward-compatible):
- `FAULT_FIELDS` list for parsing
- `"fault_type"` and `"motor"` added to `STRING_FIELDS`
- `elif frame_type == "FAULT"` parse branch

The current fault fix works entirely through existing EVENT frames — no Pi changes are required for the fix to work.

---

## Deployment

1. Run TimescaleDB migration: `ALTER TABLE raw_telemetry ADD COLUMN IF NOT EXISTS fault_type VARCHAR(50); ALTER TABLE raw_telemetry ADD COLUMN IF NOT EXISTS motor VARCHAR(20);`
2. Deploy backend — Prisma migration adds columns + backfills motor on existing rows
3. Fault counting immediately starts using event-based routing

No firmware deploy needed. No downtime. No freeze period.

---

## Testing (44 tests passing)

- STATUS_UPDATE with `belt_fault: 1` does NOT create fault rows
- STATUS_UPDATE with `blade_fault: 2` does NOT create fault rows
- `FAULT_BELT_RAISED` event creates fault row with `motor: 'belt'`
- `FAULT_BLADE_RAISED` event creates fault row with `motor: 'blade'`
- Non-fault events (e.g. `BELT_AT_TARGET_VELOCITY`) do NOT create fault rows
- `FAULT_BELT_CLEARED` events do NOT create fault rows
- TimescaleDB failure still allows RDS fault routing

---

## Files Modified

| File | Change |
|------|--------|
| `pi-src/aws/telemetry_ingest.py` | FAULT_FIELDS, STRING_FIELDS, parse branch (forward-compatible) |
| `apps/api/prisma/schema.prisma` | Added motor, torque_pct to machine_faults |
| `apps/api/prisma/migrations/20260311000000_add_fault_frame_columns/migration.sql` | DDL + backfill |
| `apps/api/prisma/migrations/20260311000000_add_fault_frame_columns/timescale_migration.sql` | TimescaleDB DDL |
| `docker/init-timescale.sql` | Added fault_type, motor columns to raw_telemetry |
| `apps/api/src/domains/machine-domain/mqtt/machine-telemetry/handleTelemetry.ts` | Route faults from EVENT codes, not STATUS_UPDATE flags |
| `apps/api/src/domains/machine-domain/queries/enrichMachinesWithTelemetry.ts` | Filter by motor instead of fault_type |
| `apps/api/src/domains/machine-domain/mqtt/machine-telemetry/__tests__/handleTelemetry.test.ts` | Updated + new event-based fault tests |
