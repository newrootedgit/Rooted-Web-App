import type { PrismaClient } from '../../generated/prisma/client.js';
import type { Machine } from '../types.js';
import { getMachinesByFarm } from '../queries/getMachinesByFarm.js';

export async function listMachines(
  prisma: PrismaClient,
  tenantId: string,
  farmId: string
): Promise<Machine[]> {
  return getMachinesByFarm(prisma, tenantId, farmId);
}
