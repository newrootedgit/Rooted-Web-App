import { TRPCError } from '@trpc/server';
import type { PrismaClient } from '../../../../generated/prisma/client.js';
import type { Task, UpdateTaskStatusInput } from '../types.js';
import { mapDbTask } from '../queries/getTaskById.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';

const domainLogger = rootLogger.child({ component: 'planner-tasks' });

const VALID_TRANSITIONS: Record<string, string[]> = {
  'TODO': ['IN_PROGRESS', 'COMPLETED'],
  'IN_PROGRESS': ['COMPLETED'],
  'COMPLETED': [],
};

export async function updateTaskStatus(
  prisma: PrismaClient,
  farmId: string,
  input: UpdateTaskStatusInput
): Promise<Task> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Updating task status', { taskId: input.id, newStatus: input.status });

  const existing = await prisma.tasks.findFirst({
    where: { id: input.id, farm_id: farmId },
  });

  if (!existing) {
    throw new TRPCError({
      code: 'NOT_FOUND',
      message: 'Task not found',
    });
  }

  const allowed = VALID_TRANSITIONS[existing.status ?? 'TODO'] ?? [];
  if (!allowed.includes(input.status)) {
    throw new TRPCError({
      code: 'CONFLICT',
      message: `Cannot transition from "${existing.status}" to "${input.status}"`,
    });
  }

  const data: any = { status: input.status };
  if (input.status === 'COMPLETED') {
    data.completed_at = new Date();
  }

  const updated = await prisma.tasks.update({
    where: { id: input.id },
    data,
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

  logger.info('Task status updated', { taskId: input.id, from: existing.status, to: input.status });
  return mapDbTask(updated);
}