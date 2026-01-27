import { z } from 'zod';
export declare const getTenantMachinesInput: z.ZodObject<{
    tenantId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
}, {
    tenantId: string;
}>;
export declare const tenantSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    slug: z.ZodString;
    contact_email: z.ZodNullable<z.ZodString>;
    created_at: z.ZodNullable<z.ZodDate>;
    _count: z.ZodObject<{
        farms: z.ZodNumber;
        machines: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        farms: number;
        machines: number;
    }, {
        farms: number;
        machines: number;
    }>;
}, "strip", z.ZodTypeAny, {
    name: string;
    id: string;
    created_at: Date | null;
    slug: string;
    contact_email: string | null;
    _count: {
        farms: number;
        machines: number;
    };
}, {
    name: string;
    id: string;
    created_at: Date | null;
    slug: string;
    contact_email: string | null;
    _count: {
        farms: number;
        machines: number;
    };
}>;
export declare const machineSchema: z.ZodObject<{
    id: z.ZodString;
    tenant_id: z.ZodNullable<z.ZodString>;
    farm_id: z.ZodNullable<z.ZodString>;
    name: z.ZodString;
    device_id: z.ZodString;
    status: z.ZodNullable<z.ZodString>;
    last_seen_at: z.ZodNullable<z.ZodDate>;
    current_wifi_ssid: z.ZodNullable<z.ZodString>;
    farms: z.ZodNullable<z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        slug: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        name: string;
        id: string;
        slug: string;
    }, {
        name: string;
        id: string;
        slug: string;
    }>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    status: string | null;
    id: string;
    tenant_id: string | null;
    farm_id: string | null;
    farms: {
        name: string;
        id: string;
        slug: string;
    } | null;
    device_id: string;
    last_seen_at: Date | null;
    current_wifi_ssid: string | null;
}, {
    name: string;
    status: string | null;
    id: string;
    tenant_id: string | null;
    farm_id: string | null;
    farms: {
        name: string;
        id: string;
        slug: string;
    } | null;
    device_id: string;
    last_seen_at: Date | null;
    current_wifi_ssid: string | null;
}>;
export type GetTenantMachinesInput = z.infer<typeof getTenantMachinesInput>;
export type Tenant = z.infer<typeof tenantSchema>;
export type Machine = z.infer<typeof machineSchema>;
//# sourceMappingURL=types.d.ts.map