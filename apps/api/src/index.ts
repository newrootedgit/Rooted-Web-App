import 'dotenv/config';

import Fastify from 'fastify';
import cors from '@fastify/cors';
import { clerkPlugin } from '@clerk/fastify';

import { createLogger } from './lib/logger/index.js';
import { errorHandler, NotFoundError } from './lib/errors/index.js';
import { farmAuthMiddleware } from './lib/auth/index.js';
import { machineRouter } from './machine-domain/router/router.js';

import type { LogLevel, Environment } from './lib/logger/index.js';

const PORT = parseInt(process.env.PORT || '8000', 10);
const HOST = process.env.HOST || '0.0.0.0';

const logger = createLogger({
  service: 'rooted-api',
  level: (process.env.LOG_LEVEL as LogLevel) || 'info',
  environment: (process.env.NODE_ENV as Environment) || 'development',
});

async function main() {
  const app = Fastify({
    logger: false,
    requestIdHeader: 'x-request-id',
    genReqId: () => crypto.randomUUID(),
  });

  await app.register(cors, { origin: true });
  await app.register(errorHandler, { logger });
  await app.register(clerkPlugin);
  await app.register(farmAuthMiddleware, { logger });

  app.addHook('onRequest', (request, _reply, done) => {
    const reqLogger = logger.child({
      requestId: request.id,
      method: request.method,
      url: request.url,
    });
    logger.http('Request received', {
      requestId: request.id,
      method: request.method,
      url: request.url,
    });
    (request as unknown as { log: typeof reqLogger }).log = reqLogger;
    done();
  });

  app.addHook('onResponse', (request, reply, done) => {
    logger.http('Response sent', {
      requestId: request.id,
      statusCode: reply.statusCode,
      responseTime: reply.elapsedTime,
    });
    done();
  });

  app.setNotFoundHandler((request) => {
    throw new NotFoundError(`Route ${request.method} ${request.url} not found`);
  });

  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  await app.register(machineRouter);

  // TODO: Add tRPC router
  // app.register(fastifyTRPCPlugin, {
  //   prefix: '/trpc',
  //   trpcOptions: { router: appRouter, createContext },
  // });

  try {
    await app.listen({ port: PORT, host: HOST });
    logger.info('Server started', { host: HOST, port: PORT });
  } catch (err) {
    logger.error('Failed to start server', { error: err });
    process.exit(1);
  }
}

main();
