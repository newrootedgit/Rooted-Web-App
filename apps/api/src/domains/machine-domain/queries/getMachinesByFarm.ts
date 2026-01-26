import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { Machine } from '../types.js';

export async function getMachinesByFarm(
  prisma: PrismaClient,
  tenantId: string,
  farmId: string
): Promise<Machine[]> {
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
    displayName: m.display_name,
    deviceId: m.device_id,
    createdAt: m.created_at,
  }));
}
