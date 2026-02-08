import { z } from 'zod';
import { paginationInputSchema } from '../../../lib/trpc/pagination/index.js';

// ─── Domain Interfaces ───────────────────────────────────────────────

export interface CanvasElement {
  id: string;
  type: string;
  position: { x: number; y: number };
  dimensions: { width: number; height: number };
  rotation: number;
  color: string;
  properties: Record<string, any>;
}

export interface FarmLayout {
  id: string;
  farmId: string | null;
  name: string;
  canvasData: { elements: CanvasElement[] };
  isActive: boolean | null;
  createdAt: Date | null;
}

// ─── Input Schemas ───────────────────────────────────────────────────

export const getByIdSchema = z.object({
  id: z.string().uuid(),
});

export type GetByIdInput = z.infer<typeof getByIdSchema>;

export const canvasElementSchema = z.object({
  id: z.string(),
  type: z.string(),
  position: z.object({ x: z.number(), y: z.number() }),
  dimensions: z.object({ width: z.number(), height: z.number() }),
  rotation: z.number().default(0),
  color: z.string(),
  properties: z.record(z.any()).default({}),
});

export const createLayoutSchema = z.object({
  name: z.string().min(1).max(255),
  canvasData: z.object({ elements: z.array(canvasElementSchema) }).default({ elements: [] }),
  isActive: z.boolean().default(false),
});

export type CreateLayoutInput = z.infer<typeof createLayoutSchema>;

export const updateLayoutSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  canvasData: z.object({ elements: z.array(canvasElementSchema) }).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateLayoutInput = z.infer<typeof updateLayoutSchema>;

export const listLayoutsInputSchema = paginationInputSchema
  .omit({ cursor: true })
  .extend({
    cursor: z.string().optional(),
  });

export type ListLayoutsInput = z.infer<typeof listLayoutsInputSchema>;
