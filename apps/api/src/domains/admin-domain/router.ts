import { router, adminProcedure } from '../../lib/trpc/trpc.js';
import { getAllTenants } from './queries/getAllTenants.js';
import { getTenantMachines } from './queries/getTenantMachines.js';
import { getTenantMachinesInput } from './types.js';

export const adminRouter = router({
  getAllTenants: adminProcedure.query(({ ctx }) => getAllTenants(ctx.prisma)),
  
  getTenantMachines: adminProcedure
    .input(getTenantMachinesInput)
    .query(({ ctx, input }) => getTenantMachines(ctx.prisma, input.tenantId)),
});
