-- Split TimescaleDB Architecture Migration
-- Moves raw telemetry to TimescaleDB, keeps identity + faults in RDS

-- 1. Create machine_faults table
CREATE TABLE "machine_faults" (
    "id"          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "machine_id"  UUID NOT NULL REFERENCES "machines"("id") ON DELETE CASCADE ON UPDATE NO ACTION,
    "fault_type"  VARCHAR(50) NOT NULL,
    "fault_value" INTEGER NOT NULL,
    "event_code"  VARCHAR(100),
    "created_at"  TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX "idx_machine_faults_machine_id" ON "machine_faults"("machine_id");
CREATE INDEX "idx_machine_faults_created_at" ON "machine_faults"("created_at");

-- 2. Drop aggregate columns from machines (now computed from TimescaleDB)
ALTER TABLE "machines" DROP COLUMN IF EXISTS "total_steps";
ALTER TABLE "machines" DROP COLUMN IF EXISTS "total_uptime_ms";
ALTER TABLE "machines" DROP COLUMN IF EXISTS "current_boot_id";
ALTER TABLE "machines" DROP COLUMN IF EXISTS "current_boot_uptime_ms";
ALTER TABLE "machines" DROP COLUMN IF EXISTS "reboot_count";
ALTER TABLE "machines" DROP COLUMN IF EXISTS "belt_fault_count";
ALTER TABLE "machines" DROP COLUMN IF EXISTS "blade_fault_count";
ALTER TABLE "machines" DROP COLUMN IF EXISTS "tray_count";
ALTER TABLE "machines" DROP COLUMN IF EXISTS "last_raw_tray_count";
ALTER TABLE "machines" DROP COLUMN IF EXISTS "last_belt_fault";
ALTER TABLE "machines" DROP COLUMN IF EXISTS "last_blade_fault";
ALTER TABLE "machines" DROP COLUMN IF EXISTS "current_belt_motor_uptime_ms";
ALTER TABLE "machines" DROP COLUMN IF EXISTS "total_belt_motor_uptime_ms";
ALTER TABLE "machines" DROP COLUMN IF EXISTS "current_blade_motor_uptime_ms";
ALTER TABLE "machines" DROP COLUMN IF EXISTS "total_blade_motor_uptime_ms";
ALTER TABLE "machines" DROP COLUMN IF EXISTS "last_raw_belt_motor_uptime_ms";
ALTER TABLE "machines" DROP COLUMN IF EXISTS "last_raw_blade_motor_uptime_ms";
ALTER TABLE "machines" DROP COLUMN IF EXISTS "last_motor_boot_id";

-- 3. Drop machine_telemetry table (data now lives in TimescaleDB)
DROP TABLE IF EXISTS "machine_telemetry";
