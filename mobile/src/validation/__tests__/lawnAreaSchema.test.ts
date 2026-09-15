import { lawnAreaSchema } from '../lawnAreaSchema';

describe('lawnAreaSchema', () => {
  it('accepts a valid preset-frequency lawn area', () => {
    const result = lawnAreaSchema.safeParse({
      name: 'Deer shed',
      frequencyPreset: '7-10',
      defaultMowHeight: '30-35',
      notes: 'Near the yards',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a name that is too short', () => {
    const result = lawnAreaSchema.safeParse({
      name: 'A',
      frequencyPreset: '7-10',
      defaultMowHeight: '30-35',
    });
    expect(result.success).toBe(false);
  });

  it('requires customFrequencyDays when frequencyPreset is custom', () => {
    const result = lawnAreaSchema.safeParse({
      name: 'Tractor compound',
      frequencyPreset: 'custom',
      defaultMowHeight: '25-30',
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0].path).toContain('customFrequencyDays');
    }
  });

  it('accepts custom frequency when customFrequencyDays is provided', () => {
    const result = lawnAreaSchema.safeParse({
      name: 'Tractor compound',
      frequencyPreset: 'custom',
      customFrequencyDays: 18,
      defaultMowHeight: '25-30',
    });
    expect(result.success).toBe(true);
  });

  it('rejects an invalid mow height', () => {
    const result = lawnAreaSchema.safeParse({
      name: 'Old arena',
      frequencyPreset: '14-21',
      defaultMowHeight: '999-mm',
    });
    expect(result.success).toBe(false);
  });
});
