-- Catalog of part kinds per machine type. farm_id IS NULL = global default;
-- non-null = per-farm override of the same (machine_type, name).
CREATE TABLE IF NOT EXISTS machine_part_types (
    id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    farm_id           UUID REFERENCES farms(id) ON DELETE CASCADE,
    machine_type      VARCHAR(50) NOT NULL,
    name              VARCHAR(255) NOT NULL,
    metric            VARCHAR(20) NOT NULL,
    usage_source      VARCHAR(50) NOT NULL,
    default_lifespan  INTEGER NOT NULL,
    warning_pct       INTEGER NOT NULL DEFAULT 80,
    critical_pct      INTEGER NOT NULL DEFAULT 100,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_machine_part_types_machine_type
    ON machine_part_types (machine_type);

CREATE UNIQUE INDEX IF NOT EXISTS uq_machine_part_types_global
    ON machine_part_types (machine_type, name)
    WHERE farm_id IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_machine_part_types_farm
    ON machine_part_types (farm_id, machine_type, name)
    WHERE farm_id IS NOT NULL;

-- Installed parts on a specific machine. replaced_at = NULL means active.
CREATE TABLE IF NOT EXISTS machine_parts (
    id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    machine_id          UUID NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
    part_type_id        UUID NOT NULL REFERENCES machine_part_types(id) ON DELETE RESTRICT,
    installed_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    lifespan_override   INTEGER,
    usage_at_install    NUMERIC(14, 2) NOT NULL DEFAULT 0,
    replaced_at         TIMESTAMPTZ,
    notes               TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_machine_parts_machine_active
    ON machine_parts (machine_id, replaced_at);

-- Global default catalog. Lifespans are placeholders; admins can override per-farm later.
INSERT INTO machine_part_types (farm_id, machine_type, name, metric, usage_source, default_lifespan)
VALUES
    (NULL, 'SEEDER',    'Belt',         'HOURS',  'belt_motor_runtime',   200),
    (NULL, 'SEEDER',    'Belt motor',   'HOURS',  'belt_motor_runtime',   500),
    (NULL, 'SEEDER',    'Roller motor', 'HOURS',  'roller_motor_runtime', 500),
    (NULL, 'HARVESTER', 'Belt',         'HOURS',  'belt_motor_runtime',   200),
    (NULL, 'HARVESTER', 'Belt motor',   'HOURS',  'belt_motor_runtime',   500),
    (NULL, 'HARVESTER', 'Blade',        'CYCLES', 'trays_processed',      50000),
    (NULL, 'HARVESTER', 'Blade motor',  'HOURS',  'blade_motor_runtime',  500)
ON CONFLICT DO NOTHING;
