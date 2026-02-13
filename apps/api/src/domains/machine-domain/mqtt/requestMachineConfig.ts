import type { PrismaClient } from '../../../generated/prisma/client.js';
import { TRPCError } from '@trpc/server';
import { publishToDevice } from '../../../lib/aws/iot-client.js';
import { randomUUID } from 'crypto';
import { isProd } from '../../../lib/env.js';

export async function requestMachineConfig(
  prisma: PrismaClient,
  machineId: string,
  tenantId: string
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
    await publishToDevice(machine.device_id, { action: 'get_presets', requestId });
    
    return { requestId };
}