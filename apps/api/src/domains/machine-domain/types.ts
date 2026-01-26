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
