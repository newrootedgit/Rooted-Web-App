import { prisma } from '../../../../lib/db/index.js';

type LockedMachineBase = {
    current_boot_id: bigint | null;
    current_boot_uptime_ms: bigint;
    total_uptime_ms: bigint;
    reboot_count: number;
    belt_fault_count: number;
    blade_fault_count: number;
    last_belt_fault: number;
    last_blade_fault: number;
    current_belt_motor_uptime_ms: bigint;
    total_belt_motor_uptime_ms: bigint;
    current_blade_motor_uptime_ms: bigint;
    total_blade_motor_uptime_ms: bigint;
    last_raw_belt_motor_uptime_ms: bigint;
    last_raw_blade_motor_uptime_ms: bigint;
    last_motor_boot_id: bigint | null;
};

type LockedMachineWithTray = LockedMachineBase & {
    tray_count: number;
    last_raw_tray_count: number;
};

let warnedTrayColumnsMissing = false;

function isMissingTrayColumnError(error: unknown): boolean {
    const code = typeof error === 'object' && error !== null && 'code' in error
        ? String((error as { code?: unknown }).code)
        : '';
    const metaColumn = typeof error === 'object' && error !== null && 'meta' in error
        ? String((error as { meta?: { column?: unknown } }).meta?.column ?? '')
        : '';
    const message = error instanceof Error ? error.message : String(error);

    return (
        (code === 'P2022' && (metaColumn.includes('tray_count') || metaColumn.includes('last_raw_tray_count'))) ||
        message.includes('machines.tray_count') ||
        message.includes('machines.last_raw_tray_count') ||
        message.includes('"tray_count" does not exist') ||
        message.includes('"last_raw_tray_count" does not exist')
    );
}

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

    console.log(`[MQTT] handleTelemetry: received batch of ${payloads.length} payloads for device ${deviceId}, ${valid.length} valid`);

    if (valid.length === 0) {
        if (payloads.length > 0) {
            console.warn(`[MQTT] handleTelemetry: no valid types in batch of ${payloads.length} for device ${deviceId}, skipping`);
        }
        return;
    }

    const machine = await prisma.machines.findFirst({
        where: { device_id: deviceId },
        select: { id: true },
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
        p.blade_fault != null ||
        p.trays_processed != null ||
        p.belt_motor_uptime_ms != null ||
        p.blade_motor_uptime_ms != null
    );

    if (hasStatefulUpdates) {
        await prisma.$transaction(async (tx) => {
            // Lock the machine row
            let trayColumnsAvailable = true;
            let locked: LockedMachineBase | LockedMachineWithTray;

            try {
                [locked] = await tx.$queryRawUnsafe<Array<LockedMachineWithTray>>(
                    `SELECT current_boot_id, current_boot_uptime_ms, total_uptime_ms,
                            reboot_count, belt_fault_count, blade_fault_count,
                            tray_count, last_raw_tray_count,
                            last_belt_fault, last_blade_fault,
                            current_belt_motor_uptime_ms, total_belt_motor_uptime_ms,
                            current_blade_motor_uptime_ms, total_blade_motor_uptime_ms,
                            last_raw_belt_motor_uptime_ms, last_raw_blade_motor_uptime_ms,
                            last_motor_boot_id
                     FROM machines WHERE id = $1::uuid FOR UPDATE`,
                    machine.id
                );
            } catch (error) {
                if (!isMissingTrayColumnError(error)) {
                    throw error;
                }
                trayColumnsAvailable = false;
                if (!warnedTrayColumnsMissing) {
                    warnedTrayColumnsMissing = true;
                    console.warn('[MQTT] tray_count columns missing on machines table; continuing without tray aggregation until migrations are applied');
                }
                [locked] = await tx.$queryRawUnsafe<Array<LockedMachineBase>>(
                    `SELECT current_boot_id, current_boot_uptime_ms, total_uptime_ms,
                            reboot_count, belt_fault_count, blade_fault_count,
                            last_belt_fault, last_blade_fault,
                            current_belt_motor_uptime_ms, total_belt_motor_uptime_ms,
                            current_blade_motor_uptime_ms, total_blade_motor_uptime_ms,
                            last_raw_belt_motor_uptime_ms, last_raw_blade_motor_uptime_ms,
                            last_motor_boot_id
                     FROM machines WHERE id = $1::uuid FOR UPDATE`,
                    machine.id
                );
            }

            // Walk status_updates in order for boot/fault state transitions

            let currentBootId = locked.current_boot_id;
            let currentBootUptimeMs = locked.current_boot_uptime_ms;
            let totalUptimeMs = locked.total_uptime_ms;
            let rebootCount = locked.reboot_count;
            let beltFaultCount = locked.belt_fault_count;
            let bladeFaultCount = locked.blade_fault_count;
            let trayCount = trayColumnsAvailable ? (locked as LockedMachineWithTray).tray_count : 0;
            let lastRawTrayCount = trayColumnsAvailable ? (locked as LockedMachineWithTray).last_raw_tray_count : 0;
            let lastBeltFault = locked.last_belt_fault;
            let lastBladeFault = locked.last_blade_fault;

            let currentBeltMotorUptimeMs = locked.current_belt_motor_uptime_ms;
            let totalBeltMotorUptimeMs = locked.total_belt_motor_uptime_ms;
            let currentBladeMotorUptimeMs = locked.current_blade_motor_uptime_ms;
            let totalBladeMotorUptimeMs = locked.total_blade_motor_uptime_ms;
            let lastRawBelt = locked.last_raw_belt_motor_uptime_ms;
            let lastRawBlade = locked.last_raw_blade_motor_uptime_ms;
            let lastMotorBootId = locked.last_motor_boot_id;

            let bootChanged = false;
            let faultChanged = false;
            let trayChanged = false;
            let motorChanged = false;

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

                // Tray count tracking (raw per-session counter -> accumulated total)
                if (p.trays_processed != null) {
                    const rawTrayCount = p.trays_processed;

                    if (rawTrayCount < lastRawTrayCount) {
                        // New session detected by counter reset: archive completed session total
                        trayCount += lastRawTrayCount;
                        lastRawTrayCount = rawTrayCount;
                    } else if (rawTrayCount > lastRawTrayCount) {
                        // Same session: accumulate incremental delta
                        trayCount += rawTrayCount - lastRawTrayCount;
                        lastRawTrayCount = rawTrayCount;
                    }

                    trayChanged = true;
                }

                // Detect new motor session via boot_id change
                const motorBootId = p.boot_id != null ? BigInt(p.boot_id) : null;
                const isNewMotorBoot = motorBootId !== null &&
                    lastMotorBootId !== null &&
                    motorBootId !== lastMotorBootId;

                // Belt motor uptime tracking (delta-based)
                if (p.belt_motor_uptime_ms != null) {
                    const newRaw = BigInt(p.belt_motor_uptime_ms);
                    const isNewSession = isNewMotorBoot || newRaw < lastRawBelt;

                    if (isNewSession) {
                        // Archive completed session, reset delta
                        totalBeltMotorUptimeMs = totalBeltMotorUptimeMs + currentBeltMotorUptimeMs;
                        currentBeltMotorUptimeMs = BigInt(0);
                        lastRawBelt = newRaw;
                    } else if (newRaw > lastRawBelt) {
                        // Accumulate incremental delta
                        currentBeltMotorUptimeMs = currentBeltMotorUptimeMs + (newRaw - lastRawBelt);
                        lastRawBelt = newRaw;
                    }
                    motorChanged = true;
                }

                // Blade motor uptime tracking (delta-based)
                if (p.blade_motor_uptime_ms != null) {
                    const newRaw = BigInt(p.blade_motor_uptime_ms);
                    const isNewSession = isNewMotorBoot || newRaw < lastRawBlade;

                    if (isNewSession) {
                        // Archive completed session, reset delta
                        totalBladeMotorUptimeMs = totalBladeMotorUptimeMs + currentBladeMotorUptimeMs;
                        currentBladeMotorUptimeMs = BigInt(0);
                        lastRawBlade = newRaw;
                    } else if (newRaw > lastRawBlade) {
                        // Accumulate incremental delta
                        currentBladeMotorUptimeMs = currentBladeMotorUptimeMs + (newRaw - lastRawBlade);
                        lastRawBlade = newRaw;
                    }
                    motorChanged = true;
                }

                // Track the motor boot_id after processing both motors
                if (motorBootId !== null) {
                    lastMotorBootId = motorBootId;
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
            if (trayChanged && trayColumnsAvailable) {
                updateData.tray_count = trayCount;
                updateData.last_raw_tray_count = lastRawTrayCount;
            }
            if (motorChanged) {
                updateData.current_belt_motor_uptime_ms = currentBeltMotorUptimeMs;
                updateData.total_belt_motor_uptime_ms = totalBeltMotorUptimeMs;
                updateData.current_blade_motor_uptime_ms = currentBladeMotorUptimeMs;
                updateData.total_blade_motor_uptime_ms = totalBladeMotorUptimeMs;
                updateData.last_raw_belt_motor_uptime_ms = lastRawBelt;
                updateData.last_raw_blade_motor_uptime_ms = lastRawBlade;
                updateData.last_motor_boot_id = lastMotorBootId;
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
