import type { FastifyRequest, FastifyReply } from 'fastify';
import { prisma } from '../../../../lib/db/index.js';
import { addMachineSchema } from '../../../types.js';

export async function addMachineMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const { tenantId, farmId } = request.auth!;

  const parsed = addMachineSchema.safeParse(request.body);
  if (!parsed.success) {
    throw parsed.error;
  }

  const { name, deviceId } = parsed.data;

  const existing = await prisma.machines.findFirst({
    where: { device_id: deviceId },
  });

  let machine;
  if (existing) {
    machine = await prisma.machines.update({
      where: { id: existing.id },
      data: {
        name,
        tenant_id: tenantId,
        farm_id: farmId,
      },
    });
  } else {
    machine = await prisma.machines.create({
      data: {
        tenant_id: tenantId,
        farm_id: farmId,
        name,
        device_id: deviceId,
      },
    });
  }

  request.addMachineMiddleware = {
    machine: {
      id: machine.id,
      tenantId: machine.tenant_id,
      farmId: machine.farm_id,
      name: machine.name,
      deviceId: machine.device_id,
      createdAt: machine.created_at,
    },
    isNew: !existing,
  };
}
