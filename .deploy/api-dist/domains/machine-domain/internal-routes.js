import { prisma } from '../../lib/db/index.js';
import { handleLifecycleEvent } from './commands/index.js';
export async function registerInternalRoutes(fastify) {
    fastify.post('/internal/machines/lifecycle-event', {
        preHandler: async (request, reply) => {
            const authHeader = request.headers.authorization;
            const expectedToken = `Bearer ${process.env.LAMBDA_SECRET_TOKEN}`;
            if (!authHeader || authHeader !== expectedToken) {
                reply.code(401).send({ error: 'Unauthorized' });
                return;
            }
        }
    }, async (request, reply) => {
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
        }
        catch (error) {
            if (error.message.includes('not found')) {
                reply.code(404).send({ error: error.message });
            }
            else {
                request.log.error(error);
                reply.code(500).send({ error: 'Internal server error' });
            }
        }
    });
}
//# sourceMappingURL=internal-routes.js.map