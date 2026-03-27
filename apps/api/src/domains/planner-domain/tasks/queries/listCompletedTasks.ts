import type { PrismaClient, Prisma } from '../../../../generated/prisma/client.js';
import type { Task, ListCompletedTasksInput } from '../types.js';
import {
  type PaginatedResponse,
  getPrismaPaginationOptions,
  createPaginatedResponse,
} from '../../../../lib/trpc/pagination/index.js';
import { logger as rootLogger } from '../../../../lib/logger/index.js';
import { mapDbTask } from './getTaskById.js';

const domainLogger = rootLogger.child({ component: 'planner-tasks' });

export async function listCompletedTasks(
  prisma: PrismaClient,
  farmId: string,
  input: ListCompletedTasksInput
): Promise<PaginatedResponse<Task>> {
  const logger = domainLogger.child({ farmId });
  logger.debug('Listing completed tasks', input);

  const where: Prisma.tasksWhereInput = {
    farm_id: farmId,
    status: 'COMPLETED',
  };

  if (input.type) {
    where.type = input.type;
  }

  if (input.completedByEmployeeId) {
    where.completed_by_employee_id = input.completedByEmployeeId;
  }

  if (input.completedDateStart || input.completedDateEnd) {
    where.completed_at = {};
    if (input.completedDateStart) {
      (where.completed_at as Prisma.DateTimeNullableFilter).gte = new Date(input.completedDateStart);
    }
    if (input.completedDateEnd) {
      (where.completed_at as Prisma.DateTimeNullableFilter).lte = new Date(input.completedDateEnd);
    }
  }

  const tasks = await prisma.tasks.findMany({
    where,
    ...getPrismaPaginationOptions(input),
    orderBy: { completed_at: 'desc' },
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

  return createPaginatedResponse(tasks.map(mapDbTask), input);
}
