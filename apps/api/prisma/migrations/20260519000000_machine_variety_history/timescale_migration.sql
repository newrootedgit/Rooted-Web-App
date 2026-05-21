-- Run this on the existing TimescaleDB instance BEFORE deploying the new backend code.
-- This column is already in docker/init-timescale.sql for fresh installs.
-- Slot id (0-20) sent by the device with each status frame. -1 means unset.

ALTER TABLE raw_telemetry ADD COLUMN IF NOT EXISTS active_variety SMALLINT;
