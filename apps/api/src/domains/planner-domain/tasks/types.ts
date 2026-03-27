import { z } from 'zod';
import { paginationInputSchema } from '../../../lib/trpc/pagination/index.js';

// ─── Domain Interfaces ───────────────────────────────────────────────

export interface Task {
  id: string;
  farmId: string | null;
  orderItemId: string | null;
  blendIngredientId: string | null;
  title: string;
  type: string;
  dueDate: Date;
  status: string | null;
  priority: string | null;
  completedAt: Date | null;
  completedBy: string | null;
  completedByEmployeeId: string | null;
  completionNotes: string | null;
  actualTrays: number | null;
  actualYieldOz: number | null;
  seedLot: string | null;
  createdAt: Date | null;
  orderItem?: any;
  rackAssignments?: any[];
}

export type TaskType = 'SOAK' | 'SEED' | 'MOVE_TO_LIGHT' | 'HARVEST';
export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'COMPLETED';

// ─── Input Schemas ───────────────────────────────────────────────────

export const getByIdSchema = z.object({
  id: z.string().uuid(),
});

export type GetByIdInput = z.infer<typeof getByIdSchema>;

export const completeTaskSchema = z.object({
  id: z.string().uuid(),
  actualTrays: z.number().int().min(0).optional(),
  actualYieldOz: z.number().min(0).optional(),
  completedByEmployeeId: z.string().uuid().optional(),
  completedAt: z.string().datetime().optional(),
  seedLot: z.string().max(100).optional(),
  completionNotes: z.string().optional(),
  rackAssignments: z.array(z.object({
    rackElementId: z.string().min(1),
    level: z.number().int().min(1),
    trayCount: z.number().int().min(1),
  })).optional(),
});

export type CompleteTaskInput = z.infer<typeof completeTaskSchema>;

export const updateTaskStatusSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'COMPLETED']),
});

export type UpdateTaskStatusInput = z.infer<typeof updateTaskStatusSchema>;

export const updateTaskDueDateSchema = z.object({
  id: z.string().uuid(),
  dueDate: z.string().or(z.date()),
});

export type UpdateTaskDueDateInput = z.infer<typeof updateTaskDueDateSchema>;

export const listTasksInputSchema = paginationInputSchema
  .omit({ cursor: true })
  .extend({
    cursor: z.string().optional(),
    type: z.string().optional(),
    types: z.array(z.string()).min(1).optional(),
    status: z.string().optional(),
    dueDateStart: z.string().optional(),
    dueDateEnd: z.string().optional(),
  });

export type ListTasksInput = z.infer<typeof listTasksInputSchema>;

export const listCompletedTasksInputSchema = paginationInputSchema.extend({
  type: z.string().optional(),
  completedDateStart: z.string().optional(),
  completedDateEnd: z.string().optional(),
  completedByEmployeeId: z.string().uuid().optional(),
});

export type ListCompletedTasksInput = z.infer<typeof listCompletedTasksInputSchema>;
