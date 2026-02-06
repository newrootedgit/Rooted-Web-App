import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { Task, UpdateTaskDueDateInput } from '../types.js';
import { mapDbTask } from '../queries/getTaskById.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-tasks' });

export async function updateTaskDueDate(
  prisma: PrismaClient,
  farmId: string,
  input: UpdateTaskDueDateInput
): Promise<Task> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Updating task due date', { taskId: input.id });

  const existing = await prisma.tasks.findFirst({
    where: { id: input.id, farm_id: farmId },
  });

  if (!existing) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Task not found',
    });
  }

  const updated = await prisma.tasks.update({
    where: { id: input.id },
    data: {
      due_date: new Date(input.dueDate),
    },
    include: {
      order_items: {
        include: {
          orders: true,
          products: true,
          blends: true,
        },
      },
    },
  });

  logger.info('Task due date updated', { taskId: input.id });
  return mapDbTask(updated);
}