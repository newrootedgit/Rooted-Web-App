import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { Order, OrderItem } from '../types.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-orders' });

export function mapDbOrderItem(db: any): OrderItem {
  return {
    id: db.id,
    orderId: db.order_id,
    productId: db.product_id,
    blendId: db.blend_id,
    quantityOz: db.quantity_oz ? Number(db.quantity_oz) : 0,
    harvestDate: db.harvest_date,
    overagePercent: db.overage_percent ? Number(db.overage_percent) : null,
    traysNeeded: db.trays_needed,
    soakDate: db.soak_date,
    seedDate: db.seed_date,
    moveToLightDate: db.move_to_light_date,
    createdAt: db.created_at,
    product: db.products ?? undefined,
    blend: db.blends ?? undefined,
    tasks: db.tasks ?? undefined,
  };
}

export function mapDbOrder(db: any): Order {
  return {
    id: db.id,
    farmId: db.farm_id,
    customerId: db.customer_id,
    orderNumber: db.order_number,
    status: db.status,
    notes: db.notes,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
    customer: db.customers ?? undefined,
    items: db.order_items?.map(mapDbOrderItem) ?? undefined,
  };
}

export async function getOrderById(
  prisma: PrismaClient,
  farmId: string,
  id: string
): Promise<Order> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Getting order by ID', { orderId: id });

  const order = await prisma.orders.findFirst({
    where: { id, farm_id: farmId },
    include: {
      customers: true,
      order_items: {
        include: {
          products: true,
          blends: {
            include: {
              blend_ingredients: {
                include: { products: true },
              },
            },
          },
          tasks: true,
        },
      },
    },
  });

  if (!order) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Order not found',
    });
  }

  return mapDbOrder(order);
}