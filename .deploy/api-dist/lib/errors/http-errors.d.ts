/**
 * HTTP Error Classes
 *
 * Pre-configured error classes for common HTTP error scenarios.
 * All extend AppError with appropriate status codes and error codes.
 */
import { AppError } from './base-error.js';
import type { FieldError } from './types.js';
/**
 * 400 Bad Request - Invalid or malformed request.
 */
export declare class BadRequestError extends AppError {
    constructor(message: string, context?: Record<string, unknown>);
}
/**
 * 401 Unauthorized - Authentication required.
 */
export declare class UnauthorizedError extends AppError {
    constructor(message?: string, context?: Record<string, unknown>);
}
/**
 * 403 Forbidden - Access denied (authenticated but not authorized).
 */
export declare class ForbiddenError extends AppError {
    constructor(message?: string, context?: Record<string, unknown>);
}
/**
 * 404 Not Found - Resource does not exist.
 */
export declare class NotFoundError extends AppError {
    constructor(message?: string, context?: Record<string, unknown>);
}
/**
 * 409 Conflict - Resource conflict (e.g., duplicate entry).
 */
export declare class ConflictError extends AppError {
    constructor(message: string, context?: Record<string, unknown>);
}
/**
 * 422 Unprocessable Entity - Validation failed with field-level errors.
 */
export declare class ValidationError extends AppError {
    constructor(message: string, errors: FieldError[], context?: Record<string, unknown>);
}
/**
 * 500 Internal Server Error - Unexpected server error.
 */
export declare class InternalServerError extends AppError {
    constructor(message?: string, cause?: Error, context?: Record<string, unknown>);
}
//# sourceMappingURL=http-errors.d.ts.map