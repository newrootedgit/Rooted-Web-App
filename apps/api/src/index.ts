import 'dotenv/config';

import Fastify from 'fastify';
import cors from '@fastify/cors';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';

import { logger } from './lib/logger/index.js';
import { errorHandler, NotFoundError } from './lib/errors/index.js';
import { farmAuthMiddleware } from './lib/auth/middleware.js';
import { createContext } from './lib/trpc/context.js';
import { isProd } from './lib/env.js';
import { appRouter } from './lib/trpc/router.js';
import { startMqttSubscriber, stopMqttSubscriber } from './domains/machine-domain/mqtt/index.js';

const PORT = parseInt(process.env.PORT || '8000', 10);
const HOST = process.env.HOST || '0.0.0.0';

async function main() {
  const app = Fastify({
    logger: false,
    requestIdHeader: 'x-request-id',
    genReqId: () => crypto.randomUUID(),
  });

  await app.register(cors, {
    origin: isProd() 
      ? (process.env.CORS_ORIGIN?.split(',') || ['https://app.rootedrobotics.com'])
      : true,
    credentials: true,
  });
  await app.register(errorHandler, { logger });
  await app.register(farmAuthMiddleware, { logger });

  app.addHook('onRequest', (request, _reply, done) => {
    const reqLogger = logger.child({ component: 'http', requestId: request.id, method: request.method, url: request.url });
    (request as unknown as { log: typeof reqLogger }).log = reqLogger;
    reqLogger.info('Request received', { event: 'http.request' });
    done();
  });

  app.addHook('onResponse', (request, reply, done) => {
    const reqLogger =
      (request as unknown as { log?: typeof logger }).log || logger.child({ component: 'http' });
    reqLogger.info('Response sent', {
      event: 'http.response',
      statusCode: reply.statusCode,
      durationMs: reply.elapsedTime,
    });
    done();
  });

  app.setNotFoundHandler((request) => {
    throw new NotFoundError(`Route ${request.method} ${request.url} not found`);
  });

  app.get('/health', async () => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  });

  await app.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
      router: appRouter,
      createContext,
    },
  });

  app.addHook('onClose', async () => {
    await stopMqttSubscriber();
  });

  try {
    await app.listen({ port: PORT, host: HOST });
    logger.info('Server started', { host: HOST, port: PORT });

    if (process.env.MOCK_IOT !== 'true') {
      startMqttSubscriber().catch((err) => {
        logger.error('Failed to start MQTT subscriber', { err });
      });
    }
  } catch (err) {
    logger.error('Failed to start server', { err });
    process.exit(1);
  }
}

main();
