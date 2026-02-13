import { storeResponse } from '../../../lib/aws/config-store.js';

interface ConfigResponseInput { 
    requestId: string;
    action: 'config_response' | 'config_updated' | 'presets_response' | 'presets_updated';
    config?: Record<string, unknown>; 
    success?: boolean; 
    error?: string; 
}

export async function handleConfigResponse(input: ConfigResponseInput): Promise<void> {
    storeResponse(input.requestId, { 
        action: input.action,
        config: input.config,
        success: input.success,
        error: input.error,
     });
}