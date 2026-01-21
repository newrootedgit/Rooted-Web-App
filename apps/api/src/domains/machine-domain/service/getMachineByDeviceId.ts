import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { Machine } from '../types.js';
import { findMachineByDeviceId } from '../queries/findMachineByDeviceId.js';

export async function getMachineByDeviceId(
  prisma: PrismaClient,
  deviceId: string
): Promise<Machine | null> {
  return findMachineByDeviceId(prisma, deviceId);
}
