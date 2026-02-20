import winston from 'winston';

const isDev = process.env.NODE_ENV !== 'production';

export const logger = winston.createLogger({
  level: isDev ? 'debug' : 'info',
  defaultMeta: { service: process.env.SERVICE_NAME || 'rooted-api' },
  format: isDev
    ? winston.format.combine(
        winston.format.colorize({ all: true }),
        winston.format.timestamp({ format: () => new Date().toISOString() }),
        winston.format.printf(({ level, message, timestamp, ...meta }) => {
          const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
          return `${timestamp} ${level}: ${message}${metaStr}`;
        })
      )
    : winston.format.combine(
        winston.format.timestamp({ format: () => new Date().toISOString() }),
        winston.format.errors({ stack: true }),
        winston.format.json()
      ),
  transports: [new winston.transports.Console()],
});
