import type { PaginatedResponse, PaginationInput } from './schemas.js';
/**
 * Prisma query options for cursor-based pagination
 */
export interface PrismaPaginationOptions {
    cursor?: {
        id: string;
    };
    take: number;
    skip?: number;
}
/**
 * Generates Prisma query options for cursor-based pagination
 *
 * @param input - Pagination input from the request
 * @returns Prisma-compatible pagination options
 */
export declare function getPrismaPaginationOptions(input: PaginationInput): PrismaPaginationOptions;
/**
 * Transforms a Prisma result array into a paginated response
 *
 * @param items - Items returned from Prisma (should include +1 for hasMore check)
 * @param input - Original pagination input
 * @param cursorField - Field to use for the cursor (default: 'id')
 * @returns Paginated response with items, nextCursor, and hasMore
 */
export declare function createPaginatedResponse<T extends {
    id: string;
}>(items: T[], input: PaginationInput, cursorField?: keyof T & string): PaginatedResponse<T>;
//# sourceMappingURL=helpers.d.ts.map