import type { PrismaClient } from '../../../generated/prisma/client.js';
import { enrichMachinesWithTelemetry } from '../../machine-domain/queries/enrichMachinesWithTelemetry.js';
import type { Machine } from '../../machine-domain/types.js';

interface MachineFarm {
  id: string;
  name: string;
  slug: string;
}

export interface AdminMachine extends Machine {
  farms: MachineFarm | null;
}

export async function getTenantMachines(prisma: PrismaClient, tenantId: string): Promise<AdminMachine[]> {
  const machines = await prisma.machines.findMany({
    where: { tenant_id: tenantId },
    include: {
      machine_faults: true,
      farms: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
    orderBy: { name: 'asc' },
  });

  const enrichedMachines = await enrichMachinesWithTelemetry(machines);
  const farmsByMachineId = new Map(
    machines.map((machine) => [machine.id, machine.farms ?? null] as const)
  );

  return enrichedMachines.map((machine) => ({
    ...machine,
    farms: farmsByMachineId.get(machine.id) ?? null,
  }));
}
