import type { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { publishToDevice } from '../../../lib/aws/iot-client.js';
import { randomUUID } from 'crypto';

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

    if (!machine.aws_iot_thing_name) {
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Machine is not onboarded to AWS IoT' });
    } 

    if (machine.status !== 'online') { 
        throw new TRPCError({ code: 'BAD_REQUEST', message: 'Machine is not online' });
    }

    const requestId = randomUUID();
    await publishToDevice(machine.aws_iot_thing_name, { action: 'get_config', requestId });
    
    return { requestId };
}