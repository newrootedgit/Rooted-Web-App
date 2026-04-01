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
  totalSteps?: string | null;
  totalUptimeMs?: string | null;
  currentBootUptimeMs?: string | null;
  rebootCount?: number | null;
  beltFaultCount?: number | null;
  bladeFaultCount?: number | null;
  trayCount?: number | null;
  lastBeltFault?: number | null;
  lastBladeFault?: number | null;
  beltMotorUptimeMs?: string | null;
  bladeMotorUptimeMs?: string | null;
  lastEventCode?: string | null;
  lastEventValue?: number | null;
  lastEventAt?: Date | null;
}


// Presets ----------------------------------

export const varietyPresetSchema = z.record(
  z.string().min(1).max(100),
  z.number().finite()
);

export const variableRangeSchema = z.object({
  min: z.number(),
  max: z.number(),
});

export const machineConfigSchema = z.object({
  ready_to_run: z.boolean(),
  active_variety: z.number().int().min(1).max(20).nullable(),
  variable_ranges: z.record(z.string(), variableRangeSchema).optional(),
  variety_names: z.record(z.string(), z.string()).optional(),
}).catchall(varietyPresetSchema);

export type VarietyPreset = z.infer<typeof varietyPresetSchema>;
export type VariableRange = z.infer<typeof variableRangeSchema>;
export type MachineConfig = z.infer<typeof machineConfigSchema>;

export const getConfigResponseSchema = z.object({
  requestId: z.string().uuid(),
});

export const updateConfigSchema = z.object({
  machineId: z.string().uuid(),
  presets: z.record(
    z.string().regex(/^([1-9]|1[0-9]|20)$/),
    varietyPresetSchema
  ).optional(),
  variety_names: z.record(
    z.string().regex(/^([1-9]|1[0-9]|20)$/),
    z.string().min(1).max(12)
  ).optional(),
});

export const requestConfigSchema = z.object({
  machineId: z.string().uuid(),
});
