import { z } from 'zod';
import { paginationInputSchema } from '../../../lib/trpc/pagination/index.js';

export interface Employee {
  id: string;
  farmId: string | null;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string | null;
  position: string | null;
  status: string | null;
  hireDate: Date | null;
  hourlyRate: number | null;
  notes: string | null;
  createdAt: Date | null;
}

export const getByIdSchema = z.object({
  id: z.string().uuid(),
});

export type GetByIdInput = z.infer<typeof getByIdSchema>;

export const listEmployeesInputSchema = paginationInputSchema.extend({
  search: z.string().optional(),
  position: z.string().optional(),
  status: z.string().optional(),
});

export type ListEmployeesInput = z.infer<typeof listEmployeesInputSchema>;

export const createEmployeeSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email().optional(),
  phone: z.string().max(50).optional(),
  position: z.string().max(100).optional(),
  status: z.string().max(50).optional(),
  hireDate: z.string().or(z.date()).optional(),
  hourlyRate: z.number().min(0).optional(),
  notes: z.string().optional(),
});

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;

export const updateEmployeeSchema = createEmployeeSchema.partial().extend({
  id: z.string().uuid(),
  email: z.string().email().nullable().optional(),
  phone: z.string().max(50).nullable().optional(),
  position: z.string().max(100).nullable().optional(),
  status: z.string().max(50).nullable().optional(),
  hireDate: z.string().or(z.date()).nullable().optional(),
  hourlyRate: z.number().min(0).nullable().optional(),
  notes: z.string().nullable().optional(),
});

export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
