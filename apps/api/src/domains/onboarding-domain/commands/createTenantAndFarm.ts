import type { PrismaClient, Prisma } from '../../../generated/prisma/client.js';
import type { CreateTenantAndFarmInput, CreateTenantAndFarmResult } from '../types.js';
import { DEFAULT_DEMO_MACHINE_CONFIG } from '../../machine-domain/mqtt/machine-presets/demoConfig.js';

const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

const ensureUniqueSlug = async (prisma: PrismaClient, baseSlug: string): Promise<string> => {
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const [existingFarm, existingTenant] = await Promise.all([
      prisma.farms.findUnique({ where: { slug } }),
      prisma.tenants.findUnique({ where: { slug } }),
    ]);
    if (!existingFarm && !existingTenant) return slug;
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
};

export const createTenantAndFarm = async (
  prisma: PrismaClient,
  userId: string,
  input: CreateTenantAndFarmInput
): Promise<CreateTenantAndFarmResult> => {
  const farmUser = await prisma.farm_users.findFirst({
    where: { clerk_user_id: userId, is_active: true },
  });

  if (!farmUser) {
    throw new Error('User not found');
  }

  if (farmUser.farm_id) {
    throw new Error('User already has a farm');
  }

  const baseSlug = generateSlug(input.farmName);
  const slug = await ensureUniqueSlug(prisma, baseSlug);

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const tenant = await tx.tenants.create({
      data: {
        name: input.farmName,
        slug,
      },
    });

    const farm = await tx.farms.create({
      data: {
        tenants: {
          connect: { id: tenant.id },
        },
        name: input.farmName,
        slug,
      },
    });

    await tx.farm_users.update({
      where: { id: farmUser.id },
      data: { tenant_id: tenant.id, farm_id: farm.id },
    });

    await tx.machines.create({
      data: {
        tenant_id: tenant.id,
        farm_id: farm.id,
        name: 'HARVESTER',
        display_name: 'Demo Harvester',
        device_id: `demo-${farm.id}`,
        status: 'online',
        current_wifi_ssid: 'DEMO_NETWORK',
        is_demo: true,
        demo_config: DEFAULT_DEMO_MACHINE_CONFIG,
        last_seen_at: new Date(),
      },
    });

    return {
      tenantId: tenant.id,
      farmId: farm.id,
      farmSlug: slug,
    };
  });

  return result;
};
