import type { FastifyRequest, FastifyReply } from 'fastify';

export async function addMachineRoute(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const result = request.addMachineMiddleware;

  if (!result) {
    return reply.status(400).send({
      error: 'Add machine failed or no data available',
    });
  }

  return reply.status(result.isNew ? 201 : 200).send(result.machine);
}
