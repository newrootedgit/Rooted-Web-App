import { z } from 'zod';
export declare const addMachineSchema: z.ZodObject<{
    name: z.ZodString;
    displayName: z.ZodOptional<z.ZodString>;
    deviceId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    deviceId: string;
    displayName?: string | undefined;
}, {
    name: string;
    deviceId: string;
    displayName?: string | undefined;
}>;
export declare const getMachineParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
export declare const getByDeviceIdSchema: z.ZodObject<{
    deviceId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    deviceId: string;
}, {
    deviceId: string;
}>;
export declare const deleteMachineSchema: z.ZodObject<{
    deviceId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    deviceId: string;
}, {
    deviceId: string;
}>;
export type AddMachineInput = z.infer<typeof addMachineSchema>;
export type GetMachineParams = z.infer<typeof getMachineParamsSchema>;
export interface Machine {
    id: string;
    tenantId: string | null;
    farmId: string | null;
    name: string;
    displayName: string | null;
    deviceId: string;
    createdAt: Date | null;
    awsIotThingName?: string | null;
    status?: 'online' | 'offline';
    lastSeenAt?: Date | null;
    currentWifiSsid?: string | null;
}
//# sourceMappingURL=types.d.ts.map