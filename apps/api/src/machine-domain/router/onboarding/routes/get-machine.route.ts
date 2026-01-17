import type { FastifyRequest, FastifyReply } from 'fastify';

export async function getMachineRoute(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const result = request.getMachineMiddleware;

  if (!result) {
    return reply.status(404).send({
      error: 'Machine not found',
    });
  }

  return reply.status(200).send(result);
}
