import { router, adminProcedure } from '../../lib/trpc/trpc.js';
import { getAllTenants } from './queries/getAllTenants.js';
import { getMachineFaults } from './queries/getMachineFaults.js';
import { getTenantMachines } from './queries/getTenantMachines.js';
import { getTenantFarms } from './queries/getTenantFarms.js';
import { listGlobalPartTypes } from './queries/listPartTypes.js';
import { deleteMachine } from './mutations/deleteMachine.js';
import { deleteFarm } from './mutations/deleteFarm.js';
import { upsertPartType, deletePartType } from './mutations/upsertPartType.js';
import { getTenantMachinesInput, getTenantFarmsInput, deleteMachineInput, getMachineFaultsInput, deleteFarmInput, upsertPartTypeInput, deletePartTypeInput } from './types.js';

export const adminRouter = router({
  getAllTenants: adminProcedure.query(({ ctx }) => getAllTenants(ctx.prisma)),
  
  getTenantMachines: adminProcedure
    .input(getTenantMachinesInput)
    .query(({ ctx, input }) => getTenantMachines(ctx.prisma, input.tenantId)),

  getMachineFaults: adminProcedure
    .input(getMachineFaultsInput)
    .query(({ ctx, input }) => getMachineFaults(ctx.prisma, input.machineId)),

  getTenantFarms: adminProcedure
    .input(getTenantFarmsInput)
    .query(({ ctx, input }) => getTenantFarms(ctx.prisma, input.tenantId)),
  deleteMachine: adminProcedure
    .input(deleteMachineInput)
    .mutation(({ input }) => deleteMachine(input.machineId)),

  deleteFarm: adminProcedure
    .input(deleteFarmInput)
    .mutation(({ input }) => deleteFarm(input.farmId)),

  listPartTypes: adminProcedure.query(({ ctx }) => listGlobalPartTypes(ctx.prisma)),

  upsertPartType: adminProcedure
    .input(upsertPartTypeInput)
    .mutation(({ ctx, input }) => upsertPartType(ctx.prisma, input)),

  deletePartType: adminProcedure
    .input(deletePartTypeInput)
    .mutation(({ ctx, input }) => deletePartType(ctx.prisma, input.id)),
});
