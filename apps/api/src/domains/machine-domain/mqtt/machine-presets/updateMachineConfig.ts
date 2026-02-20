import type { PrismaClient } from '../../../../generated/prisma/client.js';
import { TRPCError } from '@trpc/server';
import { publishToDevice } from '../../../../lib/aws/iot-client.js';
import { randomUUID } from 'crypto';
import { isProd } from '../../../../lib/env.js';
import type { VarietyPreset } from '../../types.js';

interface UpdatePayload {
  presets?: Record<string, VarietyPreset>;
  variety_names?: Record<string, string>;
}

export async function updateMachineConfig(
  prisma: PrismaClient,
  machineId: string,
  tenantId: string,
  payload: UpdatePayload
): Promise<{ requestId: string }> {

    const machine = await prisma.machines.findFirst({
        where: { id: machineId, tenant_id: tenantId },
    });

    if (!machine) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Machine not found' });
    }

    if (isProd() && machine.status !== 'online') {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Machine is not online' });
    }

    const requestId = randomUUID();
    await publishToDevice(machine.device_id, {
      action: 'update_presets',
      requestId,
      ...payload.presets && { presets: payload.presets },
      ...payload.variety_names && { variety_names: payload.variety_names },
    });

    return { requestId };
}