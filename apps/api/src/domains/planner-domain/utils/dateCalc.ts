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
