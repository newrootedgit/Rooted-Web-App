/**
 * Logger Module
 *
 * Winston-based logging with environment-aware formatting.
 * Exports a shared application logger and context helpers.
 */

import { createLogger, addLogContext, getLogContext, setLogContext, withLogContext } from './logger.js';
import type { Environment, LogLevel } from './types.js';

const environment = (process.env.NODE_ENV as Environment) || 'development';
const level =
  (process.env.LOG_LEVEL as LogLevel) || (environment === 'production' ? 'info' : 'debug');
const service = process.env.SERVICE_NAME || 'rooted-api';

export const logger = createLogger({
  service,
  level,
  environment,
});

export { createLogger, addLogContext, getLogContext, setLogContext, withLogContext };
export type { Logger, LoggerConfig, LogContext, LogLevel, Environment } from './types.js';
