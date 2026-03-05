import type { PrismaClient, Prisma } from '../../../generated/prisma/client.js';
import type { Machine } from '../types.js';
import type { PrismaPaginationOptions } from '../../../lib/trpc/pagination/index.js';

export interface GetMachinesByTenantOptions extends PrismaPaginationOptions {
  orderBy: Prisma.machinesOrderByWithRelationInput;
}

export async function getMachinesByTenant(
  prisma: PrismaClient,
  tenantId: string,
  farmId: string | null,
  options: GetMachinesByTenantOptions
): Promise<Machine[]> {
  const where: Prisma.machinesWhereInput = {
    tenant_id: tenantId,
  };

  if (farmId) {
    where.farm_id = farmId;
  }

  const machines = await prisma.machines.findMany({
    where,
    include: {
      machine_telemetry: {
        where: {
          type: 'event',
          event_code: { not: null },
        },
        orderBy: { received_at: 'desc' },
        take: 1,
        select: {
          event_code: true,
          event_value: true,
          received_at: true,
        },
      },
    },
    ...options,
  });

  // Fetch latest status_update per machine for motor uptime fields
  const machineIds = machines.map((m) => m.id);
  const latestStatusRows = machineIds.length > 0
    ? await prisma.machine_telemetry.findMany({
        where: {
          machine_id: { in: machineIds },
          type: 'status_update',
        },
        orderBy: { received_at: 'desc' },
        distinct: ['machine_id'],
        select: {
          machine_id: true,
          belt_motor_uptime_ms: true,
          blade_motor_uptime_ms: true,
        },
      })
    : [];
  const statusByMachine = new Map(latestStatusRows.map((r) => [r.machine_id, r]));

  return machines.map((m) => {
    const latestEvent = m.machine_telemetry[0];
    const latestStatus = statusByMachine.get(m.id);

    return {
      id: m.id,
      tenantId: m.tenant_id,
      farmId: m.farm_id,
      name: m.name,
      displayName: m.display_name,
      deviceId: m.device_id,
      createdAt: m.created_at,
      awsIotThingName: m.aws_iot_thing_name,
      status: m.status as 'online' | 'offline' | undefined,
      lastSeenAt: m.last_seen_at,
      currentWifiSsid: m.current_wifi_ssid,
      totalSteps: m.total_steps.toString(),
      totalUptimeMs: m.total_uptime_ms.toString(),
      currentBootUptimeMs: m.current_boot_uptime_ms.toString(),
      rebootCount: m.reboot_count,
      beltFaultCount: m.belt_fault_count,
      bladeFaultCount: m.blade_fault_count,
      lastBeltFault: m.last_belt_fault,
      lastBladeFault: m.last_blade_fault,
      beltMotorUptimeMs: latestStatus?.belt_motor_uptime_ms?.toString() ?? null,
      bladeMotorUptimeMs: latestStatus?.blade_motor_uptime_ms?.toString() ?? null,
      lastEventCode: latestEvent?.event_code ?? null,
      lastEventValue: latestEvent?.event_value ?? null,
      lastEventAt: latestEvent?.received_at ?? null,
    };
  });
}
