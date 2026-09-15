import type { Frequency, FrequencyPreset } from '../types';

export interface FrequencyOption {
  preset: FrequencyPreset;
  label: string;
  minDays: number;
  maxDays: number;
}

export const FREQUENCY_OPTIONS: FrequencyOption[] = [
  { preset: '7-10', label: '7-10 days', minDays: 7, maxDays: 10 },
  { preset: '10-14', label: '10-14 days', minDays: 10, maxDays: 14 },
  { preset: '14-21', label: '14-21 days', minDays: 14, maxDays: 21 },
  { preset: '21-25', label: '21-25 days', minDays: 21, maxDays: 25 },
  { preset: 'custom', label: 'Custom (days)', minDays: 0, maxDays: 0 },
];

export function buildFrequency(preset: FrequencyPreset, customDays?: number): Frequency {
  const option = FREQUENCY_OPTIONS.find(o => o.preset === preset) ?? FREQUENCY_OPTIONS[0];
  if (preset === 'custom') {
    const days = customDays && customDays > 0 ? customDays : 14;
    return { preset, minDays: days, maxDays: days, customDays: days };
  }
  return { preset, minDays: option.minDays, maxDays: option.maxDays };
}

export function frequencyLabel(frequency: Frequency): string {
  if (frequency.preset === 'custom') {
    return `Every ${frequency.customDays ?? frequency.maxDays} days`;
  }
  const option = FREQUENCY_OPTIONS.find(o => o.preset === frequency.preset);
  return option?.label ?? `${frequency.minDays}-${frequency.maxDays} days`;
}
