import type { PaginatedResponse, PaginationInput } from './schemas.js';
import { PAGINATION_DEFAULTS } from './schemas.js';

/**
 * Prisma query options for cursor-based pagination
 */
export interface PrismaPaginationOptions {
  cursor?: { id: string };
  take: number;
  skip?: number;
}

/**
 * Generates Prisma query options for cursor-based pagination
 *
 * @param input - Pagination input from the request
 * @returns Prisma-compatible pagination options
 */
export function getPrismaPaginationOptions(
  input: PaginationInput
): PrismaPaginationOptions {
  const limit = input.limit ?? PAGINATION_DEFAULTS.limit;

  // Fetch one extra to determine if there are more results
  const take = limit + 1;

  if (input.cursor) {
    return {
      cursor: { id: input.cursor },
      take,
      skip: 1, // Skip the cursor item itself
    };
  }

  return { take };
}

/**
 * Transforms a Prisma result array into a paginated response
 *
 * @param items - Items returned from Prisma (should include +1 for hasMore check)
 * @param input - Original pagination input
 * @param cursorField - Field to use for the cursor (default: 'id')
 * @returns Paginated response with items, nextCursor, and hasMore
 */
export function createPaginatedResponse<T extends { id: string }>(
  items: T[],
  input: PaginationInput,
  cursorField: keyof T & string = 'id'
): PaginatedResponse<T> {
  const limit = input.limit ?? PAGINATION_DEFAULTS.limit;
  const hasMore = items.length > limit;

  // Remove the extra item we fetched for hasMore check
  const resultItems = hasMore ? items.slice(0, limit) : items;

  // Get the cursor for the last item
  const lastItem = resultItems[resultItems.length - 1];
  const nextCursor = hasMore && lastItem ? String(lastItem[cursorField]) : null;

  return {
    items: resultItems,
    nextCursor,
    hasMore,
  };
}
