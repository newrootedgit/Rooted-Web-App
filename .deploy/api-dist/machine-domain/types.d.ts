import { z } from 'zod';
export declare const addMachineSchema: z.ZodObject<{
    name: z.ZodString;
    deviceId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    name: string;
    deviceId: string;
}, {
    name: string;
    deviceId: string;
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
export type AddMachineInput = z.infer<typeof addMachineSchema>;
export type GetMachineParams = z.infer<typeof getMachineParamsSchema>;
export interface Machine {
    id: string;
    tenantId: string | null;
    farmId: string | null;
    name: string;
    deviceId: string;
    createdAt: Date | null;
}
//# sourceMappingURL=types.d.ts.map