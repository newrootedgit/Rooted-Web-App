import { z } from 'zod';

export const createTenantSchema = z.object({
  name: z.string().min(2).max(255),
  slug: z.string().min(2).max(255),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().max(50).optional(),
});

export const createFarmSchema = z.object({
  tenantId: z.string().uuid(),
  name: z.string().min(2).max(255),
  slug: z.string().min(2).max(255),
  contactEmail: z.string().email().optional(),
  contactPhone: z.string().max(50).optional(),
});

export const createFarmUserSchema = z.object({
  tenantId: z.string().uuid(),
  farmId: z.string().uuid(),
  clerkUserId: z.string().min(1).max(255),
  role: z.enum(['OWNER', 'ADMIN', 'FARM_MANAGER', 'FARM_OPERATOR']),
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  email: z.string().email().optional(),
});

export interface UserFarm {
  farmId: string;
  name: string;
  slug: string;
  role: string;
}
