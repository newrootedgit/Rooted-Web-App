import { z } from 'zod';
import { paginationInputSchema } from '../../../lib/trpc/pagination/index.js';

// ─── Domain Interfaces ───────────────────────────────────────────────

export interface ProductCategory {
  id: string;
  farmId: string | null;
  name: string;
  description: string | null;
  createdAt: Date | null;
}

export interface Product {
  id: string;
  farmId: string | null;
  categoryId: string | null;
  name: string;
  sku: string | null;
  daysSoaking: number;
  daysGermination: number;
  daysLight: number;
  avgYieldPerTray: number | null;
  seedWeight: number | null;
  seedUnit: string | null;
  unitCost: number | null;
  unitPrice: number | null;
  isActive: boolean | null;
  createdAt: Date | null;
}

export interface BlendIngredient {
  id: string;
  blendId: string | null;
  productId: string | null;
  percentage: number;
  timingOverride: unknown | null;
  product?: Product;
}

export interface Blend {
  id: string;
  farmId: string | null;
  name: string;
  description: string | null;
  createdAt: Date | null;
  ingredients?: BlendIngredient[];
}

// ─── Input Schemas ───────────────────────────────────────────────────

export const getByIdSchema = z.object({
  id: z.string().uuid(),
});

export type GetByIdInput = z.infer<typeof getByIdSchema>;

// Products

export const createProductSchema = z.object({
  name: z.string().min(1).max(255),
  categoryId: z.string().uuid().optional(),
  sku: z.string().max(100).optional(),
  daysSoaking: z.number().int().min(0),
  daysGermination: z.number().int().min(0),
  daysLight: z.number().int().min(0),
  avgYieldPerTray: z.number().min(0).optional(),
  seedWeight: z.number().min(0).optional(),
  seedUnit: z.string().max(50).optional(),
  unitCost: z.number().min(0).optional(),
  unitPrice: z.number().min(0).optional(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export const updateProductSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  categoryId: z.string().uuid().nullable().optional(),
  sku: z.string().max(100).nullable().optional(),
  daysSoaking: z.number().int().min(0).optional(),
  daysGermination: z.number().int().min(0).optional(),
  daysLight: z.number().int().min(0).optional(),
  avgYieldPerTray: z.number().min(0).nullable().optional(),
  seedWeight: z.number().min(0).nullable().optional(),
  seedUnit: z.string().max(50).nullable().optional(),
  unitCost: z.number().min(0).nullable().optional(),
  unitPrice: z.number().min(0).nullable().optional(),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export const listProductsInputSchema = paginationInputSchema.extend({
  categoryId: z.string().uuid().optional(),
  search: z.string().optional(),
  isActive: z.boolean().optional(),
});

export type ListProductsInput = z.infer<typeof listProductsInputSchema>;

// Categories

export const createCategorySchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

export const updateCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
});

export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

// Blends

const blendIngredientInputSchema = z.object({
  productId: z.string().uuid(),
  percentage: z.number().min(0).max(100),
  timingOverride: z.unknown().optional(),
});

export const createBlendSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  ingredients: z.array(blendIngredientInputSchema).min(1),
});

export type CreateBlendInput = z.infer<typeof createBlendSchema>;

export const updateBlendSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  description: z.string().nullable().optional(),
  ingredients: z.array(blendIngredientInputSchema).min(1).optional(),
});

export type UpdateBlendInput = z.infer<typeof updateBlendSchema>;
