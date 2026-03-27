import { TRPCError } from '@trpc/server';
import { router, farmProcedure } from '../../../lib/trpc/trpc.js';
import {
  getByIdSchema,
  listEmployeesInputSchema,
  createEmployeeSchema,
  updateEmployeeSchema,
} from './types.js';

function mapEmployee(db: any) {
  return {
    id: db.id,
    farmId: db.farm_id,
    firstName: db.first_name,
    lastName: db.last_name,
    email: db.email ?? null,
    phone: db.phone ?? null,
    position: db.position ?? null,
    status: db.status ?? null,
    hireDate: db.hire_date ?? null,
    hourlyRate: db.hourly_rate != null ? Number(db.hourly_rate) : null,
    notes: db.notes ?? null,
    createdAt: db.created_at,
  };
}

async function getEmployeeOrThrow(prisma: any, farmId: string, id: string) {
  const employee = await prisma.employees.findFirst({
    where: { id, farm_id: farmId },
  });
  if (!employee) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Employee not found',
    });
  }
  return employee;
}

export const employeeRouter = router({
  list: farmProcedure
    .input(listEmployeesInputSchema)
    .query(async ({ ctx, input }) => {
      const where: any = { farm_id: ctx.farmId };
      if (input.position) where.position = input.position;
      if (input.status) where.status = input.status;
      if (input.search) {
        where.OR = [
          { first_name: { contains: input.search, mode: 'insensitive' } },
          { last_name: { contains: input.search, mode: 'insensitive' } },
          { email: { contains: input.search, mode: 'insensitive' } },
        ];
      }

      const items = await ctx.prisma.employees.findMany({
        where,
        take: input.limit,
        orderBy: [{ status: 'asc' }, { first_name: 'asc' }],
      });

      return {
        items: items.map(mapEmployee),
        nextCursor: null,
        hasMore: false,
      };
    }),

  byId: farmProcedure
    .input(getByIdSchema)
    .query(async ({ ctx, input }) => mapEmployee(await getEmployeeOrThrow(ctx.prisma, ctx.farmId, input.id))),

  create: farmProcedure
    .input(createEmployeeSchema)
    .mutation(async ({ ctx, input }) => {
      const created = await ctx.prisma.employees.create({
        data: {
          farm_id: ctx.farmId,
          first_name: input.firstName,
          last_name: input.lastName,
          email: input.email ?? null,
          phone: input.phone ?? null,
          position: input.position ?? null,
          status: input.status ?? 'ACTIVE',
          hire_date: input.hireDate ? new Date(input.hireDate) : null,
          hourly_rate: input.hourlyRate ?? null,
          notes: input.notes ?? null,
        },
      });
      return mapEmployee(created);
    }),

  update: farmProcedure
    .input(updateEmployeeSchema)
    .mutation(async ({ ctx, input }) => {
      await getEmployeeOrThrow(ctx.prisma, ctx.farmId, input.id);
      const updated = await ctx.prisma.employees.update({
        where: { id: input.id },
        data: {
          ...(input.firstName !== undefined ? { first_name: input.firstName } : {}),
          ...(input.lastName !== undefined ? { last_name: input.lastName } : {}),
          ...(input.email !== undefined ? { email: input.email } : {}),
          ...(input.phone !== undefined ? { phone: input.phone } : {}),
          ...(input.position !== undefined ? { position: input.position } : {}),
          ...(input.status !== undefined ? { status: input.status } : {}),
          ...(input.hireDate !== undefined ? { hire_date: input.hireDate ? new Date(input.hireDate) : null } : {}),
          ...(input.hourlyRate !== undefined ? { hourly_rate: input.hourlyRate } : {}),
          ...(input.notes !== undefined ? { notes: input.notes } : {}),
        },
      });
      return mapEmployee(updated);
    }),

  delete: farmProcedure
    .input(getByIdSchema)
    .mutation(async ({ ctx, input }) => {
      await getEmployeeOrThrow(ctx.prisma, ctx.farmId, input.id);
      await ctx.prisma.employees.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),

  sendInvite: farmProcedure
    .input(getByIdSchema)
    .mutation(async ({ ctx, input }) => {
      await getEmployeeOrThrow(ctx.prisma, ctx.farmId, input.id);
      return { success: true, message: 'Employee invite flow is not yet connected to Clerk.' };
    }),

  resendInvite: farmProcedure
    .input(getByIdSchema)
    .mutation(async ({ ctx, input }) => {
      await getEmployeeOrThrow(ctx.prisma, ctx.farmId, input.id);
      return { success: true, message: 'Employee invite flow is not yet connected to Clerk.' };
    }),
});
