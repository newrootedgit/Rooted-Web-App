import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { Task } from '../types.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-tasks' });

export function mapDbTask(db: any): Task {
  return {
    id: db.id,
    farmId: db.farm_id,
    orderItemId: db.order_item_id,
    blendIngredientId: db.blend_ingredient_id ?? null,
    title: db.title,
    type: db.type,
    dueDate: db.due_date,
    status: db.status,
    priority: db.priority,
    completedAt: db.completed_at,
    completedBy: db.completed_by,
    completedByEmployeeId: db.completed_by_employee_id ?? null,
    completionNotes: db.completion_notes,
    actualTrays: db.actual_trays,
    actualYieldOz: db.actual_yield_oz ? Number(db.actual_yield_oz) : null,
    seedLot: db.seed_lot,
    createdAt: db.created_at,
    orderItem: db.order_items ?? undefined,
    rackAssignments: db.rack_assignments ?? undefined,
  };
}

export async function getTaskById(
  prisma: PrismaClient,
  farmId: string,
  id: string
): Promise<Task> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Getting task by ID', { taskId: id });

  const task = await prisma.tasks.findFirst({
    where: { id, farm_id: farmId },
    include: {
      employees: true,
      rack_assignments: true,
      order_items: {
        include: {
          orders: true,
          products: true,
          blends: true,
          skus: {
            include: {
              package_types: true,
            },
          },
        },
      },
    },
  });

  if (!task) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Task not found',
    });
  }

  return mapDbTask(task);
}
