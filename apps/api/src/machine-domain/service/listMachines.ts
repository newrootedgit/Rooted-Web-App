import type { PrismaClient } from '../../generated/prisma/client.js';
import type { Machine } from '../types.js';
import { getMachinesByFarm } from '../queries/getMachinesByFarm.js';

export async function listMachines(
  prisma: PrismaClient,
  tenantId: string,
  farmId: string
): Promise<Machine[]> {
  // If no tenant/farm context, return empty list
  // (user needs to set X-Farm-Id header for farm-specific queries)
  if (!tenantId || !farmId) {
    return [];
  }

  return getMachinesByFarm(prisma, tenantId, farmId);
}
