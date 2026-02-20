/**
 * Mock Pi Simulator — simulates a physical Pi device responding to MQTT commands.
 * Used when MOCK_IOT=true to make the full request/poll flow work locally.
 */

import { handleConfigResponse } from '../../domains/machine-domain/mqtt/machine-presets/handleConfigResponse.js';
import { getMockPresetData } from './mock-preset-data.js';

interface CommandPayload {
    action: string;
    requestId: string;
    presets?: Record<string, Record<string, number>>;
    variety_names?: Record<string, string>;
    [key: string]: unknown;
}

type ActionHandler = (
    thingName: string,
    payload: CommandPayload
) => Promise<void>;

// Per-device in-memory preset state
const deviceState = new Map<string, {
    presets: Record<string, Record<string, number>>;
    variety_names: Record<string, string>;
}>();

function getDeviceState(thingName: string) {
    if (!deviceState.has(thingName)) {
        deviceState.set(thingName, getMockPresetData(thingName));
    }
    return deviceState.get(thingName)!;
}

const actionHandlers: Record<string, ActionHandler> = {
    async get_presets(thingName, payload) {
        const state = getDeviceState(thingName);
        console.log(`[MOCK Pi] ${thingName}: returning presets (${Object.keys(state.presets).length} varieties)`);

        await handleConfigResponse({
            requestId: payload.requestId,
            action: 'presets_response',
            config: {
                presets: state.presets,
                variety_names: state.variety_names,
            },
        });
    },

    async update_presets(thingName, payload) {
        const state = getDeviceState(thingName);

        if (payload.presets) {
            for (const [key, val] of Object.entries(payload.presets)) {
                state.presets[key] = { ...state.presets[key], ...val };
            }
        }
        if (payload.variety_names) {
            Object.assign(state.variety_names, payload.variety_names);
        }

        console.log(`[MOCK Pi] ${thingName}: presets updated`);

        await handleConfigResponse({
            requestId: payload.requestId,
            action: 'presets_updated',
            success: true,
        });
    },
};

export const mockPiSimulator = {
    async handleCommand(thingName: string, payload: CommandPayload): Promise<void> {
        const handler = actionHandlers[payload.action];
        if (!handler) {
            console.warn(`[MOCK Pi] Unknown action: ${payload.action}`);
            await handleConfigResponse({
                requestId: payload.requestId,
                action: payload.action as 'config_response',
                error: `Unknown action: ${payload.action}`,
            });
            return;
        }

        await handler(thingName, payload);
    },

    /** Reset all device state (useful for tests) */
    reset(): void {
        deviceState.clear();
    },

    /** Reset state for a specific device */
    resetDevice(thingName: string): void {
        deviceState.delete(thingName);
    },
};
