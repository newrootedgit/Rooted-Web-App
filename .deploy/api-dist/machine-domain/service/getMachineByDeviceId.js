import { findMachineByDeviceId } from '../queries/findMachineByDeviceId.js';
export async function getMachineByDeviceId(prisma, deviceId) {
    return findMachineByDeviceId(prisma, deviceId);
}
//# sourceMappingURL=getMachineByDeviceId.js.map