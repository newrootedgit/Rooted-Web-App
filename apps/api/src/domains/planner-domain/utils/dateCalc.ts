import type { PrismaClient } from '../../../generated/prisma/client.js';

export function subDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() - days);
  return result;
}

export function calculateTraysNeeded(
  quantityOz: number,
  overagePercent: number,
  avgYieldPerTray: number
): number {
  if (avgYieldPerTray <= 0) return 0;
  const totalOz = quantityOz * (1 + overagePercent / 100);
  return Math.ceil(totalOz / avgYieldPerTray);
}

export async function generateOrderNumber(
  prisma: PrismaClient,
  farmId: string
): Promise<string> {
  const lastOrder = await (prisma as any).orders.findFirst({
    where: { farm_id: farmId },
    orderBy: { created_at: 'desc' },
    select: { order_number: true },
  });

  let nextNum = 1;
  if (lastOrder?.order_number) {
    const match = lastOrder.order_number.match(/ORD-(\d+)/);
    if (match) {
      nextNum = parseInt(match[1], 10) + 1;
    }
  }

  return `ORD-${String(nextNum).padStart(6, '0')}`;
}

export interface ProductTiming {
  daysSoaking: number;
  daysGermination: number;
  daysLight: number;
  avgYieldPerTray: number | null;
  name: string;
}

export function calculateDatesFromHarvest(
  harvestDate: Date,
  timing: ProductTiming
) {
  const moveToLightDate = subDays(harvestDate, timing.daysLight);
  const seedDate = subDays(moveToLightDate, timing.daysGermination);
  const soakDate = subDays(seedDate, timing.daysSoaking);

  return { soakDate, seedDate, moveToLightDate };
}

export interface RecurringScheduleParams {
  scheduleType: 'FIXED_DAY' | 'INTERVAL';
  daysOfWeek?: number[];
  intervalDays?: number | null;
  startDate: Date;
  endDate?: Date | null;
  leadTimeDays: number;
}

export function calculateRecurringHarvestDates(
  schedule: RecurringScheduleParams,
  skippedDates: Date[] = [],
  fromDate?: Date
): Date[] {
  const dates: Date[] = [];
  const today = fromDate ? new Date(fromDate) : new Date();
  today.setHours(0, 0, 0, 0);

  const endLimit = new Date(today);
  endLimit.setDate(endLimit.getDate() + schedule.leadTimeDays);

  const scheduleEnd = schedule.endDate
    ? new Date(Math.min(new Date(schedule.endDate).getTime(), endLimit.getTime()))
    : endLimit;

  const skippedSet = new Set(
    skippedDates.map((d) => {
      const date = new Date(d);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    })
  );

  const scheduleStart = new Date(schedule.startDate);
  scheduleStart.setHours(0, 0, 0, 0);

  if (schedule.scheduleType === 'FIXED_DAY' && schedule.daysOfWeek && schedule.daysOfWeek.length > 0) {
    let current = new Date(Math.max(scheduleStart.getTime(), today.getTime()));
    while (current <= scheduleEnd) {
      if (schedule.daysOfWeek.includes(current.getDay()) && !skippedSet.has(current.getTime())) {
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + 1);
    }
  } else if (schedule.scheduleType === 'INTERVAL' && schedule.intervalDays && schedule.intervalDays > 0) {
    let current = new Date(scheduleStart);
    while (current < today) {
      current.setDate(current.getDate() + schedule.intervalDays);
    }
    while (current <= scheduleEnd) {
      if (!skippedSet.has(current.getTime())) {
        dates.push(new Date(current));
      }
      current.setDate(current.getDate() + schedule.intervalDays);
    }
  }

  return dates;
}

export function getNextRecurringDate(
  schedule: RecurringScheduleParams,
  skippedDates: Date[] = [],
  fromDate?: Date
): Date | null {
  const dates = calculateRecurringHarvestDates(schedule, skippedDates, fromDate);
  return dates[0] ?? null;
}

export function findLongestTimingFromBlend(
  ingredients: Array<{ products: any }>
): ProductTiming {
  let longest: ProductTiming | null = null;
  let longestTotal = 0;

  for (const ingredient of ingredients) {
    const p = ingredient.products;
    const total = (p.days_soaking ?? 0) + (p.days_germination ?? 0) + (p.days_light ?? 0);
    if (total > longestTotal) {
      longestTotal = total;
      longest = {
        daysSoaking: p.days_soaking,
        daysGermination: p.days_germination,
        daysLight: p.days_light,
        avgYieldPerTray: p.avg_yield_per_tray ? Number(p.avg_yield_per_tray) : null,
        name: p.name,
      };
    }
  }

  return longest!;
}

export interface BlendIngredientScheduleParams {
  id?: string;
  productId: string;
  productName: string;
  ratioPercent: number;
  avgYieldPerTray: number;
  daysSoaking: number | null;
  daysGermination: number;
  daysLight: number;
}

export interface BlendProductionSchedule {
  blendHarvestDate: Date;
  totalQuantityOz: number;
  earliestStartDate: Date;
  ingredients: Array<{
    blendIngredientId?: string;
    productId: string;
    productName: string;
    ratioPercent: number;
    targetOz: number;
    traysNeeded: number;
    requiresSoaking: boolean;
    soakDate: Date;
    seedDate: Date;
    moveToLightDate: Date;
    harvestDate: Date;
    totalGrowthDays: number;
  }>;
}

export function calculateBlendProductionSchedule(params: {
  quantityOz: number;
  overagePercent: number;
  harvestDate: Date;
  ingredients: BlendIngredientScheduleParams[];
}): BlendProductionSchedule {
  const { quantityOz, overagePercent, harvestDate, ingredients } = params;
  const totalWithOverage = quantityOz * (1 + overagePercent / 100);
  const harvest = new Date(harvestDate);
  harvest.setHours(0, 0, 0, 0);

  let earliestStartDate = new Date(harvest);

  const schedules = ingredients.map((ingredient) => {
    const targetOz = totalWithOverage * (ingredient.ratioPercent / 100);
    const traysNeeded = Math.ceil(targetOz / ingredient.avgYieldPerTray);
    const requiresSoaking = ingredient.daysSoaking != null && ingredient.daysSoaking > 0;
    const effectiveSoakDays = requiresSoaking ? ingredient.daysSoaking ?? 0 : 0;
    const totalGrowthDays = effectiveSoakDays + ingredient.daysGermination + ingredient.daysLight;

    const moveToLightDate = subDays(harvest, ingredient.daysLight);
    const seedDate = subDays(moveToLightDate, ingredient.daysGermination);
    const soakDate = requiresSoaking ? subDays(seedDate, effectiveSoakDays) : new Date(seedDate);

    if (soakDate < earliestStartDate) {
      earliestStartDate = new Date(soakDate);
    }

    return {
      blendIngredientId: ingredient.id,
      productId: ingredient.productId,
      productName: ingredient.productName,
      ratioPercent: ingredient.ratioPercent,
      targetOz,
      traysNeeded,
      requiresSoaking,
      soakDate,
      seedDate,
      moveToLightDate,
      harvestDate: new Date(harvest),
      totalGrowthDays,
    };
  });

  return {
    blendHarvestDate: harvest,
    totalQuantityOz: quantityOz,
    earliestStartDate,
    ingredients: schedules,
  };
}
