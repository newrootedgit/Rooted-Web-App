import { prisma } from '../../../../lib/db/index.js';

export interface TelemetryPayload {
    type?: string;
    session_id?: string;
    schema_ver?: number;
    boot_id?: number;
    seq?: number;
    uptime_ms?: number;
    uptime_s?: number;
    delta_steps?: number;
    torque_pct?: number;
    belt_fault?: number;
    blade_fault?: number;
    alert_bits?: number;
    kill_switch?: number;
    cmd_age_ms?: number;
    belt_motor_uptime_ms?: number;
    blade_motor_uptime_ms?: number;
    udp_fail_count?: number;
    event_code?: string;
    event_value?: number;
    trays_processed?: number;
}

export async function handleTelemetry(deviceId: string, payloads: TelemetryPayload[]): Promise<void> {
    // Filter to valid types only
    const valid = payloads.filter(p => p.type === 'status_update' || p.type === 'event');

    if (valid.length === 0) {
        if (payloads.length > 0) {
            console.warn(`[MQTT] handleTelemetry: no valid types in batch of ${payloads.length} for device ${deviceId}, skipping`);
        }
        return;
    }

    const machine = await prisma.machines.findFirst({
        where: { device_id: deviceId },
    });

    if (!machine) {
        console.warn(`[MQTT] handleTelemetry: machine not found for device ID: ${deviceId}`);
        return;
    }

    const now = new Date();

    // Build telemetry rows for createMany
    const rows = valid.map(p => ({
        machine_id:      machine.id,
        session_id:      p.session_id ?? null,
        received_at:     now,
        type:            p.type ?? null,
        schema_ver:      p.schema_ver ?? null,
        boot_id:         p.boot_id != null ? BigInt(p.boot_id) : null,
        seq:             p.seq ?? null,
        uptime_ms:       p.uptime_ms != null ? BigInt(p.uptime_ms) : null,
        uptime_s:        p.uptime_s ?? null,
        delta_steps:     p.delta_steps ?? null,
        belt_motor_uptime_ms: p.belt_motor_uptime_ms != null ? BigInt(p.belt_motor_uptime_ms) : null,
        blade_motor_uptime_ms: p.blade_motor_uptime_ms != null ? BigInt(p.blade_motor_uptime_ms) : null,
        torque_pct:      p.torque_pct ?? null,
        belt_fault:      p.belt_fault ?? null,
        blade_fault:     p.blade_fault ?? null,
        alert_bits:      p.alert_bits ?? null,
        kill_switch:     p.kill_switch ?? null,
        cmd_age_ms:      p.cmd_age_ms ?? null,
        udp_fail_count:  p.udp_fail_count ?? null,
        event_code:      p.event_code ?? null,
        event_value:     p.event_value ?? null,
        trays_processed: p.trays_processed ?? null,
    }));

    // Sum delta_steps across all status_updates for atomic increment
    const statusUpdates = valid.filter(p => p.type === 'status_update');
    const totalDeltaSteps = statusUpdates.reduce((sum, p) => sum + (p.delta_steps ?? 0), 0);

    // Build the machines update data
    const updateData: Record<string, unknown> = {
        last_seen_at: now,
    };

    // Atomic increment for total_steps (no read-compute-write race)
    if (totalDeltaSteps > 0) {
        updateData.total_steps = { increment: totalDeltaSteps };
    }

    // Stateful aggregate logic requires SELECT ... FOR UPDATE to prevent races
    const hasStatefulUpdates = statusUpdates.some(p =>
        (p.boot_id != null && p.uptime_ms != null) ||
        p.belt_fault != null ||
        p.blade_fault != null
    );

    if (hasStatefulUpdates) {
        await prisma.$transaction(async (tx) => {
            // Lock the machine row
            const [locked] = await tx.$queryRawUnsafe<Array<{
                current_boot_id: bigint | null;
                current_boot_uptime_ms: bigint;
                total_uptime_ms: bigint;
                reboot_count: number;
                belt_fault_count: number;
                blade_fault_count: number;
                last_belt_fault: number;
                last_blade_fault: number;
            }>>(
                `SELECT current_boot_id, current_boot_uptime_ms, total_uptime_ms,
                        reboot_count, belt_fault_count, blade_fault_count,
                        last_belt_fault, last_blade_fault
                 FROM machines WHERE id = $1::uuid FOR UPDATE`,
                machine.id
            );

            // Walk status_updates in order for boot/fault state transitions
            let currentBootId = locked.current_boot_id;
            let currentBootUptimeMs = locked.current_boot_uptime_ms;
            let totalUptimeMs = locked.total_uptime_ms;
            let rebootCount = locked.reboot_count;
            let beltFaultCount = locked.belt_fault_count;
            let bladeFaultCount = locked.blade_fault_count;
            let lastBeltFault = locked.last_belt_fault;
            let lastBladeFault = locked.last_blade_fault;

            let bootChanged = false;
            let faultChanged = false;

            for (const p of statusUpdates) {
                // Boot / uptime tracking
                if (p.boot_id != null && p.uptime_ms != null) {
                    const newBootId = BigInt(p.boot_id);
                    const newUptimeMs = BigInt(p.uptime_ms);

                    if (currentBootId === null || newBootId !== currentBootId) {
                        // New boot detected — archive the completed session
                        totalUptimeMs = totalUptimeMs + currentBootUptimeMs;
                        if (currentBootId !== null) {
                            rebootCount += 1;
                        }
                        currentBootId = newBootId;
                        currentBootUptimeMs = newUptimeMs;
                    } else {
                        // Same boot — advance the high-water mark
                        if (newUptimeMs > currentBootUptimeMs) {
                            currentBootUptimeMs = newUptimeMs;
                        }
                    }
                    bootChanged = true;
                }

                // Fault onset detection
                if (p.belt_fault != null) {
                    if (p.belt_fault > 0 && lastBeltFault === 0) {
                        beltFaultCount += 1;
                    }
                    lastBeltFault = p.belt_fault;
                    faultChanged = true;
                }

                if (p.blade_fault != null) {
                    if (p.blade_fault > 0 && lastBladeFault === 0) {
                        bladeFaultCount += 1;
                    }
                    lastBladeFault = p.blade_fault;
                    faultChanged = true;
                }
            }

            // Merge stateful fields into update
            if (bootChanged) {
                updateData.current_boot_id = currentBootId;
                updateData.current_boot_uptime_ms = currentBootUptimeMs;
                updateData.total_uptime_ms = totalUptimeMs;
                updateData.reboot_count = rebootCount;
            }
            if (faultChanged) {
                updateData.belt_fault_count = beltFaultCount;
                updateData.blade_fault_count = bladeFaultCount;
                updateData.last_belt_fault = lastBeltFault;
                updateData.last_blade_fault = lastBladeFault;
            }

            // Batch insert telemetry rows + update machine in the same transaction
            await tx.machine_telemetry.createMany({ data: rows, skipDuplicates: true });
            await tx.machines.update({
                where: { id: machine.id },
                data: updateData,
            });
        });
    } else {
        // No stateful updates needed — simple batch insert + machine update
        await prisma.machine_telemetry.createMany({ data: rows, skipDuplicates: true });
        await prisma.machines.update({
            where: { id: machine.id },
            data: updateData,
        });
    }
}
