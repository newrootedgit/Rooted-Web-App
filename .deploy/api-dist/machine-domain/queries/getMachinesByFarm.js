export async function getMachinesByFarm(prisma, tenantId, farmId) {
    const machines = await prisma.machines.findMany({
        where: {
            tenant_id: tenantId,
            farm_id: farmId,
        },
        orderBy: {
            created_at: 'desc',
        },
    });
    return machines.map((m) => ({
        id: m.id,
        tenantId: m.tenant_id,
        farmId: m.farm_id,
        name: m.name,
        deviceId: m.device_id,
        createdAt: m.created_at,
    }));
}
//# sourceMappingURL=getMachinesByFarm.js.map