import { router, authedProcedure } from '../../lib/trpc/trpc.js';
import { completeMachineTutorialSchema, createTenantAndFarmSchema } from './types.js';
import { createTenantAndFarm } from './commands/createTenantAndFarm.js';
import { completeMachineTutorial } from './commands/completeMachineTutorial.js';
import { getOnboardingStatus } from './commands/getOnboardingStatus.js';
import { getUserFarms } from '../user-domain/commands/getUserFarms.js';

export const onboardingRouter = router({
  status: authedProcedure.query(({ ctx }) =>
    getOnboardingStatus(ctx.prisma, ctx.userId)
  ),

  createTenantAndFarm: authedProcedure
    .input(createTenantAndFarmSchema)
    .mutation(({ ctx, input }) =>
      createTenantAndFarm(ctx.prisma, ctx.userId, input)
    ),

  completeMachineTutorial: authedProcedure
    .input(completeMachineTutorialSchema)
    .mutation(({ ctx, input }) =>
      completeMachineTutorial(ctx.prisma, ctx.userId, input)
    ),

  farms: authedProcedure.query(({ ctx }) =>
    getUserFarms(ctx.prisma, ctx.userId)
  ),
});
