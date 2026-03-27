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

  let completedByName: string | null = null;
  if (input.completedByEmployeeId) {
    const employee = await prisma.employees.findFirst({
      where: { id: input.completedByEmployeeId, farm_id: farmId },
    });

    if (!employee) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Employee not found',
      });
    }

    completedByName = `${employee.first_name} ${employee.last_name}`.trim();
  }

  const updated = await prisma.$transaction(async (tx: any) => {
    if (input.rackAssignments && input.rackAssignments.length > 0) {
      await tx.rack_assignments.updateMany({
        where: { task_id: input.id, is_active: true },
        data: { is_active: false, removed_at: new Date() },
      });

      for (const assignment of input.rackAssignments) {
        await tx.rack_assignments.create({
          data: {
            farm_id: farmId,
            order_item_id: existing.order_item_id,
            task_id: input.id,
            rack_element_id: assignment.rackElementId,
            level: assignment.level,
            tray_count: assignment.trayCount,
            assigned_at: new Date(),
            assigned_by: completedByName,
            is_active: true,
          },
        });
      }
    }

    return tx.tasks.update({
      where: { id: input.id },
      data: {
        status: 'COMPLETED',
        completed_at: input.completedAt ? new Date(input.completedAt) : new Date(),
        completed_by: completedByName,
        completed_by_employee_id: input.completedByEmployeeId ?? null,
        actual_trays: input.actualTrays ?? null,
        actual_yield_oz: input.actualYieldOz ?? null,
        seed_lot: input.seedLot ?? null,
        completion_notes: input.completionNotes ?? null,
      },
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
  });

  logger.info('Task completed', { taskId: input.id });
  return mapDbTask(updated);
}
