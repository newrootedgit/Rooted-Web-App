import { describe, it, expect, beforeEach } from 'vitest';
import { storeVariableRanges, getVariableRanges, clearRangesCache } from '../variable-ranges-cache.js';

describe('variable-ranges-cache', () => {
  beforeEach(() => {
    clearRangesCache();
  });

  it('should return null for unknown deviceId', () => {
    expect(getVariableRanges('unknown-device')).toBeNull();
  });

  it('should store and retrieve ranges by deviceId', () => {
    const ranges = {
      blade_speed: { min: 500, max: 3000 },
      belt_speed: { min: 10, max: 200 },
    };

    storeVariableRanges('dev-1', ranges);
    expect(getVariableRanges('dev-1')).toEqual(ranges);
  });

  it('should overwrite ranges on re-store', () => {
    storeVariableRanges('dev-1', { speed: { min: 0, max: 100 } });
    storeVariableRanges('dev-1', { speed: { min: 0, max: 500 } });

    expect(getVariableRanges('dev-1')).toEqual({ speed: { min: 0, max: 500 } });
  });

  it('should store ranges for multiple devices independently', () => {
    storeVariableRanges('dev-1', { speed: { min: 0, max: 100 } });
    storeVariableRanges('dev-2', { speed: { min: 0, max: 200 } });

    expect(getVariableRanges('dev-1')!.speed.max).toBe(100);
    expect(getVariableRanges('dev-2')!.speed.max).toBe(200);
  });

  it('should clear all cached ranges', () => {
    storeVariableRanges('dev-1', { speed: { min: 0, max: 100 } });
    storeVariableRanges('dev-2', { speed: { min: 0, max: 200 } });

    clearRangesCache();

    expect(getVariableRanges('dev-1')).toBeNull();
    expect(getVariableRanges('dev-2')).toBeNull();
  });
});
