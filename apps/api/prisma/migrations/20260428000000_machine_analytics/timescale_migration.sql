-- Run this on the TimescaleDB instance before or alongside the analytics page deploy.
-- Fresh local databases get the same view from docker/init-timescale.sql.

CREATE MATERIALIZED VIEW IF NOT EXISTS machine_analytics_5m
WITH (timescaledb.continuous) AS
SELECT
    machine_id,
    time_bucket('5 minutes', received_at) AS bucket,
    COALESCE(SUM(delta_steps), 0) AS steps,
    GREATEST(COALESCE(MAX(trays_processed) - MIN(trays_processed), 0), 0) AS trays,
    AVG(torque_pct) AS avg_torque_pct,
    MAX(torque_pct) AS max_torque_pct,
    AVG(cmd_age_ms) AS avg_cmd_age_ms,
    MAX(udp_fail_count) AS max_udp_fail_count,
    COUNT(*) FILTER (WHERE kill_switch = 1) AS kill_switch_count,
    COUNT(*) FILTER (WHERE COALESCE(alert_bits, 0) > 0) AS alert_count,
    COUNT(*) FILTER (WHERE belt_fault = 1) AS belt_fault_count,
    COUNT(*) FILTER (WHERE blade_fault = 1) AS blade_fault_count,
    GREATEST(COALESCE(MAX(belt_motor_uptime_ms) - MIN(belt_motor_uptime_ms), 0), 0) AS belt_motor_delta_ms,
    GREATEST(COALESCE(MAX(blade_motor_uptime_ms) - MIN(blade_motor_uptime_ms), 0), 0) AS blade_motor_delta_ms,
    GREATEST(COALESCE(MAX(roller_motor_uptime_ms) - MIN(roller_motor_uptime_ms), 0), 0) AS roller_motor_delta_ms
FROM raw_telemetry
WHERE type = 'status_update'
GROUP BY machine_id, time_bucket('5 minutes', received_at)
WITH NO DATA;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM timescaledb_information.jobs
        WHERE hypertable_name = 'machine_analytics_5m'
          AND proc_name = 'policy_refresh_continuous_aggregate'
    ) THEN
        PERFORM add_continuous_aggregate_policy('machine_analytics_5m',
            start_offset    => INTERVAL '3 hours',
            end_offset      => INTERVAL '5 minutes',
            schedule_interval => INTERVAL '5 minutes'
        );
    END IF;
END $$;
