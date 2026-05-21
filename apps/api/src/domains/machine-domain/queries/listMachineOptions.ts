import type { PrismaClient } from '../../../generated/prisma/client.js';

export interface MachineOption {
  id: string;
  name: string;
  displayName: string | null;
  deviceId: string;
  status: string | null;
  lastSeenAt: Date | null;
  isDemo: boolean;
  tenantName: string | null;
  farmName: string | null;
}

export async function listMachineOptions(
  prisma: PrismaClient,
  tenantId: string | null,
  farmId: string | null
): Promise<MachineOption[]> {
  // Admin bypass: tenantId === null means "all tenants"
  const where: { tenant_id?: string; farm_id?: string } = {};
  if (tenantId) where.tenant_id = tenantId;
  if (farmId) where.farm_id = farmId;

  const machines = await prisma.machines.findMany({
    where,
    select: {
      id: true,
      name: true,
      display_name: true,
      device_id: true,
      status: true,
      last_seen_at: true,
      is_demo: true,
      farms: { select: { name: true } },
      tenants: { select: { name: true } },
    },
    orderBy: [
      { display_name: 'asc' },
      { name: 'asc' },
    ],
  });

  return machines.map((machine) => ({
    id: machine.id,
    name: machine.name,
    displayName: machine.display_name,
    deviceId: machine.device_id,
    status: machine.status,
    lastSeenAt: machine.last_seen_at,
    isDemo: machine.is_demo,
    tenantName: machine.tenants?.name ?? null,
    farmName: machine.farms?.name ?? null,
  }));
}
