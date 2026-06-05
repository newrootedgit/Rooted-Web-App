-- Run this on the TimescaleDB instance alongside the analytics fix deploy.
-- Fresh local databases get the same behavior from docker/init-timescale.sql.
--
-- Enable real-time aggregation on the machine_analytics_5m continuous aggregate.
-- With materialized_only = false, queries against the view return materialized
-- buckets UNIONed with a live computation of the most-recent (unmaterialized)
-- tail from raw_telemetry. This fixes the Machine Analytics page reporting
-- 0 runtime / "No telemetry for this range" for machines that have only been
-- running for a few minutes (the refresh policy lags by up to its end_offset).
--
-- Idempotent: ALTER ... SET is safe to re-run.

ALTER MATERIALIZED VIEW machine_analytics_5m SET (timescaledb.materialized_only = false);
