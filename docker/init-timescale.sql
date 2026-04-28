-- TimescaleDB Schema for Rooted Telemetry
-- Raw telemetry hypertable with dedup + continuous aggregates
-- All statements are idempotent (safe to re-run on every deploy)

CREATE EXTENSION IF NOT EXISTS timescaledb;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Raw Telemetry Hypertable
-- ============================================

CREATE TABLE IF NOT EXISTS raw_telemetry (
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
    roller_motor_uptime_ms BIGINT,
    event_code          VARCHAR(100),
    event_value         INTEGER,
    trays_processed     INTEGER,
    fault_type          VARCHAR(50),
    motor               VARCHAR(20)
);

-- Idempotent column adds for existing tables (CREATE TABLE IF NOT EXISTS won't add new columns)
ALTER TABLE raw_telemetry ADD COLUMN IF NOT EXISTS roller_motor_uptime_ms BIGINT;

-- Convert to hypertable partitioned by received_at
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM timescaledb_information.hypertables
        WHERE hypertable_name = 'raw_telemetry'
    ) THEN
        PERFORM create_hypertable('raw_telemetry', 'received_at');
    END IF;
END $$;

-- Dedup index: same machine + timestamp + seq = duplicate (MQTT QoS redelivery)
CREATE UNIQUE INDEX IF NOT EXISTS idx_raw_telemetry_dedup
    ON raw_telemetry (machine_id, received_at, seq)
    WHERE seq IS NOT NULL;

-- Index for per-machine queries
CREATE INDEX IF NOT EXISTS idx_raw_telemetry_machine_id ON raw_telemetry (machine_id, received_at DESC);

-- ============================================
-- Continuous Aggregate: machine_stats
-- Rolled-up stats per machine, refreshed automatically
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM timescaledb_information.continuous_aggregates
        WHERE view_name = 'machine_stats'
    ) THEN
        EXECUTE '
            CREATE MATERIALIZED VIEW machine_stats
            WITH (timescaledb.continuous) AS
            SELECT
                machine_id,
                time_bucket(''1 hour'', received_at) AS bucket,
                SUM(delta_steps)                                    AS total_steps,
                MAX(uptime_ms)                                      AS total_uptime_ms,
                MAX(uptime_ms) - MIN(uptime_ms)                     AS current_boot_uptime_ms,
                COUNT(DISTINCT boot_id) - 1                         AS reboot_count,
                SUM(trays_processed)                                AS tray_count,
                MAX(belt_motor_uptime_ms)                           AS belt_motor_uptime_ms,
                MAX(blade_motor_uptime_ms)                          AS blade_motor_uptime_ms,
                last(event_code, received_at)  FILTER (WHERE type = ''event'' AND event_code IS NOT NULL)  AS last_event_code,
                last(event_value, received_at) FILTER (WHERE type = ''event'' AND event_code IS NOT NULL)  AS last_event_value,
                last(received_at, received_at) FILTER (WHERE type = ''event'' AND event_code IS NOT NULL)  AS last_event_at
            FROM raw_telemetry
            GROUP BY machine_id, time_bucket(''1 hour'', received_at)
            WITH NO DATA
        ';
    END IF;
END $$;

-- Refresh policy: refresh the last 2 hours of data every 5 minutes
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM timescaledb_information.jobs
        WHERE hypertable_name = 'machine_stats'
          AND proc_name = 'policy_refresh_continuous_aggregate'
    ) THEN
        PERFORM add_continuous_aggregate_policy('machine_stats',
            start_offset    => INTERVAL '3 hours',
            end_offset      => INTERVAL '5 minutes',
            schedule_interval => INTERVAL '5 minutes'
        );
    END IF;
END $$;

-- ============================================
-- Compression Policy
-- Compress chunks older than 7 days
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM timescaledb_information.compression_settings
        WHERE hypertable_name = 'raw_telemetry'
    ) THEN
        ALTER TABLE raw_telemetry SET (
            timescaledb.compress,
            timescaledb.compress_segmentby = 'machine_id',
            timescaledb.compress_orderby = 'received_at DESC'
        );
    END IF;
END $$;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM timescaledb_information.jobs
        WHERE hypertable_name = 'raw_telemetry'
          AND proc_name = 'policy_compression'
    ) THEN
        PERFORM add_compression_policy('raw_telemetry', INTERVAL '7 days');
    END IF;
END $$;

-- ============================================
-- Retention Policy
-- Drop raw data older than 90 days (aggregates persist)
-- ============================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM timescaledb_information.jobs
        WHERE hypertable_name = 'raw_telemetry'
          AND proc_name = 'policy_retention'
    ) THEN
        PERFORM add_retention_policy('raw_telemetry', INTERVAL '90 days');
    END IF;
END $$;
