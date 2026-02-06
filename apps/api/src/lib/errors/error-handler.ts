/**
 * Fastify Error Handler Plugin
 *
 * Global error handler that transforms errors to RFC 7807 Problem Details format.
 * Handles AppError, Zod validation errors, and Prisma errors.
 */

import type { FastifyPluginAsync, FastifyRequest, FastifyReply, FastifyError } from 'fastify';
import fp from 'fastify-plugin';
import { ZodError } from 'zod';
import { AppError } from './base-error.js';
import { ValidationError, InternalServerError, NotFoundError, ConflictError } from './http-errors.js';
import type { ErrorResponse, FieldError } from './types.js';
import type { Logger } from '../logger/types.js';

interface ErrorHandlerOptions {
  logger: Logger;
}

/**
 * Transforms a Zod validation error to a ValidationError with field-level details.
 */
function fromZodError(error: ZodError): ValidationError {
  const fieldErrors: FieldError[] = error.errors.map((issue) => ({
    field: issue.path.join('.'),
    message: issue.message,
    code: issue.code,
  }));
  return new ValidationError('Request validation failed', fieldErrors);
}

/**
 * Checks if an error is a Prisma known error.
 */
function isPrismaError(error: unknown): error is { code: string; meta?: { target?: string[] } } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'code' in error &&
    typeof (error as { code: unknown }).code === 'string' &&
    (error as { code: string }).code.startsWith('P')
  );
}

/**
 * Transforms Prisma errors to appropriate AppError instances.
 */
function fromPrismaError(error: { code: string; meta?: { target?: string[] } }): AppError {
  switch (error.code) {
    case 'P2002': // Unique constraint violation
      const fields = error.meta?.target?.join(', ') || 'unknown';
      return new ConflictError(`Duplicate value for: ${fields}`);
    case 'P2025': // Record not found
      return new NotFoundError('Record not found');
    default:
      return new InternalServerError(`Database error: ${error.code}`);
  }
}

/**
 * Builds an RFC 7807 compliant error response.
 */
function buildErrorResponse(
  error: AppError,
  request: FastifyRequest,
  includeStack: boolean
): ErrorResponse {
  const response: ErrorResponse = {
    type: `/errors/${error.code.toLowerCase().replace(/_/g, '-')}`,
    title: error.name.replace(/Error$/, '').replace(/([A-Z])/g, ' $1').trim(),
    status: error.statusCode,
    detail: error.message,
    code: error.code,
    instance: request.url,
    requestId: request.id,
  };

  if (error.errors && error.errors.length > 0) {
    response.errors = error.errors;
  }

  if (includeStack && error.stack) {
    response.stack = error.stack;
  }

  return response;
}

/**
 * Fastify error handler plugin.
 */
const errorHandlerPlugin: FastifyPluginAsync<ErrorHandlerOptions> = async (fastify, options) => {
  const { logger } = options;
  const isDev = process.env.NODE_ENV !== 'production';

  fastify.setErrorHandler((error: FastifyError | Error, request: FastifyRequest, reply: FastifyReply) => {
    let appError: AppError;

    // Transform known error types to AppError
    if (error instanceof AppError) {
      appError = error;
    } else if (error instanceof ZodError) {
      appError = fromZodError(error);
    } else if (isPrismaError(error)) {
      appError = fromPrismaError(error);
    } else {
      // Unknown error - wrap as InternalServerError
      appError = new InternalServerError(
        isDev ? error.message : 'An unexpected error occurred',
        error instanceof Error ? error : undefined
      );
    }

    // Log the error
    const logContext = {
      requestId: request.id,
      statusCode: appError.statusCode,
      code: appError.code,
      url: request.url,
      method: request.method,
      ...appError.context,
    };

    if (appError.isOperational) {
      // Operational errors are expected (4xx, validation, etc.)
      logger.warn(appError.message, logContext);
    } else {
      // Programmer errors need attention (5xx, unexpected)
      logger.error(appError.message, { ...logContext, err: appError });
    }

    // Build and send response
    const response = buildErrorResponse(appError, request, isDev);
    reply.status(appError.statusCode).send(response);
  });
};

export const errorHandler = fp(errorHandlerPlugin, {
  name: 'error-handler',
});
