import type { PrismaClient } from '../../../generated/prisma/client.js';
import { TRPCError } from '@trpc/server';
import { publishToDevice } from '../../../lib/aws/iot-client.js';
import { randomUUID } from 'crypto';
import type { VarietyPreset } from '../types.js';


export async function updateMachineConfig(
  prisma: PrismaClient,
  machineId: string,
  tenantId: string,
  presets: Record<string, VarietyPreset>
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
    await publishToDevice(machine.aws_iot_thing_name, { action: 'update_config', requestId, config: presets });   

    return { requestId };
}