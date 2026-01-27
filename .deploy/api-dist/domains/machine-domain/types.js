import { z } from 'zod';
export const addMachineSchema = z.object({
    name: z.string().min(1).max(255),
    displayName: z.string().min(1).max(255).optional(),
    deviceId: z.string().min(1).max(255),
});
export const getMachineParamsSchema = z.object({
    id: z.string().uuid(),
});
export const getByDeviceIdSchema = z.object({
    deviceId: z.string().min(1),
});
export const deleteMachineSchema = z.object({
    deviceId: z.string().min(1),
});
//# sourceMappingURL=types.js.map