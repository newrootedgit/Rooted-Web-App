import { prisma } from '../../../lib/db/index.js';

export async function deleteFarm(farmId: string): Promise<void> {
  await prisma.farms.delete({
    where: { id: farmId },
  });
}
