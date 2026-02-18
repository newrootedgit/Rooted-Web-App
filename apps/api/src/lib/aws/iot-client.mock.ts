/**
 * Mock IoT publish function for local development (MOCK_IOT=true).
 * Simulates the AWS IoT Data Plane publish by routing commands to the mock Pi simulator.
 */

import { mockPiSimulator } from '../testing/mock-pi-simulator.js';

const MOCK_DELAY_MS = Number(process.env.MOCK_IOT_DELAY_MS) || 500;
const FAILURE_RATE = Number(process.env.MOCK_IOT_FAILURE_RATE) || 0;

export async function publishToDevice(
    thingName: string,
    payload: Record<string, unknown>
): Promise<void> {
    console.log(`[MOCK IoT] Publishing to ${thingName}:`, payload.action);

    if (FAILURE_RATE > 0 && Math.random() < FAILURE_RATE) {
        throw new Error(`[MOCK IoT] Simulated publish failure for ${thingName}`);
    }

    // Simulate network + device processing delay
    await new Promise((resolve) => setTimeout(resolve, MOCK_DELAY_MS));

    // Route to mock Pi simulator (simulates Pi receiving the command and responding)
    await mockPiSimulator.handleCommand(thingName, payload as Parameters<typeof mockPiSimulator.handleCommand>[1]);
}
