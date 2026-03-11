-- Run this on the existing TimescaleDB instance BEFORE deploying the new backend code.
-- These columns are already in docker/init-timescale.sql for fresh installs.

ALTER TABLE raw_telemetry ADD COLUMN IF NOT EXISTS fault_type VARCHAR(50);
ALTER TABLE raw_telemetry ADD COLUMN IF NOT EXISTS motor VARCHAR(20);
