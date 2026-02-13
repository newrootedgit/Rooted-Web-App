import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../lib/db/index.js';
import { handleLifecycleEvent } from './commands/index.js';
import { handleConfigResponse } from './mqtt/handleConfigResponse.js';

interface LifecycleEventBody {
  deviceId: string;
  eventType: 'connected' | 'disconnected';
  timestamp: string;
  sessionId?: string;
  wifiSsid?: string;
}

interface ConfigResponseBody { 
  requestId: string; 
  action: 'config_response' | 'config_updated' | 'presets_response' | 'presets_updated';
  config?: Record<string, unknown>;
  success?: boolean;
  error?: string;
}

export async function registerInternalRoutes(fastify: FastifyInstance) {
  
  fastify.post<{ Body: LifecycleEventBody }>(
    '/internal/machines/lifecycle-event',
    {
      preHandler: async (request: FastifyRequest, reply: FastifyReply) => {
        const authHeader = request.headers.authorization;
        const expectedToken = `Bearer ${process.env.LAMBDA_SECRET_TOKEN}`;

        if (!authHeader || authHeader !== expectedToken) {
          reply.code(401).send({ error: 'Unauthorized' });
          return;
        }
      }
    },
    async (request, reply) => {
      try {
        const { deviceId, eventType, timestamp, sessionId, wifiSsid } = request.body;

        if (!deviceId || !eventType || !timestamp) {
          reply.code(400).send({ error: 'Missing required fields' });
          return;
        }

        if (!['connected', 'disconnected'].includes(eventType)) {
          reply.code(400).send({ error: 'Invalid eventType' });
          return;
        }

        await handleLifecycleEvent(prisma, {
          deviceId,
          eventType,
          timestamp,
          sessionId,
          wifiSsid,
        });

        reply.code(200).send({ success: true });
      } catch (error: any) {
        if (error.message.includes('not found')) {
          reply.code(404).send({ error: error.message });
        } else {
          request.log.error(error);
          reply.code(500).send({ error: 'Internal server error' });
        }
      }
    }
  );

  fastify.post<{ Body: ConfigResponseBody }>(
    '/internal/machines/config-response',
    { 
      preHandler: async (request: FastifyRequest, reply: FastifyReply) => { 
        const authHeader = request.headers.authorization;
        const expectedToken = `Bearer ${process.env.LAMBDA_SECRET_TOKEN}`;

        if (!authHeader || authHeader !== expectedToken) {
          reply.code(401).send({ error: 'Unauthorized' });
          return;
        }
      }
    }, 
    async (request, reply) => {
      try {
        const { requestId, action, config, success, error } = request.body;

        if (!requestId || !action) {
          reply.code(400).send({ error: 'Missing required fields' });
          return;
        }

        await handleConfigResponse({ requestId, action, config, success, error });

        reply.code(200).send({ success: true });
      } catch (error: any) {
        request.log.error(error);
        reply.code(500).send({ error: 'Internal server error' });
      }
    }
  );

}
