import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../generated/prisma/client.js';
import type { Machine } from '../types.js';
import { getMachineById } from '../queries/getMachineById.js';

export async function getMachine(
  prisma: PrismaClient,
  id: string,
  tenantId: string,
  farmId: string
): Promise<Machine> {
  const machine = await getMachineById(prisma, id, tenantId, farmId);

  if (!machine) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Machine not found',
    });
  }

  return machine;
}
