import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { Task, CompleteTaskInput } from '../types.js';
import { mapDbTask } from '../queries/getTaskById.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-tasks' });

export async function completeTask(
  prisma: PrismaClient,
  farmId: string,
  input: CompleteTaskInput
): Promise<Task> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Completing task', { taskId: input.id });

  const existing = await prisma.tasks.findFirst({
    where: { id: input.id, farm_id: farmId },
  });

  if (!existing) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Task not found',
    });
  }

  if (existing.status === 'COMPLETED') {
    throw new TRPCError({
      code: 'CONFLICT',
      message: 'Task is already completed',
    });
  }

  const updated = await prisma.tasks.update({
    where: { id: input.id },
    data: {
      status: 'COMPLETED',
      completed_at: new Date(),
      actual_trays: input.actualTrays ?? null,
      seed_lot: input.seedLot ?? null,
      completion_notes: input.completionNotes ?? null,
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

  logger.info('Task completed', { taskId: input.id });
  return mapDbTask(updated);
}