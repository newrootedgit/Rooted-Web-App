/**
 * HTTP Error Classes
 *
 * Pre-configured error classes for common HTTP error scenarios.
 * All extend AppError with appropriate status codes and error codes.
 */
import { AppError } from './base-error.js';
/**
 * 400 Bad Request - Invalid or malformed request.
 */
export class BadRequestError extends AppError {
    constructor(message, context) {
        super(message, {
            statusCode: 400,
            code: 'BAD_REQUEST',
            context,
        });
    }
}
/**
 * 401 Unauthorized - Authentication required.
 */
export class UnauthorizedError extends AppError {
    constructor(message = 'Authentication required', context) {
        super(message, {
            statusCode: 401,
            code: 'UNAUTHORIZED',
            context,
        });
    }
}
/**
 * 403 Forbidden - Access denied (authenticated but not authorized).
 */
export class ForbiddenError extends AppError {
    constructor(message = 'Access denied', context) {
        super(message, {
            statusCode: 403,
            code: 'FORBIDDEN',
            context,
        });
    }
}
/**
 * 404 Not Found - Resource does not exist.
 */
export class NotFoundError extends AppError {
    constructor(message = 'Resource not found', context) {
        super(message, {
            statusCode: 404,
            code: 'NOT_FOUND',
            context,
        });
    }
}
/**
 * 409 Conflict - Resource conflict (e.g., duplicate entry).
 */
export class ConflictError extends AppError {
    constructor(message, context) {
        super(message, {
            statusCode: 409,
            code: 'CONFLICT',
            context,
        });
    }
}
/**
 * 422 Unprocessable Entity - Validation failed with field-level errors.
 */
export class ValidationError extends AppError {
    constructor(message, errors, context) {
        super(message, {
            statusCode: 422,
            code: 'VALIDATION_ERROR',
            errors,
            context,
        });
    }
}
/**
 * 500 Internal Server Error - Unexpected server error.
 */
export class InternalServerError extends AppError {
    constructor(message = 'Internal server error', cause, context) {
        super(message, {
            statusCode: 500,
            code: 'INTERNAL_ERROR',
            isOperational: false,
            cause,
            context,
        });
    }
}
//# sourceMappingURL=http-errors.js.map