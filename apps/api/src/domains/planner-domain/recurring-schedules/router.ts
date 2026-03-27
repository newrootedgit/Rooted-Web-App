import { TRPCError } from '@trpc/server';
import { router, farmProcedure } from '../../../lib/trpc/trpc.js';
import {
  getByIdSchema,
  createRecurringScheduleSchema,
  updateRecurringScheduleSchema,
  listRecurringSchedulesInputSchema,
  toggleRecurringScheduleSchema,
  skipDateSchema,
  removeSkipDateSchema,
  generateOrderSchema,
} from './types.js';
import { getRecurringScheduleDates, generateRecurringOrderForSchedule } from './service.js';

function mapScheduleItem(db: any) {
  return {
    id: db.id,
    scheduleId: db.schedule_id,
    productId: db.product_id ?? null,
    blendId: db.blend_id ?? null,
    quantityOz: Number(db.quantity_oz),
    overagePercent: db.overage_percent != null ? Number(db.overage_percent) : null,
    product: db.products ?? undefined,
    blend: db.blends ?? undefined,
  };
}

function mapSkip(db: any) {
  return {
    id: db.id,
    scheduleId: db.schedule_id,
    skipDate: db.skip_date,
    reason: db.reason ?? null,
  };
}

function mapSchedule(db: any) {
  const dates = getRecurringScheduleDates(db);
  return {
    id: db.id,
    farmId: db.farm_id,
    customerId: db.customer_id ?? null,
    name: db.name,
    scheduleType: db.schedule_type,
    daysOfWeek: db.days_of_week ?? [],
    intervalDays: db.interval_days ?? null,
    startDate: db.start_date,
    endDate: db.end_date ?? null,
    leadTimeDays: db.lead_time_days ?? null,
    isActive: db.is_active ?? true,
    notes: db.notes ?? null,
    lastGeneratedAt: db.last_generated_at ?? null,
    createdAt: db.created_at,
    customer: db.customers ?? undefined,
    items: db.items?.map(mapScheduleItem) ?? [],
    skipDates: db.skipped_dates?.map(mapSkip) ?? [],
    upcomingHarvestDates: dates.upcomingHarvestDates,
    nextHarvestDate: dates.nextHarvestDate,
  };
}

async function getScheduleOrThrow(prisma: any, farmId: string, id: string) {
  const schedule = await prisma.recurring_order_schedules.findFirst({
    where: { id, farm_id: farmId },
    include: {
      customers: true,
      items: {
        include: {
          products: true,
          blends: true,
        },
      },
      skipped_dates: true,
    },
  });

  if (!schedule) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Recurring schedule not found',
    });
  }

  return schedule;
}

export const recurringSchedulesRouter = router({
  list: farmProcedure
    .input(listRecurringSchedulesInputSchema)
    .query(async ({ ctx, input }) => {
      const where: any = { farm_id: ctx.farmId };
      if (input.isActive !== undefined) where.is_active = input.isActive;
      if (input.search) {
        where.name = { contains: input.search, mode: 'insensitive' };
      }

      const schedules = await ctx.prisma.recurring_order_schedules.findMany({
        where,
        take: input.limit,
        orderBy: { created_at: 'desc' },
        include: {
          customers: true,
          items: {
            include: {
              products: true,
              blends: true,
            },
          },
          skipped_dates: true,
        },
      });

      return {
        items: schedules.map(mapSchedule),
        nextCursor: null,
        hasMore: false,
      };
    }),

  byId: farmProcedure
    .input(getByIdSchema)
    .query(async ({ ctx, input }) => mapSchedule(await getScheduleOrThrow(ctx.prisma, ctx.farmId, input.id))),

  create: farmProcedure
    .input(createRecurringScheduleSchema)
    .mutation(async ({ ctx, input }) => {
      const created = await ctx.prisma.$transaction(async (tx: any) => {
        const schedule = await tx.recurring_order_schedules.create({
          data: {
            farm_id: ctx.farmId,
            customer_id: input.customerId ?? null,
            name: input.name,
            schedule_type: input.scheduleType,
            days_of_week: input.daysOfWeek,
            interval_days: input.intervalDays ?? null,
            start_date: new Date(input.startDate),
            end_date: input.endDate ? new Date(input.endDate) : null,
            lead_time_days: input.leadTimeDays ?? 7,
            is_active: input.isActive ?? true,
            notes: input.notes ?? null,
          },
        });

        for (const item of input.items) {
          await tx.recurring_order_schedule_items.create({
            data: {
              farm_id: ctx.farmId,
              schedule_id: schedule.id,
              product_id: item.productId ?? null,
              blend_id: item.blendId ?? null,
              quantity_oz: item.quantityOz,
              overage_percent: item.overagePercent ?? 10,
            },
          });
        }

        return getScheduleOrThrow(tx, ctx.farmId, schedule.id);
      });

      return mapSchedule(created);
    }),

  update: farmProcedure
    .input(updateRecurringScheduleSchema)
    .mutation(async ({ ctx, input }) => {
      const updated = await ctx.prisma.$transaction(async (tx: any) => {
        await getScheduleOrThrow(tx, ctx.farmId, input.id);

        await tx.recurring_order_schedules.update({
          where: { id: input.id },
          data: {
            ...(input.customerId !== undefined ? { customer_id: input.customerId } : {}),
            ...(input.name !== undefined ? { name: input.name } : {}),
            ...(input.scheduleType !== undefined ? { schedule_type: input.scheduleType } : {}),
            ...(input.daysOfWeek !== undefined ? { days_of_week: input.daysOfWeek } : {}),
            ...(input.intervalDays !== undefined ? { interval_days: input.intervalDays } : {}),
            ...(input.startDate !== undefined ? { start_date: new Date(input.startDate) } : {}),
            ...(input.endDate !== undefined ? { end_date: input.endDate ? new Date(input.endDate) : null } : {}),
            ...(input.leadTimeDays !== undefined ? { lead_time_days: input.leadTimeDays } : {}),
            ...(input.isActive !== undefined ? { is_active: input.isActive } : {}),
            ...(input.notes !== undefined ? { notes: input.notes } : {}),
          },
        });

        if (input.items) {
          await tx.recurring_order_schedule_items.deleteMany({
            where: { schedule_id: input.id },
          });
          for (const item of input.items) {
            await tx.recurring_order_schedule_items.create({
              data: {
                farm_id: ctx.farmId,
                schedule_id: input.id,
                product_id: item.productId ?? null,
                blend_id: item.blendId ?? null,
                quantity_oz: item.quantityOz,
                overage_percent: item.overagePercent ?? 10,
              },
            });
          }
        }

        return getScheduleOrThrow(tx, ctx.farmId, input.id);
      });

      return mapSchedule(updated);
    }),

  delete: farmProcedure
    .input(getByIdSchema)
    .mutation(async ({ ctx, input }) => {
      await getScheduleOrThrow(ctx.prisma, ctx.farmId, input.id);
      await ctx.prisma.recurring_order_schedules.delete({
        where: { id: input.id },
      });
      return { success: true };
    }),

  toggleActive: farmProcedure
    .input(toggleRecurringScheduleSchema)
    .mutation(async ({ ctx, input }) => {
      await getScheduleOrThrow(ctx.prisma, ctx.farmId, input.id);
      const updated = await ctx.prisma.recurring_order_schedules.update({
        where: { id: input.id },
        data: { is_active: input.isActive },
      });
      return { id: updated.id, isActive: updated.is_active ?? false };
    }),

  addSkipDate: farmProcedure
    .input(skipDateSchema)
    .mutation(async ({ ctx, input }) => {
      await getScheduleOrThrow(ctx.prisma, ctx.farmId, input.scheduleId);
      const skip = await ctx.prisma.recurring_order_schedule_skips.create({
        data: {
          farm_id: ctx.farmId,
          schedule_id: input.scheduleId,
          skip_date: new Date(input.skipDate),
          reason: input.reason ?? null,
        },
      });
      return mapSkip(skip);
    }),

  removeSkipDate: farmProcedure
    .input(removeSkipDateSchema)
    .mutation(async ({ ctx, input }) => {
      await getScheduleOrThrow(ctx.prisma, ctx.farmId, input.scheduleId);
      if (input.skipId) {
        await ctx.prisma.recurring_order_schedule_skips.delete({
          where: { id: input.skipId },
        });
      } else {
        await ctx.prisma.recurring_order_schedule_skips.deleteMany({
          where: {
            schedule_id: input.scheduleId,
            skip_date: new Date(input.skipDate!),
          },
        });
      }
      return { success: true };
    }),

  generateOrder: farmProcedure
    .input(generateOrderSchema)
    .mutation(async ({ ctx, input }) => generateRecurringOrderForSchedule(
      ctx.prisma,
      ctx.farmId,
      input.scheduleId,
      input.harvestDate ? new Date(input.harvestDate) : undefined,
    )),
});
