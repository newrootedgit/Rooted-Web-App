import { router, authedProcedure } from '../../lib/trpc/trpc.js';
import { getUserFarms } from './commands/getUserFarms.js';

export const userRouter = router({
  getFarms: authedProcedure.query(({ ctx }) =>
    getUserFarms(ctx.prisma, ctx.userId)
  ),
});
