ALTER TABLE "farm_users"
  ADD COLUMN "machine_tutorial_completed_at" TIMESTAMP(6),
  ADD COLUMN "machine_tutorial_dismissed_at" TIMESTAMP(6);

ALTER TABLE "machines"
  ADD COLUMN "is_demo" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN "demo_config" JSONB;

CREATE INDEX "idx_machines_is_demo" ON "machines"("is_demo");
