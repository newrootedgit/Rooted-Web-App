import type { PrismaClient } from '../../../../generated/prisma/client.js';
import { TRPCError } from '@trpc/server';
import { publishToDevice } from '../../../../lib/aws/iot-client.js';
import { randomUUID } from 'crypto';
import { isProd } from '../../../../lib/env.js';
import { storeResponse } from '../../../../lib/aws/config-store.js';
import { storeVariableRanges } from '../../../../lib/aws/variable-ranges-cache.js';
import { normalizeDemoMachineConfig } from './demoConfig.js';

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

    if (machine.is_demo) {
        const config = normalizeDemoMachineConfig(machine.demo_config);
        await prisma.machines.update({
            where: { id: machine.id },
            data: { demo_config: config },
        });
        storeResponse(requestId, {
            action: 'presets_response',
            config,
        });
        storeVariableRanges(machine.device_id, config.variable_ranges ?? {});
        return { requestId };
    }

    await publishToDevice(machine.device_id, { action: 'get_presets', requestId });
    
    return { requestId };
}
