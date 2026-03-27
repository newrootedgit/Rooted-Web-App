import { z } from 'zod';
import { paginationInputSchema } from '../../../lib/trpc/pagination/index.js';

// ─── Domain Interfaces ───────────────────────────────────────────────

export interface Order {
  id: string;
  farmId: string | null;
  customerId: string | null;
  recurringScheduleId: string | null;
  recurringGenerationDate: Date | null;
  orderNumber: string;
  status: string;
  notes: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  customer?: any;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string | null;
  productId: string | null;
  blendId: string | null;
  skuId: string | null;
  quantityUnits: number | null;
  quantityOz: number;
  harvestDate: Date;
  overagePercent: number | null;
  traysNeeded: number | null;
  soakDate: Date | null;
  seedDate: Date | null;
  moveToLightDate: Date | null;
  createdAt: Date | null;
  product?: any;
  blend?: any;
  sku?: any;
  tasks?: any[];
}

export type OrderStatus = 'Pending' | 'In Progress' | 'Ready' | 'Delivered' | 'Cancelled';

// ─── Input Schemas ───────────────────────────────────────────────────

export const getByIdSchema = z.object({
  id: z.string().uuid(),
});

export type GetByIdInput = z.infer<typeof getByIdSchema>;

const createOrderItemSchema = z.object({
  productId: z.string().uuid().optional(),
  blendId: z.string().uuid().optional(),
  skuId: z.string().uuid().optional(),
  quantityUnits: z.number().int().min(1).optional(),
  quantityOz: z.number().min(0.01).optional(),
  harvestDate: z.string().or(z.date()),
  overagePercent: z.number().min(0).max(100).optional(),
}).superRefine((data, ctx) => {
  const hasSelection = (data.productId && !data.blendId) || (!data.productId && data.blendId);
  if (!hasSelection) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Exactly one of productId or blendId must be provided',
    });
  }

  const hasSkuQuantity = !!data.skuId && !!data.quantityUnits;
  const hasOzQuantity = data.quantityOz !== undefined;
  if (!hasSkuQuantity && !hasOzQuantity) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Provide either skuId + quantityUnits or quantityOz',
    });
  }
});

export const createOrderSchema = z.object({
  customerId: z.string().uuid().optional(),
  items: z.array(createOrderItemSchema).min(1),
  notes: z.string().optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateOrderStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['Pending', 'In Progress', 'Ready', 'Delivered', 'Cancelled']),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

export const updateOrderSchema = z.object({
  id: z.string().uuid(),
  notes: z.string().nullable().optional(),
  customerId: z.string().uuid().nullable().optional(),
});

export type UpdateOrderInput = z.infer<typeof updateOrderSchema>;

export const cloneOrderSchema = z.object({
  orderId: z.string().uuid(),
  dayOffset: z.number().int(),
});

export type CloneOrderInput = z.infer<typeof cloneOrderSchema>;

export const listOrdersInputSchema = paginationInputSchema.extend({
  status: z.string().optional(),
  customerId: z.string().uuid().optional(),
  search: z.string().optional(),
});

export type ListOrdersInput = z.infer<typeof listOrdersInputSchema>;
