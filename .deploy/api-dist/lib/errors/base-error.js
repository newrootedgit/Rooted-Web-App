/**
 * Base Application Error
 *
 * All custom errors extend this class. Provides structured error handling
 * with status codes, error codes, and operational/programmer error distinction.
 */
export class AppError extends Error {
    /** HTTP status code */
    statusCode;
    /** Machine-readable error code (e.g., "NOT_FOUND", "VALIDATION_ERROR") */
    code;
    /** Operational errors are expected (e.g., validation); programmer errors are bugs */
    isOperational;
    /** Additional context for logging (not exposed to clients) */
    context;
    /** Field-level validation errors */
    errors;
    constructor(message, options) {
        super(message, { cause: options.cause });
        this.name = this.constructor.name;
        this.statusCode = options.statusCode ?? 500;
        this.code = options.code;
        this.isOperational = options.isOperational ?? true;
        this.context = options.context;
        this.errors = options.errors;
        // Capture stack trace, excluding constructor call
        Error.captureStackTrace(this, this.constructor);
    }
    /**
     * Converts the error to a JSON-serializable object for logging.
     */
    toJSON() {
        return {
            name: this.name,
            message: this.message,
            statusCode: this.statusCode,
            code: this.code,
            isOperational: this.isOperational,
            context: this.context,
            errors: this.errors,
            stack: this.stack,
        };
    }
}
//# sourceMappingURL=base-error.js.map