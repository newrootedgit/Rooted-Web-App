# Trays Per Preset

## Context

`trays_processed` arrives in every telemetry message and is stored in TimescaleDB (`raw_telemetry`), then aggregated lifetime-wide per machine via `enrichMachinesWithTelemetry.ts` (`SUM(MAX(trays_processed) per session)`). The current preset is tracked separately as `active_variety: number` in `MachineConfig` (RDS).

**There is no dimension linking a tray count to the preset that produced it.** Presets can change mid-session, so session-level attribution alone is insufficient. This doc lays out the options considered and the chosen approach.

---

## Options Considered

### Option A — Stamp `active_variety` on every telemetry message *(chosen)*

- **Firmware**: include `active_variety: number` in every telemetry payload.
- **DB**: add `active_variety SMALLINT` column to `raw_telemetry`.
- **Query**: group by `(session_id, active_variety)` when computing tray deltas.

**Pros**
- Correct even when preset changes mid-session — each row knows its preset.
- Minimal payload overhead (one int).
- Backfill-friendly: rows without `active_variety` simply don't contribute to per-preset stats; legacy `trayCount` is unaffected.
- No new tables, no clock-sync concerns.

**Cons**
- Requires firmware update across the fleet.
- `MAX(trays_processed)` per session no longer works directly; need per-`(session, preset)` deltas from the running counter (handle resets/reboots carefully).

### Option B — Preset-transition events + time-range joins

Firmware emits a `preset_change` event whenever the operator switches presets. Server builds a `preset_intervals` timeseries; tray counts attributed by joining telemetry timestamps against intervals.

- **Pros**: smaller per-message payload; natural place to store who/where the change came from.
- **Cons**: lossy — a dropped event corrupts an entire interval; complex range-join SQL; needs a bootstrap event at session start.

### Option C — One preset per session (snapshot at session start)

Firmware sends preset once at session start; store on `machine_sessions` table keyed by `session_id`; join telemetry to it.

- **Pros**: simplest schema and query; no per-row overhead.
- **Cons**: **wrong** if preset changes mid-session. Would have to enforce "preset change ends the session" on firmware, coupling concerns.

### Option D — Server-side preset log (no firmware change)

When a user changes preset via the web app, server writes `(machineId, presetId, changedAt)`. Attribution by time range.

- **Pros**: zero firmware change; ships fast.
- **Cons**: misses physical/firmware-local changes; clock-drift risk; doesn't work for demo machines without faking entries.

---

## Chosen Approach: Option A

The only approach that is correct under mid-session preset changes. Schema and query changes are local to two files. The firmware bump is a one-time cost we'd likely need anyway for B or C.

---

## Implementation Plan

### 1. TimescaleDB migration

```sql
ALTER TABLE raw_telemetry ADD COLUMN active_variety SMALLINT NULL;
CREATE INDEX IF NOT EXISTS raw_telemetry_machine_session_variety_idx
  ON raw_telemetry (machine_id, session_id, active_variety, received_at);
```

`SMALLINT` matches the 1–20 range from `machineConfigSchema`. Nullable so legacy rows / pre-deploy firmware leave NULL — those rows still aggregate into the existing `trayCount` but are excluded from per-preset breakdown. **No backfill possible** — historical preset attribution is unrecoverable.

> Index cost: roughly doubles write amplification on the hypertable. If telemetry volume is high, consider deferring the index and relying on the existing `(machine_id, received_at)` index.

### 2. Telemetry ingest (`apps/api/src/domains/machine-domain/mqtt/machine-telemetry/handleTelemetry.ts`)

- Add `active_variety?: number | null;` to `TelemetryPayload` (after `trays_processed`).
- Add `active_variety` to the INSERT column list, append `p.active_variety ?? null` to params.
- Optional: clamp/discard if outside 1–20 to avoid poisoning aggregates.

Legacy firmware sends no field → `undefined` → coerced to `null` → ignored downstream.

### 3. Aggregation query (`apps/api/src/domains/machine-domain/queries/enrichMachinesWithTelemetry.ts`)

Keep the existing `session_totals` CTE for the backwards-compatible `tray_count`. Add a parallel CTE that computes per-`(machine, session, active_variety)` deltas, then sums per-`(machine, active_variety)`:

```sql
preset_session_totals AS (
  SELECT
    machine_id,
    COALESCE(session_id, CONCAT('boot:', boot_id::text)) AS session_key,
    active_variety,
    MAX(trays_processed) - MIN(trays_processed) AS preset_trays
  FROM filtered
  WHERE type = 'status_update'
    AND active_variety IS NOT NULL
    AND trays_processed IS NOT NULL
    AND (session_id IS NOT NULL OR boot_id IS NOT NULL)
  GROUP BY machine_id, session_key, active_variety
),
preset_lifetime AS (
  SELECT
    machine_id,
    jsonb_object_agg(active_variety::text, total_trays) AS trays_by_preset
  FROM (
    SELECT machine_id, active_variety, COALESCE(SUM(preset_trays), 0)::bigint AS total_trays
    FROM preset_session_totals
    GROUP BY machine_id, active_variety
  ) s
  GROUP BY machine_id
)
```

Edge cases handled:
- NULL `active_variety` rows excluded from breakdown but still included in legacy `trayCount`.
- Counter resets at reboot are isolated by `session_key` grouping (existing pattern).
- Single-row sessions yield `MAX-MIN=0` (correct — no observed work).

**Open question — undercount on first sample**: the first row of a session has `trays_processed = N`, not 0, so `MAX-MIN` undercounts by the trays-at-session-start. Acceptable as approximation, or use a `LAG()` window function over `received_at` to attribute the very first delta correctly when presets switch mid-session. The window approach is more correct but adds query complexity.

### 4. Type updates (`apps/api/src/domains/machine-domain/types.ts`)

Add to `Machine`:

```ts
traysByPreset?: Record<string, number> | null;
```

Keys are stringified preset numbers (`"1"`..`"20"`) to match `MachineConfig` keying. `trayCount` remains the lifetime total — backwards-compat preserved.

In `enrichMachinesWithTelemetry.ts`, add `trays_by_preset` to `TimescaleStatsRow`, default `null` in `mapBaseFields`, assign in the row mapper.

### 5. Demo data (`apps/api/src/domains/machine-domain/queries/demoTelemetry.ts`)

Extend `DemoTelemetryProfile` with `traysByPreset: Record<string, number>`. Sums must match existing totals:

- HARVESTER (12,480): `{ "1": 6200, "2": 4100, "3": 2180 }`
- SEEDER (9,100): `{ "1": 5400, "2": 3700 }`

Set in both profile blocks; assign in `applyDemoTelemetry`.

### 6. Frontend touchpoints

Single render site today: `src/machines/dashboard/components/MachineCard.tsx` (around the existing `trayCount` rendering). Recommend a tooltip or expandable subline showing per-preset breakdown using `machine.traysByPreset` mapped through `MachineConfig.variety_names`.

> Caveat: `MachineCard` does not currently receive `MachineConfig`. Either plumb the config in, or render numeric preset IDs as a v0.

### 7. Tests (`apps/api/src/domains/machine-domain/queries/__tests__/`)

New file `enrichMachinesWithTelemetry.test.ts` (follow the mocking pattern in `listMachines.test.ts`). Cases:

- **(a) Preset switch mid-session**: rows with `trays_processed` 0,5,10 at variety 1, then 10,15,20 at variety 2 → expect `{1: 10, 2: 10}`.
- **(b) NULL backfill**: rows with NULL variety contribute to `trayCount` but are absent from `traysByPreset`.
- **(c) Reboot inside one preset**: two sessions, same variety, expect summed per-session deltas.
- **(d) Demo overlay**: `applyDemoTelemetry` sets `traysByPreset` and the sum equals `trayCount`.

### 8. Firmware contract (out of scope; documented for the firmware team)

- **Field**: `active_variety` (snake_case, matches existing payload casing).
- **Type**: integer 1–20, or omitted/null when no preset is loaded.
- **Cadence**: include in **every** `status_update` and `event` MQTT message on `rooted/machines/{deviceId}/telemetry`. Stamping only on change events would break the `MAX-MIN` aggregation.
- **Source**: firmware's local copy of `MachineConfig.active_variety`, updated via the existing config response flow.

---

## Critical Files

- `apps/api/src/domains/machine-domain/mqtt/machine-telemetry/handleTelemetry.ts` — add `active_variety` to `TelemetryPayload`, write to TimescaleDB.
- `apps/api/src/domains/machine-domain/queries/enrichMachinesWithTelemetry.ts` — add per-preset CTE; expose `trays_by_preset`.
- `apps/api/src/domains/machine-domain/queries/demoTelemetry.ts` — extend profiles with per-preset breakdown.
- `apps/api/src/domains/machine-domain/types.ts` — add `traysByPreset` to `Machine`.
- `src/machines/dashboard/components/MachineCard.tsx` — surface the breakdown.
- TimescaleDB migration — add `active_variety SMALLINT` to `raw_telemetry`.
- Firmware — include `active_variety` in every telemetry publish.

---

## Risks / Open Questions

1. **First-row undercount** (section 3): use `MAX-MIN` approximation, or invest in a `LAG()` window query for exact attribution at preset boundaries?
2. **Cadence assumption**: confirms firmware will stamp every message, not only on change. The plan assumes yes (it is the premise of Option A).
3. **Index cost**: composite index on the hypertable adds write amplification. May need to defer.
4. **Out-of-range varieties**: app validates 1–20, but SMALLINT permits more. Decide: reject row, clamp, or store as-is.

---

## Verification

- Unit tests in `enrichMachinesWithTelemetry` covering the four cases above.
- Manual: set up a demo machine, switch preset via UI, confirm `traysByPreset` reflects both segments.
- Staging: deploy firmware bump to one machine, run a multi-preset session, confirm per-preset numbers in the dashboard.
