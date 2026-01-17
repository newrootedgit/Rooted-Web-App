/**
 * Winston Logger Factory
 *
 * Creates configured Winston logger instances with environment-aware formatting.
 * - Development: Pretty console output with colors
 * - Production: JSON structured logging for aggregation
 */

import winston from 'winston';
import type { LoggerConfig, LogContext, Logger } from './types.js';

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

/**
 * Custom format for development: colorized, human-readable output.
 */
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    const stackStr = stack ? `\n${stack}` : '';
    return `${timestamp} ${level}: ${message}${metaStr}${stackStr}`;
  })
);

/**
 * JSON format for production: structured logging with all context.
 */
const prodFormat = combine(
  timestamp({ format: 'ISO' }),
  errors({ stack: true }),
  json()
);

/**
 * Creates a new Winston logger instance.
 */
export function createLogger(config: LoggerConfig): Logger {
  const { service, level, environment } = config;

  const winstonLogger = winston.createLogger({
    level,
    defaultMeta: { service },
    format: environment === 'production' ? prodFormat : devFormat,
    transports: [new winston.transports.Console()],
  });

  return wrapLogger(winstonLogger);
}

/**
 * Wraps Winston logger to provide a consistent interface with child logger support.
 */
function wrapLogger(winstonLogger: winston.Logger): Logger {
  return {
    error: (message: string, meta?: LogContext) => winstonLogger.error(message, meta),
    warn: (message: string, meta?: LogContext) => winstonLogger.warn(message, meta),
    info: (message: string, meta?: LogContext) => winstonLogger.info(message, meta),
    http: (message: string, meta?: LogContext) => winstonLogger.http(message, meta),
    debug: (message: string, meta?: LogContext) => winstonLogger.debug(message, meta),
    child: (context: LogContext) => wrapLogger(winstonLogger.child(context)),
  };
}
