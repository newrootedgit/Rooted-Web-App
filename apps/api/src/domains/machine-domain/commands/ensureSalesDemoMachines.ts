import { Prisma, type PrismaClient } from '../../../generated/prisma/client.js';
import { requireAdmin } from '../../../lib/auth/admin.js';
import {
  DEMO_HARVESTER_CONFIG,
  DEMO_SEEDER_CONFIG,
} from '../mqtt/machine-presets/demoConfig.js';

interface SalesDemoMachineDefinition {
  name: string;
  displayName: string;
  deviceId: string;
  legacyDeviceIds?: string[];
  demoConfig: Prisma.InputJsonValue;
}

export interface EnsureSalesDemoMachinesResult {
  machinesCreated: number;
  machinesUpdated: number;
}

export async function ensureSalesDemoMachines(
  prisma: PrismaClient,
  userId: string,
  tenantId: string,
  farmId: string
): Promise<EnsureSalesDemoMachinesResult> {
  await requireAdmin(userId);

  const demos: SalesDemoMachineDefinition[] = [
    {
      name: 'HARVESTER',
      displayName: 'Demo Harvester',
      deviceId: `demo-harvester-${farmId}`,
      legacyDeviceIds: [`demo-${farmId}`],
      demoConfig: DEMO_HARVESTER_CONFIG as unknown as Prisma.InputJsonValue,
    },
    {
      name: 'SEEDER',
      displayName: 'Demo Seeder',
      deviceId: `demo-seeder-${farmId}`,
      demoConfig: DEMO_SEEDER_CONFIG as unknown as Prisma.InputJsonValue,
    },
  ];

  let machinesCreated = 0;
  let machinesUpdated = 0;

  for (const demo of demos) {
    const existing = await prisma.machines.findFirst({
      where: {
        tenant_id: tenantId,
        farm_id: farmId,
        is_demo: true,
        OR: [
          { device_id: demo.deviceId },
          ...(demo.legacyDeviceIds ?? []).map((deviceId) => ({ device_id: deviceId })),
          { display_name: demo.displayName },
          { name: demo.name },
        ],
      },
    });

    const data = {
      tenant_id: tenantId,
      farm_id: farmId,
      name: demo.name,
      display_name: demo.displayName,
      device_id: demo.deviceId,
      status: 'online',
      current_wifi_ssid: 'DEMO_NETWORK',
      is_demo: true,
      demo_config: demo.demoConfig,
      last_seen_at: new Date(),
    };

    if (existing) {
      await prisma.machines.update({
        where: { id: existing.id },
        data,
      });
      machinesUpdated += 1;
      continue;
    }

    await prisma.machines.create({ data });
    machinesCreated += 1;
  }

  return { machinesCreated, machinesUpdated };
}
