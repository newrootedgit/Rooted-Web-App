/**
 * Error Types
 *
 * RFC 7807 Problem Details compliant error response types.
 * https://datatracker.ietf.org/doc/html/rfc7807
 */
/**
 * Field-level validation error for form inputs.
 */
export interface FieldError {
    field: string;
    message: string;
    code?: string;
}
/**
 * RFC 7807 Problem Details response format.
 *
 * @example
 * {
 *   "type": "/errors/validation",
 *   "title": "Validation Error",
 *   "status": 422,
 *   "detail": "Request validation failed",
 *   "code": "VALIDATION_ERROR",
 *   "instance": "/api/products",
 *   "requestId": "abc-123",
 *   "errors": [
 *     { "field": "name", "message": "Name is required" }
 *   ]
 * }
 */
export interface ErrorResponse {
    /** URI reference identifying the problem type */
    type: string;
    /** Short, human-readable summary */
    title: string;
    /** HTTP status code */
    status: number;
    /** Human-readable explanation specific to this occurrence */
    detail: string;
    /** Machine-readable error code */
    code: string;
    /** URI reference identifying the specific occurrence (request path) */
    instance?: string;
    /** Request correlation ID for tracing */
    requestId?: string;
    /** Field-level validation errors */
    errors?: FieldError[];
    /** Stack trace (development only) */
    stack?: string;
}
/**
 * Options for constructing an AppError.
 */
export interface AppErrorOptions {
    /** HTTP status code (default: 500) */
    statusCode?: number;
    /** Machine-readable error code */
    code: string;
    /** Whether this is an expected operational error (default: true) */
    isOperational?: boolean;
    /** Additional context for logging */
    context?: Record<string, unknown>;
    /** Field-level validation errors */
    errors?: FieldError[];
    /** Original error that caused this */
    cause?: Error;
}
//# sourceMappingURL=types.d.ts.map