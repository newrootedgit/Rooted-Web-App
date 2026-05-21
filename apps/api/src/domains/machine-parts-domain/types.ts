import { z } from 'zod';

export const PART_METRIC = ['HOURS', 'CYCLES'] as const;
export type PartMetric = (typeof PART_METRIC)[number];

export const PART_USAGE_SOURCE = [
  'belt_motor_runtime',
  'blade_motor_runtime',
  'roller_motor_runtime',
  'trays_processed',
] as const;
export type PartUsageSource = (typeof PART_USAGE_SOURCE)[number];

export const PART_STATUS = ['OK', 'WARNING', 'CRITICAL'] as const;
export type PartStatus = (typeof PART_STATUS)[number];

export const listMachinePartsSchema = z.object({
  machineId: z.string().uuid(),
});

export const replacePartSchema = z.object({
  machinePartId: z.string().uuid(),
  notes: z.string().max(1000).optional(),
});

export type ListMachinePartsInput = z.infer<typeof listMachinePartsSchema>;
export type ReplacePartInput = z.infer<typeof replacePartSchema>;

export interface MachinePart {
  id: string;
  partTypeId: string;
  name: string;
  metric: PartMetric;
  usageSource: PartUsageSource;
  lifespan: number;
  warningPct: number;
  criticalPct: number;
  installedAt: string;
  lastReplacedAt: string | null;

  // Computed
  usageSoFar: number;
  wearPct: number;
  status: PartStatus;
  estimatedDaysRemaining: number | null;
}

export interface MachinePartsResponse {
  machineId: string;
  machineType: 'SEEDER' | 'HARVESTER' | 'OTHER';
  parts: MachinePart[];
}
