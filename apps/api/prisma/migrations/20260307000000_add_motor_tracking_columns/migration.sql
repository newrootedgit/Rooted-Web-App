-- Add tracking columns for delta-based motor uptime
ALTER TABLE "machines" ADD COLUMN "last_raw_belt_motor_uptime_ms" BIGINT NOT NULL DEFAULT 0;
ALTER TABLE "machines" ADD COLUMN "last_raw_blade_motor_uptime_ms" BIGINT NOT NULL DEFAULT 0;
ALTER TABLE "machines" ADD COLUMN "last_motor_boot_id" BIGINT;

-- Data correction: archive existing current values (which were raw absolutes) into total,
-- then reset current and last_raw to 0
UPDATE "machines"
SET total_belt_motor_uptime_ms = total_belt_motor_uptime_ms + current_belt_motor_uptime_ms,
    total_blade_motor_uptime_ms = total_blade_motor_uptime_ms + current_blade_motor_uptime_ms,
    current_belt_motor_uptime_ms = 0,
    current_blade_motor_uptime_ms = 0,
    last_raw_belt_motor_uptime_ms = 0,
    last_raw_blade_motor_uptime_ms = 0;
