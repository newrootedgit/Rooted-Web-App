import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { Machine } from '../types.js';

export async function getMachinesByFarm(
  prisma: PrismaClient,
  tenantId: string,
  farmId: string
): Promise<Machine[]> {
  const machines = await prisma.machines.findMany({
    where: {
      tenant_id: tenantId,
      farm_id: farmId,
    },
    orderBy: {
      created_at: 'desc',
    },
  });

  return machines.map((m) => ({
    id: m.id,
    tenantId: m.tenant_id,
    farmId: m.farm_id,
    name: m.name,
    displayName: m.display_name,
    deviceId: m.device_id,
    currentWifiSsid: m.current_wifi_ssid,
    createdAt: m.created_at,
    awsIotThingName: m.aws_iot_thing_name,
    status: m.status as 'online' | 'offline' | undefined,
    lastSeenAt: m.last_seen_at,
    totalSteps: m.total_steps.toString(),
    totalUptimeMs: m.total_uptime_ms.toString(),
    currentBootUptimeMs: m.current_boot_uptime_ms.toString(),
    rebootCount: m.reboot_count,
    beltFaultCount: m.belt_fault_count,
    bladeFaultCount: m.blade_fault_count,
    lastBeltFault: m.last_belt_fault,
    lastBladeFault: m.last_blade_fault,
  }));
}
