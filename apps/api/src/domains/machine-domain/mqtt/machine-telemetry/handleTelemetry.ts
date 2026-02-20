import { prisma } from '../../../../lib/db/index.js';

interface TelemetryPayload {
    session_id: string;
    uptime_s: number;
    delta_steps: number;
}

export async function handleTelemetry(deviceId: string, payload: TelemetryPayload): Promise<void> {
    const { session_id, uptime_s, delta_steps } = payload;

    const machine = await prisma.machines.findFirst({
        where: { device_id: deviceId },
    });

    if (!machine) {
        console.warn(`[MQTT] handleTelemetry: machine not found for device ID: ${deviceId}`);
        return;
    }

    const now = new Date();

    await prisma.$transaction([
        prisma.machine_telemetry.create({
            data: {
                machine_id: machine.id,
                session_id,
                received_at: now,
                uptime_s,
                delta_steps,
            },
        }),
        prisma.machines.update({
            where: { id: machine.id },
            data: { last_seen_at: now },
        }),
    ]);
}
