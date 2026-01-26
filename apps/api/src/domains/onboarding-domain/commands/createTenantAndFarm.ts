import type { PrismaClient, Prisma } from '@prisma/client';
import type { CreateTenantAndFarmInput, CreateTenantAndFarmResult } from '../types.js';

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
      data: { farm_id: farm.id },
    });

    return {
      tenantId: tenant.id,
      farmId: farm.id,
      farmSlug: slug,
    };
  });

  return result;
};
