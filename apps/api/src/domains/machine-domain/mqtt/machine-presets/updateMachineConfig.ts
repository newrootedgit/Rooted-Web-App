import type { PrismaClient } from '../../../../generated/prisma/client.js';
import { TRPCError } from '@trpc/server';
import { publishToDevice } from '../../../../lib/aws/iot-client.js';
import { randomUUID } from 'crypto';
import { isProd } from '../../../../lib/env.js';
import type { VarietyPreset } from '../../types.js';
import { getVariableRanges } from '../../../../lib/aws/variable-ranges-cache.js';
import { storeResponse } from '../../../../lib/aws/config-store.js';
import { storeVariableRanges } from '../../../../lib/aws/variable-ranges-cache.js';
import { validatePresetValues } from './validatePresets.js';
import { mergeDemoMachineConfig, normalizeDemoMachineConfig } from './demoConfig.js';

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

    if (machine.is_demo) {
        const currentConfig = normalizeDemoMachineConfig(machine.demo_config);

        if (payload.presets && Object.keys(payload.presets).length > 0) {
            validatePresetValues(payload.presets, currentConfig.variable_ranges ?? {});
        }

        const nextConfig = mergeDemoMachineConfig(currentConfig, payload);

        await prisma.machines.update({
            where: { id: machine.id },
            data: { demo_config: nextConfig },
        });

        storeResponse(requestId, {
            action: 'presets_updated',
            success: true,
        });
        storeVariableRanges(machine.device_id, nextConfig.variable_ranges ?? {});

        return { requestId };
    }

    // Validate preset values against cached variable ranges
    if (payload.presets && Object.keys(payload.presets).length > 0) {
        const ranges = getVariableRanges(machine.device_id);
        if (!ranges) {
            throw new TRPCError({
                code: 'PRECONDITION_FAILED',
                message: 'Variable ranges not loaded. Fetch machine config first.',
            });
        }
        validatePresetValues(payload.presets, ranges);
    }

    await publishToDevice(machine.device_id, {
      action: 'update_presets',
      requestId,
      ...payload.presets && { presets: payload.presets },
      ...payload.variety_names && { variety_names: payload.variety_names },
    });

    return { requestId };
}
