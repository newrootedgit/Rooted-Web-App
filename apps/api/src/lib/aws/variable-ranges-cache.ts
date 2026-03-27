/**
 * In-memory cache for machine variable ranges.
 *
 * Populated when config responses arrive from devices via MQTT.
 * Used by updateMachineConfig to validate preset values against
 * the machine's declared min/max ranges before forwarding to the device.
 *
 * Keyed by deviceId (not machineId) since that's what the MQTT topic provides.
 */

export interface VariableRange {
  min: number;
  max: number;
}

const rangesCache = new Map<string, Record<string, VariableRange>>();

export function storeVariableRanges(deviceId: string, ranges: Record<string, VariableRange>): void {
  rangesCache.set(deviceId, ranges);
}

export function getVariableRanges(deviceId: string): Record<string, VariableRange> | null {
  return rangesCache.get(deviceId) ?? null;
}

export function clearRangesCache(): void {
  rangesCache.clear();
}
