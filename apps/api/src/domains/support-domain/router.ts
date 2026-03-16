import { router, authedProcedure } from '../../lib/trpc/trpc.js';
import { getUploadUrlSchema, submitTicketSchema } from './types.js';
import { getUploadUrl } from './commands/getUploadUrl.js';
import { submitTicket } from './commands/submitTicket.js';

export const supportRouter = router({
  getUploadUrl: authedProcedure
    .input(getUploadUrlSchema)
    .mutation(({ ctx, input }) => getUploadUrl(ctx.userId, input)),

  submitTicket: authedProcedure
    .input(submitTicketSchema)
    .mutation(({ ctx, input }) => submitTicket(ctx.userId, input)),
});
