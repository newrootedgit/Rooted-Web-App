-- TimescaleDB Schema for Rooted Telemetry
-- Raw telemetry hypertable with dedup + continuous aggregates

CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Raw Telemetry Hypertable
-- ============================================

CREATE TABLE raw_telemetry (
    machine_id          UUID NOT NULL,
    session_id          VARCHAR(36),
    received_at         TIMESTAMPTZ NOT NULL,
    type                VARCHAR(50),
    schema_ver          INTEGER,
    boot_id             BIGINT,
    seq                 INTEGER,
    uptime_ms           BIGINT,
    uptime_s            INTEGER,
    delta_steps         INTEGER,
    torque_pct          SMALLINT,
    belt_fault          SMALLINT,
    blade_fault         SMALLINT,
    alert_bits          INTEGER,
    kill_switch         SMALLINT,
    cmd_age_ms          INTEGER,
    udp_fail_count      INTEGER,
    belt_motor_uptime_ms  BIGINT,
    blade_motor_uptime_ms BIGINT,
    event_code          VARCHAR(100),
    event_value         INTEGER,
    trays_processed     INTEGER
);

-- Convert to hypertable partitioned by received_at
SELECT create_hypertable('raw_telemetry', 'received_at');

-- Dedup index: same machine + timestamp + seq = duplicate (MQTT QoS redelivery)
CREATE UNIQUE INDEX idx_raw_telemetry_dedup
    ON raw_telemetry (machine_id, received_at, seq)
    WHERE seq IS NOT NULL;

-- Index for per-machine queries
CREATE INDEX idx_raw_telemetry_machine_id ON raw_telemetry (machine_id, received_at DESC);

-- ============================================
-- Continuous Aggregate: machine_stats
-- Rolled-up stats per machine, refreshed automatically
-- ============================================

CREATE MATERIALIZED VIEW machine_stats
WITH (timescaledb.continuous) AS
SELECT
    machine_id,
    SUM(delta_steps)                                    AS total_steps,
    MAX(uptime_ms)                                      AS total_uptime_ms,
    MAX(uptime_ms) - MIN(uptime_ms)                     AS current_boot_uptime_ms,
    COUNT(DISTINCT boot_id) - 1                         AS reboot_count,
    SUM(trays_processed)                                AS tray_count,
    MAX(belt_motor_uptime_ms)                           AS belt_motor_uptime_ms,
    MAX(blade_motor_uptime_ms)                          AS blade_motor_uptime_ms,
    -- Latest event info via last()
    last(event_code, received_at)  FILTER (WHERE type = 'event' AND event_code IS NOT NULL)  AS last_event_code,
    last(event_value, received_at) FILTER (WHERE type = 'event' AND event_code IS NOT NULL)  AS last_event_value,
    last(received_at, received_at) FILTER (WHERE type = 'event' AND event_code IS NOT NULL)  AS last_event_at
FROM raw_telemetry
GROUP BY machine_id, time_bucket('1 hour', received_at)
WITH NO DATA;

-- Refresh policy: refresh the last 2 hours of data every 5 minutes
SELECT add_continuous_aggregate_policy('machine_stats',
    start_offset    => INTERVAL '3 hours',
    end_offset      => INTERVAL '5 minutes',
    schedule_interval => INTERVAL '5 minutes'
);

-- ============================================
-- Compression Policy
-- Compress chunks older than 7 days
-- ============================================

ALTER TABLE raw_telemetry SET (
    timescaledb.compress,
    timescaledb.compress_segmentby = 'machine_id',
    timescaledb.compress_orderby = 'received_at DESC'
);

SELECT add_compression_policy('raw_telemetry', INTERVAL '7 days');

-- ============================================
-- Retention Policy
-- Drop raw data older than 90 days (aggregates persist)
-- ============================================

SELECT add_retention_policy('raw_telemetry', INTERVAL '90 days');
