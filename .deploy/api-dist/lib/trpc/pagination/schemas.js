import { z } from 'zod';
/**
 * Default pagination configuration
 */
export const PAGINATION_DEFAULTS = {
    limit: 20,
    maxLimit: 100,
};
/**
 * Cursor-based pagination input schema
 *
 * Usage: Merge with your procedure's input schema or use directly
 */
export const paginationInputSchema = z.object({
    cursor: z.string().uuid().optional(),
    limit: z
        .number()
        .int()
        .min(1)
        .max(PAGINATION_DEFAULTS.maxLimit)
        .default(PAGINATION_DEFAULTS.limit)
        .optional(),
});
/**
 * Creates a paginated response schema for a given item schema
 */
export function createPaginatedResponseSchema(itemSchema) {
    return z.object({
        items: z.array(itemSchema),
        nextCursor: z.string().uuid().nullable(),
        hasMore: z.boolean(),
    });
}
//# sourceMappingURL=schemas.js.map