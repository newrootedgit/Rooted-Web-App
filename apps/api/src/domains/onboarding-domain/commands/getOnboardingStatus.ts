import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { OnboardingStatus } from '../types.js';

export async function getOnboardingStatus(
  prisma: PrismaClient,
  userId: string
): Promise<OnboardingStatus> {
  const farmUser = await prisma.farm_users.findFirst({
    where: { clerk_user_id: userId, is_active: true },
    include: { farms: true },
  });

  if (!farmUser) {
    await prisma.farm_users.create({
      data: {
        clerk_user_id: userId,
        email: '',
        first_name: '',
        last_name: '',
        role: 'FARM_OWNER',
        is_active: true,
        farm_id: null,
      },
    });
    return { needsOnboarding: true, status: 'no_farm' };
  }

  if (!farmUser.farm_id || !farmUser.farms) {
    return { needsOnboarding: true, status: 'no_farm' };
  }

  return {
    needsOnboarding: false,
    status: 'has_farm',
    farm: {
      id: farmUser.farms.id,
      name: farmUser.farms.name,
      slug: farmUser.farms.slug,
      tenantId: farmUser.farms.tenant_id!,
    },
  };
}
