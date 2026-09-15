import { mowRecordSchema } from '../mowRecordSchema';

describe('mowRecordSchema', () => {
  const valid = {
    lawnAreaId: 'lawn-area-1',
    date: '2026-09-14',
    mowHeight: '30-35' as const,
    direction: 'N' as const,
    personId: 'person-hamish',
    equipmentId: 'equip-jd-300r',
    notes: 'Dry conditions',
  };

  it('accepts a fully valid mow record', () => {
    expect(mowRecordSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects a missing lawn area', () => {
    const result = mowRecordSchema.safeParse({ ...valid, lawnAreaId: '' });
    expect(result.success).toBe(false);
  });

  it('rejects a malformed date', () => {
    const result = mowRecordSchema.safeParse({ ...valid, date: '14/09/2026' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid mow height', () => {
    const result = mowRecordSchema.safeParse({ ...valid, mowHeight: '999mm' });
    expect(result.success).toBe(false);
  });

  it('rejects an invalid direction', () => {
    const result = mowRecordSchema.safeParse({ ...valid, direction: 'NNE' });
    expect(result.success).toBe(false);
  });

  it('allows notes to be omitted', () => {
    const { notes, ...withoutNotes } = valid;
    expect(mowRecordSchema.safeParse(withoutNotes).success).toBe(true);
  });
});
