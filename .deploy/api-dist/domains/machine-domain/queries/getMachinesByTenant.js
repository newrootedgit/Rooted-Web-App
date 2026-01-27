export async function getMachinesByTenant(prisma, tenantId, farmId, options) {
    const where = {
        tenant_id: tenantId,
    };
    if (farmId) {
        where.farm_id = farmId;
    }
    const machines = await prisma.machines.findMany({
        where,
        ...options,
    });
    return machines.map((m) => ({
        id: m.id,
        tenantId: m.tenant_id,
        farmId: m.farm_id,
        name: m.name,
        displayName: m.display_name,
        deviceId: m.device_id,
        createdAt: m.created_at,
        awsIotThingName: m.aws_iot_thing_name,
        status: m.status,
        lastSeenAt: m.last_seen_at,
        currentWifiSsid: m.current_wifi_ssid,
    }));
}
//# sourceMappingURL=getMachinesByTenant.js.map