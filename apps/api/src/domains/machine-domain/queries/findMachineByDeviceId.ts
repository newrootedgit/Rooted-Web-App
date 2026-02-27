import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { Machine } from '../types.js';

export async function findMachineByDeviceId(
  prisma: PrismaClient,
  deviceId: string
): Promise<Machine | null> {
  const machine= await prisma.machines.findFirst({
    where: { device_id: deviceId },
  });

  if (!machine) return null;

  return {
    id: machine.id,
    tenantId: machine.tenant_id,
    farmId: machine.farm_id,
    name: machine.name,
    displayName: machine.display_name,
    deviceId: machine.device_id,
    currentWifiSsid: machine.current_wifi_ssid,
    createdAt: machine.created_at,
    awsIotThingName: machine.aws_iot_thing_name,
    status: machine.status as 'online' | 'offline' | undefined,
    lastSeenAt: machine.last_seen_at,
    totalSteps: machine.total_steps.toString(),
    totalUptimeMs: machine.total_uptime_ms.toString(),
    currentBootUptimeMs: machine.current_boot_uptime_ms.toString(),
    rebootCount: machine.reboot_count,
    beltFaultCount: machine.belt_fault_count,
    bladeFaultCount: machine.blade_fault_count,
    lastBeltFault: machine.last_belt_fault,
    lastBladeFault: machine.last_blade_fault,
  };
}
