import { findMachineByDeviceId } from '../queries/findMachineByDeviceId.js';
export async function createOrUpdateMachine(prisma, input, tenantId, farmId) {
    const existing = await findMachineByDeviceId(prisma, input.deviceId);
    let machine;
    if (existing) {
        machine = await prisma.machines.update({
            where: { id: existing.id },
            data: {
                name: input.name,
                display_name: input.displayName ?? input.name,
                tenant_id: tenantId,
                farm_id: farmId,
            },
        });
    }
    else {
        machine = await prisma.machines.create({
            data: {
                tenant_id: tenantId,
                farm_id: farmId,
                name: input.name,
                display_name: input.displayName ?? input.name,
                device_id: input.deviceId,
            },
        });
    }
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
//# sourceMappingURL=createOrUpdateMachine.js.map