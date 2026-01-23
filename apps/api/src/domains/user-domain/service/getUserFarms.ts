import type { PrismaClient } from '../../../generated/prisma/client.js';
import type { UserFarm } from '../types.js';

export async function getUserFarms(
  prisma: PrismaClient,
  userId: string
): Promise<UserFarm[]> {
  const farmUsers = await prisma.farm_users.findMany({
    where: { clerk_user_id: userId, is_active: true },
    include: { farms: true },
  });

  return farmUsers
    .filter((fu) => fu.farms)
    .map((fu) => ({
      farmId: fu.farms!.id,
      name: fu.farms!.name,
      slug: fu.farms!.slug,
      role: fu.role,
    }));
}
