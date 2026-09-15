import { buildFrequency } from '../../constants/frequencies';
import { computeDueStatus, getLawnAreaDueInfo, isOverdue, sortByUrgency } from '../dueDate';
import type { LawnArea } from '../../types';

describe('computeDueStatus', () => {
  const today = '2026-09-14';

  it('treats a lawn area with no mow history as due now', () => {
    const frequency = buildFrequency('7-10');
    const result = computeDueStatus(frequency, undefined, today);
    expect(result.status).toBe('due');
    expect(result.dueDate).toBe(today);
  });

  it('is "ok" well before the due window opens', () => {
    const frequency = buildFrequency('10-14');
    // Mowed yesterday, due window starts in 10 days.
    const result = computeDueStatus(frequency, '2026-09-13', today);
    expect(result.status).toBe('ok');
    expect(result.daysUntilDue).toBeGreaterThan(2);
  });

  it('is "due-soon" within 2 days of the minDays threshold', () => {
    const frequency = buildFrequency('7-10');
    // minDays = 7, mowed 6 days ago -> due in 1 day.
    const result = computeDueStatus(frequency, '2026-09-08', today);
    expect(result.status).toBe('due-soon');
    expect(result.daysUntilDue).toBe(1);
  });

  it('is "due" once past the minDays threshold but within maxDays', () => {
    const frequency = buildFrequency('7-10');
    // minDays = 7, mowed 8 days ago -> 1 day past minDays, still within maxDays (10).
    const result = computeDueStatus(frequency, '2026-09-06', today);
    expect(result.status).toBe('due');
  });

  it('is "overdue" once past the maxDays threshold', () => {
    const frequency = buildFrequency('7-10');
    // maxDays = 10, mowed 11 days ago.
    const result = computeDueStatus(frequency, '2026-09-03', today);
    expect(result.status).toBe('overdue');
    expect(result.daysUntilDue).toBeLessThan(0);
  });

  it('respects a custom frequency in days', () => {
    const frequency = buildFrequency('custom', 5);
    const result = computeDueStatus(frequency, '2026-09-08', today);
    // Mowed 6 days ago against a 5-day custom frequency -> overdue.
    expect(result.status).toBe('overdue');
  });
});

describe('getLawnAreaDueInfo / sortByUrgency', () => {
  const today = '2026-09-14';

  function makeLawnArea(id: string, lastMowedDate?: string): LawnArea {
    return {
      id,
      name: id,
      frequency: buildFrequency('7-10'),
      defaultMowHeight: '30-35',
      lastMowedDate,
    };
  }

  it('flags overdue lawn areas correctly via isOverdue', () => {
    const overdueArea = makeLawnArea('a', '2026-08-01');
    const okArea = makeLawnArea('b', '2026-09-13');
    expect(isOverdue(getLawnAreaDueInfo(overdueArea, today))).toBe(true);
    expect(isOverdue(getLawnAreaDueInfo(okArea, today))).toBe(false);
  });

  it('sorts most-urgent (most overdue) first', () => {
    const veryOverdue = makeLawnArea('very-overdue', '2026-07-01');
    const slightlyOverdue = makeLawnArea('slightly-overdue', '2026-09-01');
    const ok = makeLawnArea('ok', '2026-09-13');

    const sorted = sortByUrgency([
      getLawnAreaDueInfo(ok, today),
      getLawnAreaDueInfo(veryOverdue, today),
      getLawnAreaDueInfo(slightlyOverdue, today),
    ]);

    expect(sorted.map(i => i.lawnArea.id)).toEqual(['very-overdue', 'slightly-overdue', 'ok']);
  });
});
