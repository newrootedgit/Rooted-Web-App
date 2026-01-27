import { z } from 'zod';
export declare const createTenantSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    contactEmail: z.ZodOptional<z.ZodString>;
    contactPhone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    slug: string;
    contactEmail?: string | undefined;
    contactPhone?: string | undefined;
}, {
    name: string;
    slug: string;
    contactEmail?: string | undefined;
    contactPhone?: string | undefined;
}>;
export declare const createFarmSchema: z.ZodObject<{
    tenantId: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
    contactEmail: z.ZodOptional<z.ZodString>;
    contactPhone: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    slug: string;
    tenantId: string;
    contactEmail?: string | undefined;
    contactPhone?: string | undefined;
}, {
    name: string;
    slug: string;
    tenantId: string;
    contactEmail?: string | undefined;
    contactPhone?: string | undefined;
}>;
export declare const createFarmUserSchema: z.ZodObject<{
    tenantId: z.ZodString;
    farmId: z.ZodString;
    clerkUserId: z.ZodString;
    role: z.ZodEnum<["OWNER", "ADMIN", "FARM_MANAGER", "FARM_OPERATOR"]>;
    firstName: z.ZodOptional<z.ZodString>;
    lastName: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    farmId: string;
    role: "OWNER" | "ADMIN" | "FARM_MANAGER" | "FARM_OPERATOR";
    tenantId: string;
    clerkUserId: string;
    email?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
}, {
    farmId: string;
    role: "OWNER" | "ADMIN" | "FARM_MANAGER" | "FARM_OPERATOR";
    tenantId: string;
    clerkUserId: string;
    email?: string | undefined;
    firstName?: string | undefined;
    lastName?: string | undefined;
}>;
export interface UserFarm {
    farmId: string;
    name: string;
    slug: string;
    role: string;
}
//# sourceMappingURL=types.d.ts.map