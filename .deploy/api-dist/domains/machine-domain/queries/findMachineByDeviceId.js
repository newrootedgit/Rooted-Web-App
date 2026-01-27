export async function findMachineByDeviceId(prisma, deviceId) {
    const machine = await prisma.machines.findFirst({
        where: { device_id: deviceId },
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
//# sourceMappingURL=findMachineByDeviceId.js.map