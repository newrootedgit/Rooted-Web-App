import { z } from 'zod';

export const addMachineSchema = z.object({
  name: z.string().min(1).max(255),
  displayName: z.string().min(1).max(255).optional(),
  deviceId: z.string().min(1).max(255),
  currentWifiSsid: z.string().min(1).max(255).optional(),
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


// Presets ---------------------------------- 

export const varietyPresetSchema = z.record(z.string(), z.number()); 

export const machineConfigSchema = z.object({ 
  ready_to_run: z.boolean(),
  active_variety: z.number().int().min(1).max(20).nullable(),
}).catchall(varietyPresetSchema);

export type VarietyPreset = z.infer<typeof varietyPresetSchema>;
export type MachineConfig = z.infer<typeof machineConfigSchema>;

export const getConfigResponseSchema = z.object({
  requestId: z.string().uuid(),
});

export const updateConfigSchema = z.object({
  machineId: z.string().uuid(),
  presets: z.record(
    z.string().regex(/^([1-9]|1[0-9]|20)$/),
    varietyPresetSchema
  ),
});

export const requestConfigSchema = z.object({
  machineId: z.string().uuid(),
});


