import { router, farmProcedure } from '../../../lib/trpc/trpc.js';
import {
  listTasksInputSchema,
  listCompletedTasksInputSchema,
  getByIdSchema,
  completeTaskSchema,
  updateTaskStatusSchema,
  updateTaskDueDateSchema,
} from './types.js';
import { listTasks, listCompletedTasks, getTaskById } from './queries/index.js';
import { completeTask, updateTaskStatus, updateTaskDueDate } from './commands/index.js';

export const taskRouter = router({
  list: farmProcedure
    .input(listTasksInputSchema)
    .query(({ ctx, input }) => listTasks(ctx.prisma, ctx.farmId, input)),

  listCompleted: farmProcedure
    .input(listCompletedTasksInputSchema)
    .query(({ ctx, input }) => listCompletedTasks(ctx.prisma, ctx.farmId, input)),

  byId: farmProcedure
    .input(getByIdSchema)
    .query(({ ctx, input }) => getTaskById(ctx.prisma, ctx.farmId, input.id)),

  complete: farmProcedure
    .input(completeTaskSchema)
    .mutation(({ ctx, input }) => completeTask(ctx.prisma, ctx.farmId, input)),

  updateStatus: farmProcedure
    .input(updateTaskStatusSchema)
    .mutation(({ ctx, input }) => updateTaskStatus(ctx.prisma, ctx.farmId, input)),

  updateDueDate: farmProcedure
    .input(updateTaskDueDateSchema)
    .mutation(({ ctx, input }) => updateTaskDueDate(ctx.prisma, ctx.farmId, input)),
});
