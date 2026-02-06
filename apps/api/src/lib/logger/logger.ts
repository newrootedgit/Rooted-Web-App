/**
 * Winston Logger Factory
 *
 * Creates configured Winston logger instances with environment-aware formatting.
 * - Development: Pretty console output with colors
 * - Production: JSON structured logging for aggregation
 */

import { AsyncLocalStorage } from 'node:async_hooks';
import winston from 'winston';
import type { LoggerConfig, LogContext, Logger } from './types.js';

const { combine, timestamp, printf, colorize, json, errors } = winston.format;

const logContextStore = new AsyncLocalStorage<LogContext>();

const REDACTED = '[REDACTED]';
const REDACT_KEYS = new Set([
  'authorization',
  'cookie',
  'set-cookie',
  'x-api-key',
  'api-key',
  'password',
  'secret',
  'token',
  'access-token',
  'refresh-token',
  'id_token',
  'client_secret',
  'session',
  'jwt',
]);

export function withLogContext<T>(context: LogContext, fn: () => T): T {
  return logContextStore.run(context, fn);
}

export function setLogContext(context: LogContext): void {
  logContextStore.enterWith(context);
}

export function addLogContext(context: LogContext): void {
  const store = logContextStore.getStore();
  if (!store) {
    return;
  }
  Object.assign(store, context);
}

export function getLogContext(): LogContext | undefined {
  return logContextStore.getStore();
}

function shouldRedactKey(key: string): boolean {
  return REDACT_KEYS.has(key.toLowerCase());
}

function redactInPlace(value: unknown, seen: WeakSet<object>): void {
  if (!value || typeof value !== 'object') {
    return;
  }

  if (value instanceof Date) {
    return;
  }

  if (seen.has(value as object)) {
    return;
  }
  seen.add(value as object);

  if (Array.isArray(value)) {
    for (const item of value) {
      redactInPlace(item, seen);
    }
    return;
  }

  const record = value as Record<string, unknown>;
  for (const [key, val] of Object.entries(record)) {
    if (shouldRedactKey(key)) {
      record[key] = REDACTED;
      continue;
    }
    redactInPlace(val, seen);
  }
}

function serializeError(err: Error): Record<string, unknown> {
  const serialized: Record<string, unknown> = {
    name: err.name,
    message: err.message,
    stack: err.stack,
  };

  if ('code' in err) {
    serialized.code = (err as { code?: unknown }).code;
  }

  if (err.cause) {
    serialized.cause =
      err.cause instanceof Error
        ? { name: err.cause.name, message: err.cause.message, stack: err.cause.stack }
        : err.cause;
  }

  return serialized;
}

const normalizeErrors = winston.format((info) => {
  const err = (info as { err?: unknown; error?: unknown }).err ?? (info as { error?: unknown }).error;

  if (err instanceof Error) {
    info.err = serializeError(err);
    info.stack = err.stack;
    if (!info.message) {
      info.message = err.message;
    }
  } else if (err && typeof err === 'object') {
    info.err = err;
  }

  if ('error' in info) {
    delete (info as { error?: unknown }).error;
  }

  return info;
});

const redactFormat = winston.format((info) => {
  redactInPlace(info, new WeakSet());
  return info;
});

/**
 * Custom format for development: colorized, human-readable output.
 */
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: () => new Date().toISOString() }),
  errors({ stack: true }),
  normalizeErrors(),
  redactFormat(),
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
  timestamp({ format: () => new Date().toISOString() }),
  errors({ stack: true }),
  normalizeErrors(),
  redactFormat(),
  json()
);

/**
 * Creates a new Winston logger instance.
 */
export function createLogger(config: LoggerConfig): Logger {
  const { service, level, environment } = config;

  const winstonLogger = winston.createLogger({
    level,
    defaultMeta: { service, environment },
    format: environment === 'production' ? prodFormat : devFormat,
    transports: [new winston.transports.Console()],
  });

  return wrapLogger(winstonLogger);
}

/**
 * Wraps Winston logger to provide a consistent interface with child logger support.
 */
function wrapLogger(winstonLogger: winston.Logger): Logger {
  const mergeContext = (meta?: LogContext): LogContext | undefined => {
    const store = logContextStore.getStore();
    if (store && meta) {
      return { ...store, ...meta };
    }
    if (store) {
      return { ...store };
    }
    return meta;
  };

  return {
    error: (message: string, meta?: LogContext) => winstonLogger.error(message, mergeContext(meta)),
    warn: (message: string, meta?: LogContext) => winstonLogger.warn(message, mergeContext(meta)),
    info: (message: string, meta?: LogContext) => winstonLogger.info(message, mergeContext(meta)),
    http: (message: string, meta?: LogContext) => winstonLogger.http(message, mergeContext(meta)),
    debug: (message: string, meta?: LogContext) => winstonLogger.debug(message, mergeContext(meta)),
    child: (context: LogContext) => wrapLogger(winstonLogger.child(context)),
  };
}
