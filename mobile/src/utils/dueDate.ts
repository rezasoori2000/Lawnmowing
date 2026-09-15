import type { DueStatus, Frequency, LawnArea, LawnAreaDueInfo } from '../types';
import { addDays, daysBetween } from './date';

/**
 * Core due/overdue calculation, driven entirely by client-side date maths:
 * dueDate = lastMowedDate + frequency.minDays
 * hardDueDate = lastMowedDate + frequency.maxDays (used to decide "overdue" vs "due")
 *
 * A lawn area with no mow history yet is treated as immediately due, since
 * there is nothing to measure "since last mow" against.
 */
export function computeDueStatus(
  frequency: Frequency,
  lastMowedDate: string | null | undefined,
  today: string,
): { status: DueStatus; daysUntilDue: number | null; dueDate: string | null } {
  if (!lastMowedDate) {
    return { status: 'due', daysUntilDue: 0, dueDate: today };
  }

  const dueDate = addDays(lastMowedDate, frequency.minDays);
  const hardDueDate = addDays(lastMowedDate, frequency.maxDays);
  const daysUntilDue = daysBetween(today, dueDate);
  const daysUntilHardDue = daysBetween(today, hardDueDate);

  let status: DueStatus;
  if (daysUntilHardDue < 0) {
    status = 'overdue';
  } else if (daysUntilDue <= 0) {
    status = 'due';
  } else if (daysUntilDue <= 2) {
    status = 'due-soon';
  } else {
    status = 'ok';
  }

  return { status, daysUntilDue, dueDate };
}

export function getLawnAreaDueInfo(lawnArea: LawnArea, today: string): LawnAreaDueInfo {
  const { status, daysUntilDue, dueDate } = computeDueStatus(
    lawnArea.frequency,
    lawnArea.lastMowedDate,
    today,
  );
  return { lawnArea, status, daysUntilDue, dueDate };
}

export function isDueToday(info: LawnAreaDueInfo): boolean {
  return info.status === 'due' && info.dueDate !== null;
}

export function isDueThisWeek(info: LawnAreaDueInfo): boolean {
  return (
    (info.status === 'due' || info.status === 'due-soon' || info.status === 'ok') &&
    info.daysUntilDue !== null &&
    info.daysUntilDue >= 0 &&
    info.daysUntilDue <= 7
  );
}

export function isOverdue(info: LawnAreaDueInfo): boolean {
  return info.status === 'overdue';
}

export function sortByUrgency(infos: LawnAreaDueInfo[]): LawnAreaDueInfo[] {
  return [...infos].sort((a, b) => {
    const aDays = a.daysUntilDue ?? Number.NEGATIVE_INFINITY;
    const bDays = b.daysUntilDue ?? Number.NEGATIVE_INFINITY;
    return aDays - bDays;
  });
}
