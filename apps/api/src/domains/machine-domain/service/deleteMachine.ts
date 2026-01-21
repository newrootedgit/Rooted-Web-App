import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../generated/prisma/client.js';
import { findMachineByDeviceId } from '../queries/findMachineByDeviceId.js';

export async function deleteMachine(
  prisma: PrismaClient,
  deviceId: string,
  tenantId: string
): Promise<{ success: boolean }> {
  const machine = await findMachineByDeviceId(prisma, deviceId)
  if (!machine) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Machine not found',
    });
  }

  await prisma.machines.delete({
    where: { id: machine.id },
  });

  return { success: true };
}
