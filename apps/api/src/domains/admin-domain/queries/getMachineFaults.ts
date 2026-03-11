import type { PrismaClient } from '../../../generated/prisma/client.js';
import { listFaults, type MachineFault } from '../../machine-domain/queries/listFaults.js';

export async function getMachineFaults(
  prisma: PrismaClient,
  machineId: string,
): Promise<MachineFault[]> {
  return listFaults(prisma, machineId);
}
