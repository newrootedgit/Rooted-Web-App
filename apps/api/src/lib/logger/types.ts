/**
 * Logger Types
 *
 * Type definitions for the Winston-based logging system.
 */

export type LogLevel = 'error' | 'warn' | 'info' | 'http' | 'debug';

export type Environment = 'development' | 'production' | 'test';

/**
 * Context that can be attached to log entries.
 * Supports multi-tenant context with farmId.
 */
export interface LogContext {
  requestId?: string;
  farmId?: string;
  userId?: string;
  [key: string]: unknown;
}

/**
 * Configuration options for creating a logger instance.
 */
export interface LoggerConfig {
  /** Service name included in all log entries */
  service: string;
  /** Minimum log level to output */
  level: LogLevel;
  /** Environment determines log format (pretty vs JSON) */
  environment: Environment;
}

/**
 * Logger interface matching Winston's Logger with child support.
 */
export interface Logger {
  error(message: string, meta?: LogContext): void;
  warn(message: string, meta?: LogContext): void;
  info(message: string, meta?: LogContext): void;
  http(message: string, meta?: LogContext): void;
  debug(message: string, meta?: LogContext): void;
  child(context: LogContext): Logger;
}
