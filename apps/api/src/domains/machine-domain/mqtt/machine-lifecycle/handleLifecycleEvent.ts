import { prisma } from "../../../../lib/db/index.js";


interface LifecycleEventInput { 
    deviceId: string;
    eventType: 'connected' | 'disconnected';
    timestamp: string;
    sessionId?: string;
    wifiSsid?: string;
}

interface LifecyclePayload { 
    clientId: string; 
    timestamp: number; 
    eventType: 'connected' | 'disconnected';
    sessionIdentifier?: string;
    wifiSsid?: string;
}

const IGNORED_CLIENT_ID_PREFIXES = ['rooted-api-'];

export async function handleLifecycleEvent(payload: LifecyclePayload): Promise<void> {
    const { clientId, timestamp, eventType, sessionIdentifier, wifiSsid } = payload;

    if (IGNORED_CLIENT_ID_PREFIXES.some((prefix) => clientId.startsWith(prefix))) {
        return;
    }

    const machine = await prisma.machines.findFirst({
        where: { device_id: clientId },
    });

    if (!machine) {
        console.debug(`[MQTT] Lifecycle event for unknown device, ignoring: ${clientId}`);
        return;
    }

    await prisma.machines.update({
        where: { id: machine.id },
        data: {
            status: eventType === 'connected' ? 'online' : 'offline',
            last_seen_at: new Date(timestamp),
            current_wifi_ssid: wifiSsid || machine.current_wifi_ssid,
        },
    });
}


