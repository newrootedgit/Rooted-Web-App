-- Add running aggregate columns to machines for health dashboard
ALTER TABLE "machines" ADD COLUMN "total_steps"            BIGINT  NOT NULL DEFAULT 0;
ALTER TABLE "machines" ADD COLUMN "total_uptime_ms"        BIGINT  NOT NULL DEFAULT 0;
ALTER TABLE "machines" ADD COLUMN "current_boot_id"        BIGINT;
ALTER TABLE "machines" ADD COLUMN "current_boot_uptime_ms" BIGINT  NOT NULL DEFAULT 0;
ALTER TABLE "machines" ADD COLUMN "reboot_count"           INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "machines" ADD COLUMN "belt_fault_count"       INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "machines" ADD COLUMN "blade_fault_count"      INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "machines" ADD COLUMN "last_belt_fault"        SMALLINT NOT NULL DEFAULT 0;
ALTER TABLE "machines" ADD COLUMN "last_blade_fault"       SMALLINT NOT NULL DEFAULT 0;
