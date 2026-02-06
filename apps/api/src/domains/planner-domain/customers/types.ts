import { z } from 'zod';
import { paginationInputSchema } from '../../../lib/trpc/pagination/index.js';

export interface Customer {
  id: string;
  farmId: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  companyName: string | null;
  customerType: string | null;
  paymentTerms: string | null;
  address: Record<string, unknown> | null;
  tags: string[];
  notes: string | null;
  isActive: boolean | null;
  createdAt: Date | null;
}

export const getByIdSchema = z.object({
  id: z.string().uuid(),
});

export const addressSchema = z.object({
  street: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
}).optional();

export const createCustomerSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255).optional(),
  phone: z.string().max(50).optional(),
  companyName: z.string().max(255).optional(),
  customerType: z.enum(['Retail', 'Wholesale', 'Restaurant', 'Farmers Market', 'Distributor']).optional(),
  paymentTerms: z.enum(['Due on Receipt', 'Net 7', 'Net 15', 'Net 30', 'Net 60']).optional(),
  address: addressSchema,
  tags: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;

export const updateCustomerSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  email: z.string().email().max(255).nullable().optional(),
  phone: z.string().max(50).nullable().optional(),
  companyName: z.string().max(255).nullable().optional(),
  customerType: z.enum(['Retail', 'Wholesale', 'Restaurant', 'Farmers Market', 'Distributor']).nullable().optional(),
  paymentTerms: z.enum(['Due on Receipt', 'Net 7', 'Net 15', 'Net 30', 'Net 60']).nullable().optional(),
  address: addressSchema.nullable(),
  tags: z.array(z.string()).optional(),
  notes: z.string().nullable().optional(),
});

export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;

export const listCustomersInputSchema = paginationInputSchema.extend({
  customerType: z.string().optional(),
  search: z.string().optional(),
  isActive: z.boolean().optional(),
  tag: z.string().optional(),
});

export type ListCustomersInput = z.infer<typeof listCustomersInputSchema>;
