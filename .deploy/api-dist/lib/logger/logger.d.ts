/**
 * Winston Logger Factory
 *
 * Creates configured Winston logger instances with environment-aware formatting.
 * - Development: Pretty console output with colors
 * - Production: JSON structured logging for aggregation
 */
import type { LoggerConfig, Logger } from './types.js';
/**
 * Creates a new Winston logger instance.
 */
export declare function createLogger(config: LoggerConfig): Logger;
//# sourceMappingURL=logger.d.ts.map