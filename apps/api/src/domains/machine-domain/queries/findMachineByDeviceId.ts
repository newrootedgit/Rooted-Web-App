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
  };
}
