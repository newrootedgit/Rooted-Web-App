/**
 * Base Application Error
 *
 * All custom errors extend this class. Provides structured error handling
 * with status codes, error codes, and operational/programmer error distinction.
 */
import type { AppErrorOptions, FieldError } from './types.js';
export declare class AppError extends Error {
    /** HTTP status code */
    readonly statusCode: number;
    /** Machine-readable error code (e.g., "NOT_FOUND", "VALIDATION_ERROR") */
    readonly code: string;
    /** Operational errors are expected (e.g., validation); programmer errors are bugs */
    readonly isOperational: boolean;
    /** Additional context for logging (not exposed to clients) */
    readonly context?: Record<string, unknown>;
    /** Field-level validation errors */
    readonly errors?: FieldError[];
    constructor(message: string, options: AppErrorOptions);
    /**
     * Converts the error to a JSON-serializable object for logging.
     */
    toJSON(): Record<string, unknown>;
}
//# sourceMappingURL=base-error.d.ts.map