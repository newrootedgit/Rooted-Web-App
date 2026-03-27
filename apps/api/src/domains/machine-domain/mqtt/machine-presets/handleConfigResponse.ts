import { storeResponse } from '../../../../lib/aws/config-store.js';
import { storeVariableRanges, type VariableRange } from '../../../../lib/aws/variable-ranges-cache.js';

interface ConfigResponseInput {
    requestId: string;
    action: 'config_response' | 'config_updated' | 'presets_response' | 'presets_updated';
    config?: Record<string, unknown>;
    success?: boolean;
    error?: string;
    deviceId?: string;
}

export async function handleConfigResponse(input: ConfigResponseInput): Promise<void> {
    storeResponse(input.requestId, {
        action: input.action,
        config: input.config,
        success: input.success,
        error: input.error,
     });

    // Cache variable_ranges for preset validation on future updates
    if (input.deviceId && input.config?.variable_ranges) {
        const ranges = input.config.variable_ranges as Record<string, VariableRange>;
        storeVariableRanges(input.deviceId, ranges);
    }
}
