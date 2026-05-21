-- Slowly-changing-dimension table mapping (machine, active_variety slot) -> name over time.
-- Telemetry stores only the slot id; the name resolves via this table for the row's received_at.
CREATE TABLE IF NOT EXISTS machine_variety_history (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id      UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    active_variety  SMALLINT NOT NULL,
    name            VARCHAR(255) NOT NULL,
    grams_per_tray  INTEGER,
    started_at      TIMESTAMPTZ NOT NULL,
    ended_at        TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_machine_variety_history_machine_started
    ON machine_variety_history (machine_id, started_at DESC);

CREATE INDEX IF NOT EXISTS idx_machine_variety_history_machine_slot_started
    ON machine_variety_history (machine_id, active_variety, started_at DESC);

-- Partial unique index: at most one open (ended_at IS NULL) row per (machine, slot).
CREATE UNIQUE INDEX IF NOT EXISTS uq_machine_variety_history_open
    ON machine_variety_history (machine_id, active_variety)
    WHERE ended_at IS NULL;
