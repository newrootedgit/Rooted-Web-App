import { router, adminProcedure } from '../../lib/trpc/trpc.js';
import { getAllTenants } from './queries/getAllTenants.js';
import { getTenantMachines } from './queries/getTenantMachines.js';
import { getTenantMachinesInput } from './types.js';

export const adminRouter = router({
  getAllTenants: adminProcedure.query(() => getAllTenants()),
  
  getTenantMachines: adminProcedure
    .input(getTenantMachinesInput)
    .query(({ input }) => getTenantMachines(input.tenantId)),
});
