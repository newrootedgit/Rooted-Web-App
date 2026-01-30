import { router, adminProcedure } from '../../lib/trpc/trpc.js';
import { getAllTenants } from './queries/getAllTenants.js';
import { getTenantMachines } from './queries/getTenantMachines.js';
import { getTenantFarms } from './queries/getTenantFarms.js';
import { deleteMachine } from './mutations/deleteMachine.js';
import { deleteFarm } from './mutations/deleteFarm.js';
import { getTenantMachinesInput, getTenantFarmsInput, deleteMachineInput, deleteFarmInput } from './types.js';

export const adminRouter = router({
  getAllTenants: adminProcedure.query(({ ctx }) => getAllTenants(ctx.prisma)),
  
  getTenantMachines: adminProcedure
    .input(getTenantMachinesInput)
    .query(({ ctx, input }) => getTenantMachines(ctx.prisma, input.tenantId)),

  getTenantFarms: adminProcedure
    .input(getTenantFarmsInput)
    .query(({ ctx, input }) => getTenantFarms(ctx.prisma, input.tenantId)),
  deleteMachine: adminProcedure
    .input(deleteMachineInput)
    .mutation(({ input }) => deleteMachine(input.machineId)),

  deleteFarm: adminProcedure
    .input(deleteFarmInput)
    .mutation(({ input }) => deleteFarm(input.farmId)),
});
