/**
 * Fastify Error Handler Plugin
 *
 * Global error handler that transforms errors to RFC 7807 Problem Details format.
 * Handles AppError, Zod validation errors, and Prisma errors.
 */
import type { FastifyPluginAsync } from 'fastify';
import type { Logger } from '../logger/types.js';
interface ErrorHandlerOptions {
    logger: Logger;
}
export declare const errorHandler: FastifyPluginAsync<ErrorHandlerOptions>;
export {};
//# sourceMappingURL=error-handler.d.ts.map