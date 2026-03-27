import { TRPCError } from '@trpc/server';
import type { VariableRange } from '../../../../lib/aws/variable-ranges-cache.js';

/**
 * Validates preset values against the machine's declared variable ranges.
 * Throws a TRPCError with all violations collected into a single message.
 */
export function validatePresetValues(
  presets: Record<string, Record<string, number>>,
  ranges: Record<string, VariableRange>
): void {
  const errors: string[] = [];

  for (const [presetKey, variables] of Object.entries(presets)) {
    for (const [varName, value] of Object.entries(variables)) {
      const range = ranges[varName];

      if (!range) {
        errors.push(`Preset ${presetKey}: unknown variable "${varName}"`);
        continue;
      }

      if (value < range.min || value > range.max) {
        errors.push(
          `Preset ${presetKey}: "${varName}" value ${value} is out of range [${range.min}, ${range.max}]`
        );
      }
    }
  }

  if (errors.length > 0) {
    throw new TRPCError({
      code: 'BAD_REQUEST',
      message: `Preset validation failed:\n${errors.join('\n')}`,
    });
  }
}
