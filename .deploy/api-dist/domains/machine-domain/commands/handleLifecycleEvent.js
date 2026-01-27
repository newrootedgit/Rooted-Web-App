export async function handleLifecycleEvent(prisma, input) {
    const machine = await prisma.machines.findFirst({
        where: { device_id: input.deviceId },
    });
    if (!machine) {
        throw new Error(`Machine not found: ${input.deviceId}`);
    }
    await prisma.machines.update({
        where: { id: machine.id },
        data: {
            status: input.eventType === 'connected' ? 'online' : 'offline',
            last_seen_at: new Date(input.timestamp),
            current_wifi_ssid: input.eventType === 'connected' ? input.wifiSsid : null,
        },
    });
}
//# sourceMappingURL=handleLifecycleEvent.js.map