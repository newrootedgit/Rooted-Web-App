import type { FastifyRequest, FastifyReply } from 'fastify';

export async function getMachineCollectionRoute(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const result = request.getMachineCollectionMiddleware;

  if (!result) {
    return reply.status(400).send({
      error: 'Get machine collection failed',
    });
  }

  return reply.status(200).send(result);
}
