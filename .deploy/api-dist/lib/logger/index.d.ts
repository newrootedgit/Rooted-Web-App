/**
 * Logger Module
 *
 * Winston-based logging with environment-aware formatting.
 *
 * @example
 * import { createLogger } from './lib/logger/index.js';
 *
 * const logger = createLogger({
 *   service: 'rooted-api',
 *   level: 'info',
 *   environment: 'development'
 * });
 *
 * logger.info('Server started', { port: 8000 });
 *
 * // Create child logger with request context
 * const reqLogger = logger.child({ requestId: 'abc123', farmId: 'farm-1' });
 * reqLogger.info('Processing request');
 */
export { createLogger } from './logger.js';
export type { Logger, LoggerConfig, LogContext, LogLevel, Environment } from './types.js';
//# sourceMappingURL=index.d.ts.map