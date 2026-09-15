/** Date helpers. Dates are handled as plain ISO 'yyyy-MM-dd' strings throughout
 * the app's domain types to keep serialization with the API unambiguous and
 * timezone-free for "which day was this mowed" style data. */

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function todayIso(): string {
  return toIsoDate(new Date());
}

export function parseIsoDate(iso: string): Date {
  const [year, month, day] = iso.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1);
}

/** Whole-day difference between two ISO dates: to - from. */
export function daysBetween(fromIso: string, toIso: string): number {
  const from = parseIsoDate(fromIso);
  const to = parseIsoDate(toIso);
  const msPerDay = 24 * 60 * 60 * 1000;
  // Normalise to midnight to avoid DST off-by-ones.
  const fromMidnight = new Date(from.getFullYear(), from.getMonth(), from.getDate()).getTime();
  const toMidnight = new Date(to.getFullYear(), to.getMonth(), to.getDate()).getTime();
  return Math.round((toMidnight - fromMidnight) / msPerDay);
}

export function addDays(iso: string, days: number): string {
  const date = parseIsoDate(iso);
  date.setDate(date.getDate() + days);
  return toIsoDate(date);
}

export function formatDisplayDate(iso: string): string {
  const date = parseIsoDate(iso);
  return date.toLocaleDateString('en-NZ', { day: '2-digit', month: 'short', year: 'numeric' });
}
