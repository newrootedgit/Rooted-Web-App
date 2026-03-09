ALTER TABLE "machines" ADD COLUMN "current_belt_motor_uptime_ms" BIGINT NOT NULL DEFAULT 0;
ALTER TABLE "machines" ADD COLUMN "total_belt_motor_uptime_ms" BIGINT NOT NULL DEFAULT 0;
ALTER TABLE "machines" ADD COLUMN "current_blade_motor_uptime_ms" BIGINT NOT NULL DEFAULT 0;
ALTER TABLE "machines" ADD COLUMN "total_blade_motor_uptime_ms" BIGINT NOT NULL DEFAULT 0;
