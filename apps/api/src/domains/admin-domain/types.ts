import { z } from 'zod';

// Request schemas
export const getTenantMachinesInput = z.object({
  tenantId: z.string().uuid(),
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

export type GetTenantMachinesInput = z.infer<typeof getTenantMachinesInput>;
export type Tenant = z.infer<typeof tenantSchema>;
export type Machine = z.infer<typeof machineSchema>;
