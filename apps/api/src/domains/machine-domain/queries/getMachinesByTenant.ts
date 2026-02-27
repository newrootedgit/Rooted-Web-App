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

  return machines.map((m) => {
    const latestEvent = m.machine_telemetry[0];

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
      lastEventCode: latestEvent?.event_code ?? null,
      lastEventValue: latestEvent?.event_value ?? null,
      lastEventAt: latestEvent?.received_at ?? null,
    };
  });
}
