import { TRPCError } from '@trpc/server';
import type { PrismaClient, Prisma } from '../../../../generated/prisma/client.js';
import type { Task, ListTasksInput } from '../types.js';
import { type PaginatedResponse } from '../../../../lib/trpc/pagination/index.js';
import { PAGINATION_DEFAULTS } from '../../../../lib/trpc/pagination/schemas.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';
import { mapDbTask } from './getTaskById.js';

const domainLogger = rootLogger.child({ component: 'planner-tasks' });

interface TaskCursor {
  dueDate: string;
  id: string;
}

function encodeTaskCursor(task: { due_date: Date; id: string }): string {
  const payload: TaskCursor = {
    dueDate: task.due_date.toISOString(),
    id: task.id,
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64');
}

function decodeTaskCursor(cursor: string): TaskCursor {
  try {
    const decoded = Buffer.from(cursor, 'base64').toString('utf8');
    const parsed = JSON.parse(decoded) as TaskCursor;
    if (!parsed?.dueDate || !parsed?.id) {
      throw new Error('Missing cursor fields');
    }
    return parsed;
  } catch (error) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: 'Invalid cursor',
      cause: error,
    });
  }
}

export async function listTasks(
  prisma: PrismaClient,
  farmId: string,
  input: ListTasksInput
): Promise<PaginatedResponse<Task>> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Listing tasks', { type: input.type, types: input.types, status: input.status });

  const where: Prisma.tasksWhereInput = {
    farm_id: farmId,
  };

  if (input.types && input.types.length > 0) {
    where.type = { in: input.types };
  } else if (input.type) {
    where.type = input.type;
  }

  if (input.status) {
    where.status = input.status;
  }

  if (input.dueDateStart || input.dueDateEnd) {
    where.due_date = {};
    if (input.dueDateStart) {
      (where.due_date as any).gte = new Date(input.dueDateStart);
    }
    if (input.dueDateEnd) {
      (where.due_date as any).lte = new Date(input.dueDateEnd);
    }
  }

  if (input.cursor) {
    const cursor = decodeTaskCursor(input.cursor);
    const cursorDate = new Date(cursor.dueDate);
    if (Number.isNaN(cursorDate.getTime())) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Invalid cursor date',
      });
    }
    where.AND = [
      ...(where.AND ?? []),
      {
        OR: [
          { due_date: { gt: cursorDate } },
          {
            AND: [
              { due_date: cursorDate },
              { id: { gt: cursor.id } },
            ],
          },
        ],
      },
    ];
  }

  const limit = input.limit ?? PAGINATION_DEFAULTS.limit;
  const take = limit + 1;

  const tasks = await prisma.tasks.findMany({
    where,
    take,
    orderBy: [{ due_date: 'asc' }, { id: 'asc' }],
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

  const hasMore = tasks.length > limit;
  const pageItems = hasMore ? tasks.slice(0, limit) : tasks;
  const mapped = pageItems.map(mapDbTask);
  const lastItem = pageItems[pageItems.length - 1];
  const nextCursor = hasMore && lastItem ? encodeTaskCursor(lastItem) : null;

  return {
    items: mapped,
    nextCursor,
    hasMore,
  };
}
