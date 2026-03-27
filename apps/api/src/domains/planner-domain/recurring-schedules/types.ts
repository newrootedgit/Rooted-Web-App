import { z } from 'zod';
import { paginationInputSchema } from '../../../lib/trpc/pagination/index.js';

export interface RecurringScheduleItem {
  id: string;
  scheduleId: string;
  productId: string | null;
  blendId: string | null;
  quantityOz: number;
  overagePercent: number | null;
  product?: any;
  blend?: any;
}

export interface RecurringScheduleSkip {
  id: string;
  scheduleId: string;
  skipDate: Date;
  reason: string | null;
}

export interface RecurringSchedule {
  id: string;
  farmId: string | null;
  customerId: string | null;
  name: string;
  scheduleType: 'FIXED_DAY' | 'INTERVAL';
  daysOfWeek: number[];
  intervalDays: number | null;
  startDate: Date;
  endDate: Date | null;
  leadTimeDays: number | null;
  isActive: boolean | null;
  notes: string | null;
  lastGeneratedAt: Date | null;
  createdAt: Date | null;
  customer?: any;
  items?: RecurringScheduleItem[];
  skipDates?: RecurringScheduleSkip[];
  upcomingHarvestDates?: Date[];
  nextHarvestDate?: Date | null;
}

export const getByIdSchema = z.object({
  id: z.string().uuid(),
});

export const recurringScheduleItemInputSchema = z.object({
  productId: z.string().uuid().optional(),
  blendId: z.string().uuid().optional(),
  quantityOz: z.number().min(0.01),
  overagePercent: z.number().min(0).max(100).optional(),
}).refine(
  (data) => (data.productId && !data.blendId) || (!data.productId && data.blendId),
  { message: 'Exactly one of productId or blendId must be provided' }
);

const recurringScheduleBaseSchema = z.object({
  customerId: z.string().uuid().optional(),
  name: z.string().min(1).max(255),
  scheduleType: z.enum(['FIXED_DAY', 'INTERVAL']),
  daysOfWeek: z.array(z.number().int().min(0).max(6)).default([]),
  intervalDays: z.number().int().min(1).optional(),
  startDate: z.string().or(z.date()),
  endDate: z.string().or(z.date()).optional(),
  leadTimeDays: z.number().int().min(1).max(365).optional(),
  isActive: z.boolean().optional(),
  notes: z.string().optional(),
  items: z.array(recurringScheduleItemInputSchema).min(1),
});

export const createRecurringScheduleSchema = recurringScheduleBaseSchema.refine(
  (data) => (data.scheduleType === 'FIXED_DAY' && data.daysOfWeek.length > 0)
    || (data.scheduleType === 'INTERVAL' && !!data.intervalDays),
  { message: 'Schedule settings do not match the selected schedule type' }
);

export type CreateRecurringScheduleInput = z.infer<typeof createRecurringScheduleSchema>;

export const updateRecurringScheduleSchema = recurringScheduleBaseSchema.partial().extend({
  id: z.string().uuid(),
  customerId: z.string().uuid().nullable().optional(),
  endDate: z.string().or(z.date()).nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type UpdateRecurringScheduleInput = z.infer<typeof updateRecurringScheduleSchema>;

export const listRecurringSchedulesInputSchema = paginationInputSchema.extend({
  isActive: z.boolean().optional(),
  search: z.string().optional(),
});

export type ListRecurringSchedulesInput = z.infer<typeof listRecurringSchedulesInputSchema>;

export const toggleRecurringScheduleSchema = z.object({
  id: z.string().uuid(),
  isActive: z.boolean(),
});

export const skipDateSchema = z.object({
  scheduleId: z.string().uuid(),
  skipDate: z.string().or(z.date()),
  reason: z.string().optional(),
});

export const removeSkipDateSchema = z.object({
  scheduleId: z.string().uuid(),
  skipId: z.string().uuid().optional(),
  skipDate: z.string().or(z.date()).optional(),
}).refine((data) => !!data.skipId || !!data.skipDate, {
  message: 'skipId or skipDate is required',
});

export const generateOrderSchema = z.object({
  scheduleId: z.string().uuid(),
  harvestDate: z.string().or(z.date()).optional(),
});
