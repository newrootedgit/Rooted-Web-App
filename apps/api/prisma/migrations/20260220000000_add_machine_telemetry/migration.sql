-- CreateTable
CREATE TABLE "machine_telemetry" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "machine_id" UUID NOT NULL,
    "session_id" VARCHAR(36) NOT NULL,
    "received_at" TIMESTAMP(6) NOT NULL,
    "uptime_s" INTEGER NOT NULL,
    "delta_steps" INTEGER NOT NULL,

    CONSTRAINT "machine_telemetry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_machine_telemetry_machine_id" ON "machine_telemetry"("machine_id");

-- CreateIndex
CREATE INDEX "idx_machine_telemetry_session_id" ON "machine_telemetry"("session_id");

-- CreateIndex
CREATE INDEX "idx_machine_telemetry_received_at" ON "machine_telemetry"("received_at");

-- AddForeignKey
ALTER TABLE "machine_telemetry" ADD CONSTRAINT "machine_telemetry_machine_id_fkey" FOREIGN KEY ("machine_id") REFERENCES "machines"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
