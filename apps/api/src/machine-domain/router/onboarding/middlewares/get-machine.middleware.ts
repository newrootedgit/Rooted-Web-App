import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../../../lib/db/index.js';
import { getMachineParamsSchema } from '../../../types.js';

export async function getMachineMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { tenantId, farmId } = request.auth!;

  const parsed = getMachineParamsSchema.safeParse(request.params);
  if (!parsed.success) {
    throw parsed.error;
  }

  const machine = await prisma.machines.findFirst({
    where: {
      id: parsed.data.id,
      tenant_id: tenantId,
      farm_id: farmId,
    },
  });

  request.getMachineMiddleware = machine
    ? {
        id: machine.id,
        tenantId: machine.tenant_id,
        farmId: machine.farm_id,
        name: machine.name,
        deviceId: machine.device_id,
        createdAt: machine.created_at,
      }
    : null;
}
