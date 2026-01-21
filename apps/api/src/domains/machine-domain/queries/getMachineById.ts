import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { Machine } from '../types.js';

export async function getMachineById(
  prisma: PrismaClient,
  id: string,
  tenantId: string,
  farmId: string
): Promise<Machine | null> {
  const machine = await prisma.machines.findFirst({
    where: {
      id,
      tenant_id: tenantId,
      farm_id: farmId,
    },
  });

  if (!machine) return null;

  return {
    id: machine.id,
    tenantId: machine.tenant_id,
    farmId: machine.farm_id,
    name: machine.name,
    deviceId: machine.device_id,
    createdAt: machine.created_at,
  };
}
