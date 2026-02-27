-- Make existing required columns nullable (legacy rows keep their values)
ALTER TABLE "machine_telemetry" ALTER COLUMN "session_id" DROP NOT NULL;
ALTER TABLE "machine_telemetry" ALTER COLUMN "uptime_s" DROP NOT NULL;
ALTER TABLE "machine_telemetry" ALTER COLUMN "delta_steps" DROP NOT NULL;

-- Add new telemetry fields (all nullable)
ALTER TABLE "machine_telemetry" ADD COLUMN "type" VARCHAR(50);
ALTER TABLE "machine_telemetry" ADD COLUMN "schema_ver" INTEGER;
ALTER TABLE "machine_telemetry" ADD COLUMN "boot_id" BIGINT;
ALTER TABLE "machine_telemetry" ADD COLUMN "seq" INTEGER;
ALTER TABLE "machine_telemetry" ADD COLUMN "uptime_ms" BIGINT;
ALTER TABLE "machine_telemetry" ADD COLUMN "torque_pct" SMALLINT;
ALTER TABLE "machine_telemetry" ADD COLUMN "belt_fault" SMALLINT;
ALTER TABLE "machine_telemetry" ADD COLUMN "blade_fault" SMALLINT;
ALTER TABLE "machine_telemetry" ADD COLUMN "alert_bits" INTEGER;
ALTER TABLE "machine_telemetry" ADD COLUMN "kill_switch" SMALLINT;
ALTER TABLE "machine_telemetry" ADD COLUMN "cmd_age_ms" INTEGER;
ALTER TABLE "machine_telemetry" ADD COLUMN "udp_fail_count" INTEGER;
ALTER TABLE "machine_telemetry" ADD COLUMN "event_code" VARCHAR(100);
ALTER TABLE "machine_telemetry" ADD COLUMN "event_value" INTEGER;
