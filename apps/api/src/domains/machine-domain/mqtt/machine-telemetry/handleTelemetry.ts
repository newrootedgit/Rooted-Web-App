import { prisma } from '../../../../lib/db/index.js';
import { timescale } from '../../../../lib/db/timescale.js';

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
    roller_motor_uptime_ms?: number;
    udp_fail_count?: number;
    event_code?: string;
    event_value?: number;
    trays_processed?: number;
    received_at?: number;
    fault_type?: string;
    motor?: string;
}

export async function handleTelemetry(deviceId: string, payloads: TelemetryPayload[]): Promise<void> {
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

    // 1. Insert raw telemetry into TimescaleDB with ON CONFLICT DO NOTHING for dedup
    if (timescale) {
        let client;
        try {
            client = await timescale.connect();
            for (const p of valid) {
                const receivedAt = p.received_at
                    ? new Date(p.received_at * 1000)
                    : now;

                await client.query(
                    `INSERT INTO raw_telemetry (
                        machine_id, session_id, received_at, type, schema_ver,
                        boot_id, seq, uptime_ms, uptime_s, delta_steps,
                        torque_pct, belt_fault, blade_fault, alert_bits, kill_switch,
                        cmd_age_ms, udp_fail_count, belt_motor_uptime_ms, blade_motor_uptime_ms, roller_motor_uptime_ms,
                        event_code, event_value, trays_processed,
                        fault_type, motor
                    ) VALUES (
                        $1, $2, $3, $4, $5,
                        $6, $7, $8, $9, $10,
                        $11, $12, $13, $14, $15,
                        $16, $17, $18, $19, $20,
                        $21, $22, $23,
                        $24, $25
                    ) ON CONFLICT DO NOTHING`,
                    [
                        machine.id, p.session_id ?? null, receivedAt, p.type ?? null, p.schema_ver ?? null,
                        p.boot_id ?? null, p.seq ?? null, p.uptime_ms ?? null, p.uptime_s ?? null, p.delta_steps ?? null,
                        p.torque_pct ?? null, p.belt_fault ?? null, p.blade_fault ?? null, p.alert_bits ?? null, p.kill_switch ?? null,
                        p.cmd_age_ms ?? null, p.udp_fail_count ?? null, p.belt_motor_uptime_ms ?? null, p.blade_motor_uptime_ms ?? null, p.roller_motor_uptime_ms ?? null,
                        p.event_code ?? null, p.event_value ?? null, p.trays_processed ?? null,
                        p.fault_type ?? null, p.motor ?? null,
                    ]
                );
            }
        } catch (err) {
            console.error('[MQTT] TimescaleDB insert failed:', err);
        } finally {
            if (client) client.release();
        }
    }

    // 2. Update last_seen_at on RDS
    await prisma.machines.update({
        where: { id: machine.id },
        data: { last_seen_at: now },
    });

    // 3. Route fault events to machine_faults in RDS
    // Any EVENT frame with an event_code starting with "FAULT_" creates a fault row
    const faultRows: Array<{ machine_id: string; fault_type: string; fault_value: number; event_code: string | null; motor: string | null; torque_pct: number | null }> = [];
    for (const p of valid) {
        if (p.type === 'event' && p.event_code && p.event_code.startsWith('FAULT_')) {
            faultRows.push({
                machine_id: machine.id,
                fault_type: p.event_code,
                fault_value: p.event_value ?? 1,
                event_code: p.event_code,
                motor: p.motor ?? null,
                torque_pct: p.torque_pct ?? null,
            });
        }
    }

    if (faultRows.length > 0) {
        await prisma.machine_faults.createMany({ data: faultRows });
    }
}
