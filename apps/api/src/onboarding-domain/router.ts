import { router, authedProcedure } from '../lib/trpc/trpc.js';
import { createTenantAndFarmSchema } from './types.js';
import { createTenantAndFarm } from './service/createTenantAndFarm.js';

import type { OnboardingStatus, UserFarm } from './types.js';

export const onboardingRouter = router({
  status: authedProcedure.query(async ({ ctx }): Promise<OnboardingStatus> => {
    let farmUser = await ctx.prisma.farm_users.findFirst({
      where: { clerk_user_id: ctx.userId, is_active: true },
      include: { farms: true },
    });

    if (!farmUser) {
      await ctx.prisma.farm_users.create({
        data: {
          clerk_user_id: ctx.userId,
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
  }),

  createTenantAndFarm: authedProcedure
    .input(createTenantAndFarmSchema)
    .mutation(async ({ ctx, input }) => {
      return createTenantAndFarm(ctx.prisma, ctx.userId, input);
    }),

  farms: authedProcedure.query(async ({ ctx }): Promise<UserFarm[]> => {
    const farmUsers = await ctx.prisma.farm_users.findMany({
      where: { clerk_user_id: ctx.userId, is_active: true },
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
  }),
});
