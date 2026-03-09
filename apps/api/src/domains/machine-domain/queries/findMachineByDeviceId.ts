import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { Machine } from '../types.js';
import { enrichMachinesWithTelemetry } from './enrichMachinesWithTelemetry.js';

export async function findMachineByDeviceId(
  prisma: PrismaClient,
  deviceId: string
): Promise<Machine | null> {
  const machine = await prisma.machines.findFirst({
    where: { device_id: deviceId },
    include: {
      machine_faults: true,
    },
  });

  if (!machine) return null;

  const enriched = await enrichMachinesWithTelemetry([machine]);
  return enriched[0] ?? null;
}
