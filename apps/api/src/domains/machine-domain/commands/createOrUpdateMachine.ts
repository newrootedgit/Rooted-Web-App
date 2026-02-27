import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { AddMachineInput, Machine } from '../types.js';
import { findMachineByDeviceId } from '../queries/findMachineByDeviceId.js';

export async function createOrUpdateMachine(
  prisma: PrismaClient,
  input: AddMachineInput,
  tenantId: string,
  farmId: string | null
): Promise<Machine> {
  const existing = await findMachineByDeviceId(prisma, input.deviceId);

  let machine;
  if (existing) {
    machine = await prisma.machines.update({
      where: { id: existing.id },
      data: {
        name: input.name,
        display_name: input.displayName ?? input.name,
        tenant_id: tenantId,
        farm_id: farmId,
        current_wifi_ssid: input.currentWifiSsid ?? null,
      },
    });
  } else {
    machine = await prisma.machines.create({
      data: {
        tenant_id: tenantId,
        farm_id: farmId,
        name: input.name,
        display_name: input.displayName ?? input.name,
        device_id: input.deviceId,
        current_wifi_ssid: input.currentWifiSsid ?? null,
      },
    });
  }

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
