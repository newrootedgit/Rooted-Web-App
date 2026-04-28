import type { MachineConfig, VarietyPreset } from '../../types.js';

export const DEFAULT_DEMO_MACHINE_CONFIG = {
  ready_to_run: true,
  active_variety: 1,
  variable_ranges: {
    belt_speed: { min: 10, max: 100 },
    blade_height: { min: 1, max: 50 },
    tray_spacing: { min: 1, max: 20 },
  },
  variety_names: {
    '1': 'Sunflower',
    '2': 'Radish',
    '3': 'Pea Shoots',
  },
  '1': {
    belt_speed: 45,
    blade_height: 12,
    tray_spacing: 6,
  },
  '2': {
    belt_speed: 38,
    blade_height: 10,
    tray_spacing: 5,
  },
  '3': {
    belt_speed: 52,
    blade_height: 14,
    tray_spacing: 7,
  },
} as unknown as MachineConfig;

export function normalizeDemoMachineConfig(config: unknown): MachineConfig {
  if (config && typeof config === 'object') {
    return config as MachineConfig;
  }

  return DEFAULT_DEMO_MACHINE_CONFIG;
}

export function mergeDemoMachineConfig(
  currentConfig: MachineConfig,
  payload: {
    presets?: Record<string, VarietyPreset>;
    variety_names?: Record<string, string>;
  }
): MachineConfig {
  const nextConfig = {
    ...currentConfig,
    variable_ranges: currentConfig.variable_ranges,
    variety_names: {
      ...(currentConfig.variety_names ?? {}),
      ...(payload.variety_names ?? {}),
    },
  } as Record<string, unknown>;

  if (payload.presets) {
    for (const [presetNumber, values] of Object.entries(payload.presets)) {
      nextConfig[presetNumber] = {
        ...((nextConfig[presetNumber] as VarietyPreset | undefined) ?? {}),
        ...values,
      };
    }
  }

  return nextConfig as unknown as MachineConfig;
}
