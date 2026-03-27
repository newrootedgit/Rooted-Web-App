import { describe, it, expect } from 'vitest';
import { validatePresetValues } from '../machine-presets/validatePresets.js';

const RANGES = {
  blade_speed: { min: 500, max: 3000 },
  belt_speed: { min: 10, max: 200 },
  blade_height: { min: 1, max: 100 },
};

describe('validatePresetValues', () => {
  it('should pass when all values are within range', () => {
    expect(() =>
      validatePresetValues(
        { '1': { blade_speed: 1500, belt_speed: 50 } },
        RANGES
      )
    ).not.toThrow();
  });

  it('should pass when values are exactly at min', () => {
    expect(() =>
      validatePresetValues(
        { '1': { blade_speed: 500, belt_speed: 10 } },
        RANGES
      )
    ).not.toThrow();
  });

  it('should pass when values are exactly at max', () => {
    expect(() =>
      validatePresetValues(
        { '1': { blade_speed: 3000, belt_speed: 200 } },
        RANGES
      )
    ).not.toThrow();
  });

  it('should pass with empty presets object', () => {
    expect(() => validatePresetValues({}, RANGES)).not.toThrow();
  });

  it('should reject value below min', () => {
    expect(() =>
      validatePresetValues(
        { '1': { blade_speed: 100 } },
        RANGES
      )
    ).toThrow('out of range [500, 3000]');
  });

  it('should reject value above max', () => {
    expect(() =>
      validatePresetValues(
        { '1': { belt_speed: 999 } },
        RANGES
      )
    ).toThrow('out of range [10, 200]');
  });

  it('should reject unknown variable keys', () => {
    expect(() =>
      validatePresetValues(
        { '1': { unknown_var: 50 } },
        RANGES
      )
    ).toThrow('unknown variable "unknown_var"');
  });

  it('should collect multiple violations into one error', () => {
    try {
      validatePresetValues(
        {
          '1': { blade_speed: 0, unknown_var: 50 },
          '2': { belt_speed: 999 },
        },
        RANGES
      );
      expect.fail('Should have thrown');
    } catch (err: any) {
      expect(err.message).toContain('blade_speed');
      expect(err.message).toContain('unknown_var');
      expect(err.message).toContain('belt_speed');
    }
  });

  it('should validate across multiple presets', () => {
    expect(() =>
      validatePresetValues(
        {
          '1': { blade_speed: 1500 },
          '2': { blade_speed: 2000, belt_speed: 100 },
        },
        RANGES
      )
    ).not.toThrow();
  });
});
