import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../generated/prisma/client.js';

export interface MachineVariety {
  id: string;
  activeVariety: number;
  name: string;
  gramsPerTray: number | null;
  startedAt: Date;
}

export async function listMachineVarieties(
  prisma: PrismaClient,
  machineId: string,
  tenantId: string,
  farmId: string
): Promise<MachineVariety[]> {
  const machine = await prisma.machines.findFirst({
    where: { id: machineId, tenant_id: tenantId, farm_id: farmId },
    select: { id: true },
  });

  if (!machine) {
    throw new TRPCError({ code: 'NOT_FOUND', message: 'Machine not found' });
  }

  const rows = await prisma.machine_variety_history.findMany({
    where: { machine_id: machine.id, ended_at: null },
    orderBy: { active_variety: 'asc' },
    select: {
      id: true,
      active_variety: true,
      name: true,
      grams_per_tray: true,
      started_at: true,
    },
  });

  return rows.map((row) => ({
    id: row.id,
    activeVariety: row.active_variety,
    name: row.name,
    gramsPerTray: row.grams_per_tray,
    startedAt: row.started_at,
  }));
}
