import { prisma } from '../../../lib/db/index.js';

export async function deleteMachine(machineId: string): Promise<void> {
  await prisma.machines.delete({
    where: { id: machineId },
  });
}
