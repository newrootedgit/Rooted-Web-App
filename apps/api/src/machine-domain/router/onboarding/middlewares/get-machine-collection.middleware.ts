import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../../../lib/db/index.js';

export async function getMachineCollectionMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { tenantId, farmId } = request.auth!;

  const machines = await prisma.machines.findMany({
    where: {
      tenant_id: tenantId,
      farm_id: farmId,
    },
  });

  request.getMachineCollectionMiddleware = machines.map((machine) => ({
    id: machine.id,
    tenantId: machine.tenant_id,
    farmId: machine.farm_id,
    name: machine.name,
    deviceId: machine.device_id,
    createdAt: machine.created_at,
  }));
}
