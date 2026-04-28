import { z } from 'zod';

export const createTenantAndFarmSchema = z.object({
  farmName: z.string().min(2).max(255),
  userEmail: z.string().email(),
});

export type CreateTenantAndFarmInput = z.infer<typeof createTenantAndFarmSchema>;

export const completeMachineTutorialSchema = z.object({
  outcome: z.enum(['completed', 'dismissed']),
});

export type CompleteMachineTutorialInput = z.infer<typeof completeMachineTutorialSchema>;

export interface OnboardingStatus {
  needsOnboarding: boolean;
  status: 'no_farm' | 'has_farm';
  farm?: {
    id: string;
    name: string;
    slug: string;
    tenantId: string;
  };
  tutorial: {
    machineTutorialCompletedAt: Date | null;
    machineTutorialDismissedAt: Date | null;
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
