import { z } from 'zod';

// Request schemas
export const getTenantMachinesInput = z.object({
  tenantId: z.string().uuid(),
});

export const getTenantFarmsInput = z.object({
  tenantId: z.string().uuid(),
});

export const deleteMachineInput = z.object({
  machineId: z.string().uuid(),
});

export const deleteFarmInput = z.object({
  farmId: z.string().uuid(),
});

// Response types
export const tenantSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  contact_email: z.string().nullable(),
  created_at: z.date().nullable(),
  _count: z.object({
    farms: z.number(),
    machines: z.number(),
  }),
});

export const machineSchema = z.object({
  id: z.string(),
  tenant_id: z.string().nullable(),
  farm_id: z.string().nullable(),
  name: z.string(),
  device_id: z.string(),
  status: z.string().nullable(),
  last_seen_at: z.date().nullable(),
  current_wifi_ssid: z.string().nullable(),
  farms: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
  }).nullable(),
});

export const farmSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  contact_email: z.string().nullable(),
  created_at: z.date().nullable(),
  _count: z.object({
    machines: z.number(),
  }),
});

export type GetTenantMachinesInput = z.infer<typeof getTenantMachinesInput>;
export type GetTenantFarmsInput = z.infer<typeof getTenantFarmsInput>;
export type DeleteMachineInput = z.infer<typeof deleteMachineInput>;
export type DeleteFarmInput = z.infer<typeof deleteFarmInput>;
export type Tenant = z.infer<typeof tenantSchema>;
export type Machine = z.infer<typeof machineSchema>;
export type Farm = z.infer<typeof farmSchema>;
