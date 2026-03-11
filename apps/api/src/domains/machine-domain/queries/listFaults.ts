import type { PrismaClient } from '../../../generated/prisma/client.js';

export interface MachineFault {
  id: string;
  faultType: string;
  motor: string | null;
  torquePct: number | null;
  eventCode: string | null;
  createdAt: Date;
}

export async function listFaults(
  prisma: PrismaClient,
  machineId: string,
  tenantId?: string | null,
): Promise<MachineFault[]> {
  const machine = await prisma.machines.findFirst({
    where: {
      id: machineId,
      ...(tenantId ? { tenant_id: tenantId } : {}),
    },
    select: { id: true },
  });

  if (!machine) return [];

  const faults = await prisma.machine_faults.findMany({
    where: { machine_id: machineId },
    orderBy: { created_at: 'desc' },
    take: 100,
  });

  return faults.map((f) => ({
    id: f.id,
    faultType: f.fault_type,
    motor: f.motor ?? null,
    torquePct: f.torque_pct ?? null,
    eventCode: f.event_code ?? null,
    createdAt: f.created_at,
  }));
}
