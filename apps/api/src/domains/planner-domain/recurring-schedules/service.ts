import type { PrismaClient } from '../../../generated/prisma/client.js';
import { createOrder } from '../orders/commands/createOrder.js';
import { calculateRecurringHarvestDates, getNextRecurringDate } from '../utils/dateCalc.js';

function normalizeDate(date: Date): Date {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function mapScheduleParams(schedule: any) {
  return {
    scheduleType: schedule.schedule_type,
    daysOfWeek: schedule.days_of_week ?? [],
    intervalDays: schedule.interval_days ?? null,
    startDate: schedule.start_date,
    endDate: schedule.end_date ?? null,
    leadTimeDays: schedule.lead_time_days ?? 7,
  } as const;
}

export function getRecurringScheduleDates(schedule: any) {
  const skipDates = (schedule.skipped_dates ?? []).map((item: any) => item.skip_date);
  const upcomingHarvestDates = calculateRecurringHarvestDates(
    mapScheduleParams(schedule),
    skipDates,
  );
  return {
    upcomingHarvestDates,
    nextHarvestDate: getNextRecurringDate(mapScheduleParams(schedule), skipDates),
  };
}

export async function generateRecurringOrderForSchedule(
  prisma: PrismaClient,
  farmId: string,
  scheduleId: string,
  harvestDate?: Date
) {
  const schedule = await prisma.recurring_order_schedules.findFirst({
    where: { id: scheduleId, farm_id: farmId },
    include: {
      items: true,
      skipped_dates: true,
    },
  });

  if (!schedule) {
    throw new Error('Recurring schedule not found');
  }

  const { nextHarvestDate } = getRecurringScheduleDates(schedule);
  const targetDate = normalizeDate(harvestDate ?? nextHarvestDate ?? new Date());

  const existing = await prisma.orders.findFirst({
    where: {
      recurring_schedule_id: scheduleId,
      recurring_generation_date: targetDate,
    },
  });

  if (existing) {
    return prisma.orders.findFirst({
      where: { id: existing.id },
      include: {
        customers: true,
        order_items: {
          include: {
            products: true,
            blends: true,
            skus: {
              include: {
                package_types: true,
              },
            },
            tasks: true,
          },
        },
      },
    });
  }

  const created = await createOrder(prisma, farmId, {
    customerId: schedule.customer_id ?? undefined,
    notes: schedule.notes ?? undefined,
    recurringScheduleId: schedule.id,
    recurringGenerationDate: targetDate,
    items: schedule.items.map((item: any) => ({
      productId: item.product_id ?? undefined,
      blendId: item.blend_id ?? undefined,
      quantityOz: Number(item.quantity_oz),
      harvestDate: targetDate,
      overagePercent: item.overage_percent != null ? Number(item.overage_percent) : undefined,
    })),
  });

  await prisma.recurring_order_schedules.update({
    where: { id: scheduleId },
    data: {
      last_generated_at: new Date(),
    },
  });

  return created;
}

export async function generateDueRecurringOrders(prisma: PrismaClient) {
  const schedules = await prisma.recurring_order_schedules.findMany({
    where: { is_active: true },
    include: {
      items: true,
      skipped_dates: true,
    },
  });

  const results = [];

  for (const schedule of schedules) {
    const { upcomingHarvestDates } = getRecurringScheduleDates(schedule);
    for (const harvestDate of upcomingHarvestDates) {
      const existing = await prisma.orders.findFirst({
        where: {
          recurring_schedule_id: schedule.id,
          recurring_generation_date: normalizeDate(harvestDate),
        },
        select: { id: true },
      });
      if (existing) continue;
      const order = await generateRecurringOrderForSchedule(
        prisma,
        schedule.farm_id!,
        schedule.id,
        harvestDate,
      );
      results.push(order);
    }
  }

  return results;
}
