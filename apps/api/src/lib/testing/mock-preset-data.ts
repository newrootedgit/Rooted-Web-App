/**
 * Default mock preset data for local IoT development.
 * Generates realistic preset configurations for 20 varieties.
 */

type PresetValues = Record<string, number>;

function randomInt(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateVarietyPreset(): PresetValues {
    return {
        blade_speed: randomInt(500, 3000),
        belt_speed: randomInt(10, 100),
        blade_height: randomInt(1, 50),
        airknife_mode: randomInt(0, 3),
    } satisfies PresetValues;
}

const varietyNames = [
    'Romaine', 'Butterhead', 'Iceberg', 'Red Leaf', 'Green Leaf',
    'Arugula', 'Spinach', 'Kale', 'Swiss Chard', 'Endive',
    'Radicchio', 'Watercress', 'Bok Choy', 'Collard Greens', 'Mustard Greens',
    'Frisée', 'Escarole', 'Mâche', 'Mizuna', 'Tatsoi',
];

export function getMockPresetData(thingName: string): {
    presets: Record<string, Record<string, number>>;
    variety_names: Record<string, string>;
} {
    const presets: Record<string, Record<string, number>> = {};
    const variety_names: Record<string, string> = {};

    for (let i = 1; i <= 20; i++) {
        presets[String(i)] = generateVarietyPreset();
        variety_names[String(i)] = varietyNames[i - 1];
    }

    return { presets, variety_names };
}

export const mockPresetScenarios = {
    empty: {
        presets: {} as Record<string, Record<string, number>>,
        variety_names: {} as Record<string, string>,
    },
    singleVariety: {
        presets: {
            '1': { blade_speed: 1500, belt_speed: 50, blade_height: 25, airknife_mode: 1 },
        },
        variety_names: { '1': 'Romaine' },
    },
};
