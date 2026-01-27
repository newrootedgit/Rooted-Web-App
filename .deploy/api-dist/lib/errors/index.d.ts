/**
 * Errors Module
 *
 * Structured error handling with RFC 7807 Problem Details format.
 *
 * @example
 * import { errorHandler, NotFoundError, ValidationError } from './lib/errors/index.js';
 *
 * // Register error handler plugin
 * await app.register(errorHandler, { logger });
 *
 * // Throw errors in routes/handlers
 * throw new NotFoundError('Product not found');
 * throw new ValidationError('Validation failed', [
 *   { field: 'email', message: 'Invalid email format' }
 * ]);
 */
export { AppError } from './base-error.js';
export { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError, ConflictError, ValidationError, InternalServerError, } from './http-errors.js';
export { errorHandler } from './error-handler.js';
export type { ErrorResponse, FieldError, AppErrorOptions } from './types.js';
//# sourceMappingURL=index.d.ts.map