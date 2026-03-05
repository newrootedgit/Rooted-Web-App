-- 1. Add trays_processed column
ALTER TABLE "machine_telemetry" ADD COLUMN "trays_processed" INTEGER;

-- 2. Partial unique index for deduplication (boot_id + seq per machine)
CREATE UNIQUE INDEX "idx_machine_telemetry_dedup"
  ON "machine_telemetry" ("machine_id", "boot_id", "seq")
  WHERE "boot_id" IS NOT NULL AND "seq" IS NOT NULL;
