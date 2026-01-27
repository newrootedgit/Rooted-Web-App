export async function getMachineById(prisma, id, tenantId, farmId) {
    const machine = await prisma.machines.findFirst({
        where: {
            id,
            tenant_id: tenantId,
            farm_id: farmId,
        },
    });
    if (!machine)
        return null;
    return {
        id: machine.id,
        tenantId: machine.tenant_id,
        farmId: machine.farm_id,
        name: machine.name,
        displayName: machine.display_name,
        deviceId: machine.device_id,
        createdAt: machine.created_at,
    };
}
//# sourceMappingURL=getMachineById.js.map