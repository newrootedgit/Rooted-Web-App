import { z } from 'zod';
/**
 * Default pagination configuration
 */
export declare const PAGINATION_DEFAULTS: {
    readonly limit: 20;
    readonly maxLimit: 100;
};
/**
 * Cursor-based pagination input schema
 *
 * Usage: Merge with your procedure's input schema or use directly
 */
export declare const paginationInputSchema: z.ZodObject<{
    cursor: z.ZodOptional<z.ZodString>;
    limit: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    cursor?: string | undefined;
    limit?: number | undefined;
}, {
    cursor?: string | undefined;
    limit?: number | undefined;
}>;
export type PaginationInput = z.infer<typeof paginationInputSchema>;
/**
 * Generic paginated response type
 */
export interface PaginatedResponse<T> {
    items: T[];
    nextCursor: string | null;
    hasMore: boolean;
}
/**
 * Creates a paginated response schema for a given item schema
 */
export declare function createPaginatedResponseSchema<T extends z.ZodTypeAny>(itemSchema: T): z.ZodObject<{
    items: z.ZodArray<T, "many">;
    nextCursor: z.ZodNullable<z.ZodString>;
    hasMore: z.ZodBoolean;
}, "strip", z.ZodTypeAny, {
    items: T["_output"][];
    nextCursor: string | null;
    hasMore: boolean;
}, {
    items: T["_input"][];
    nextCursor: string | null;
    hasMore: boolean;
}>;
//# sourceMappingURL=schemas.d.ts.map