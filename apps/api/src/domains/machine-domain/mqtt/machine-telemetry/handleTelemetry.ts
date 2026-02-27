import { prisma } from '../../../../lib/db/index.js';

interface TelemetryPayload {
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
    udp_fail_count?: number;
    event_code?: string;
    event_value?: number;
}

type MachineAggregateUpdate = {
    total_steps?: bigint;
    total_uptime_ms?: bigint;
    current_boot_id?: bigint;
    current_boot_uptime_ms?: bigint;
    reboot_count?: number;
    belt_fault_count?: number;
    blade_fault_count?: number;
    last_belt_fault?: number;
    last_blade_fault?: number;
};

export async function handleTelemetry(deviceId: string, payload: TelemetryPayload): Promise<void> {
    const { type } = payload;

    if (type !== 'status_update' && type !== 'event') {
        console.warn(`[MQTT] handleTelemetry: unknown type "${type}" for device ${deviceId}, skipping`);
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

    // Compute running aggregates for status_update rows only
    const aggregateData: MachineAggregateUpdate = {};

    if (type === 'status_update') {
        if (payload.delta_steps != null) {
            aggregateData.total_steps = machine.total_steps + BigInt(payload.delta_steps);
        }

        if (payload.boot_id != null && payload.uptime_ms != null) {
            const newBootId = BigInt(payload.boot_id);
            const newUptimeMs = BigInt(payload.uptime_ms);

            if (machine.current_boot_id === null || newBootId !== machine.current_boot_id) {
                // New boot detected — archive the completed session
                aggregateData.total_uptime_ms = machine.total_uptime_ms + machine.current_boot_uptime_ms;
                aggregateData.current_boot_id = newBootId;
                aggregateData.current_boot_uptime_ms = newUptimeMs;
                aggregateData.reboot_count = machine.reboot_count + (machine.current_boot_id !== null ? 1 : 0);
            } else {
                // Same boot — advance the high-water mark
                aggregateData.current_boot_uptime_ms =
                    newUptimeMs > machine.current_boot_uptime_ms ? newUptimeMs : machine.current_boot_uptime_ms;
            }
        }

        if (payload.belt_fault != null) {
            if (payload.belt_fault > 0 && machine.last_belt_fault === 0) {
                aggregateData.belt_fault_count = machine.belt_fault_count + 1;
            }
            aggregateData.last_belt_fault = payload.belt_fault;
        }

        if (payload.blade_fault != null) {
            if (payload.blade_fault > 0 && machine.last_blade_fault === 0) {
                aggregateData.blade_fault_count = machine.blade_fault_count + 1;
            }
            aggregateData.last_blade_fault = payload.blade_fault;
        }
    }

    await prisma.$transaction([
        prisma.machine_telemetry.create({
            data: {
                machine_id:     machine.id,
                session_id:     payload.session_id ?? null,
                received_at:    now,
                type:           payload.type ?? null,
                schema_ver:     payload.schema_ver ?? null,
                boot_id:        payload.boot_id     != null ? BigInt(payload.boot_id)    : null,
                seq:            payload.seq         ?? null,
                uptime_ms:      payload.uptime_ms   != null ? BigInt(payload.uptime_ms)  : null,
                uptime_s:       payload.uptime_s    ?? null,
                delta_steps:    payload.delta_steps ?? null,
                torque_pct:     payload.torque_pct  ?? null,
                belt_fault:     payload.belt_fault  ?? null,
                blade_fault:    payload.blade_fault ?? null,
                alert_bits:     payload.alert_bits  ?? null,
                kill_switch:    payload.kill_switch ?? null,
                cmd_age_ms:     payload.cmd_age_ms  ?? null,
                udp_fail_count: payload.udp_fail_count ?? null,
                event_code:     payload.event_code  ?? null,
                event_value:    payload.event_value ?? null,
            },
        }),
        prisma.machines.update({
            where: { id: machine.id },
            data: { last_seen_at: now, ...aggregateData },
        }),
    ]);
}
