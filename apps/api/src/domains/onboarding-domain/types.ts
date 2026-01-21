import { z } from 'zod';

export const createTenantAndFarmSchema = z.object({
  farmName: z.string().min(2).max(255),
});

export type CreateTenantAndFarmInput = z.infer<typeof createTenantAndFarmSchema>;

export interface OnboardingStatus {
  needsOnboarding: boolean;
  status: 'no_farm' | 'has_farm';
  farm?: {
    id: string;
    name: string;
    slug: string;
    tenantId: string;
  };
}

export interface CreateTenantAndFarmResult {
  tenantId: string;
  farmId: string;
  farmSlug: string;
}

export interface UserFarm {
  farmId: string;
  name: string;
  slug: string;
  role: string;
}
