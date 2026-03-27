import type { PrismaClient } from '../../../../generated/prisma/client.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-tasks' });

interface GenerateTasksInput {
  farmId: string;
  orderItemId: string;
  orderNumber: string;
  productName: string;
  blendIngredientId?: string | null;
  soakDate: Date;
  seedDate: Date;
  moveToLightDate: Date;
  harvestDate: Date;
}

export async function generateTasksForOrderItem(
  prisma: any,
  input: GenerateTasksInput
): Promise<void> {
  const logger = domainLogger.child({ farmId: input.farmId });
  logger.debug('Generating tasks for order item', { orderItemId: input.orderItemId });

  const taskDefs = [
    { type: 'SOAK', dueDate: input.soakDate, title: `Soak - ${input.productName} (${input.orderNumber})` },
    { type: 'SEED', dueDate: input.seedDate, title: `Seed - ${input.productName} (${input.orderNumber})` },
    { type: 'MOVE_TO_LIGHT', dueDate: input.moveToLightDate, title: `Move to Light - ${input.productName} (${input.orderNumber})` },
    { type: 'HARVEST', dueDate: input.harvestDate, title: `Harvest - ${input.productName} (${input.orderNumber})` },
  ];

  for (const def of taskDefs) {
    await prisma.tasks.create({
      data: {
        farm_id: input.farmId,
        order_item_id: input.orderItemId,
        blend_ingredient_id: input.blendIngredientId ?? null,
        title: def.title,
        type: def.type,
        due_date: def.dueDate,
        status: 'TODO',
        priority: 'MEDIUM',
      },
    });
  }

  logger.info('Tasks generated for order item', { orderItemId: input.orderItemId, count: 4 });
}
