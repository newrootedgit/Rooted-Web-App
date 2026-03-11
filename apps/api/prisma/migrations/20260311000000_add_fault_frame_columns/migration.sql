-- Add motor and torque_pct columns to machine_faults for FAULT frame support
ALTER TABLE "machine_faults" ADD COLUMN "motor" VARCHAR(20);
ALTER TABLE "machine_faults" ADD COLUMN "torque_pct" INTEGER;

-- Backfill motor from legacy fault_type values
UPDATE "machine_faults" SET motor = 'belt' WHERE fault_type = 'belt_fault' AND motor IS NULL;
UPDATE "machine_faults" SET motor = 'blade' WHERE fault_type = 'blade_fault' AND motor IS NULL;
