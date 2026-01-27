import { z } from 'zod';
export declare const createTenantAndFarmSchema: z.ZodObject<{
    farmName: z.ZodString;
    userEmail: z.ZodString;
}, "strip", z.ZodTypeAny, {
    farmName: string;
    userEmail: string;
}, {
    farmName: string;
    userEmail: string;
}>;
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
//# sourceMappingURL=types.d.ts.map