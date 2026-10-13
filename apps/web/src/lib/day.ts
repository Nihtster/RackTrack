// Calendar-day helpers. Dates in the data are plain `YYYY-MM-DD` strings with
// no time zone; these read and write them as local days so "today" means the
// user's today.

export function toDay(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function parseDay(day: string): Date {
  const [y, m, d] = day.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** `day` moved by `days` (negative goes back). */
export function addDays(day: string, days: number): string {
  const date = parseDay(day);
  date.setDate(date.getDate() + days);
  return toDay(date);
}

/** Whole days from `from` to `to`; positive when `to` is later. */
export function diffDays(from: string, to: string): number {
  const ms = parseDay(to).getTime() - parseDay(from).getTime();
  return Math.round(ms / 86_400_000);
}

const shortFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

/** "Sep 14" */
export function formatShort(day: string): string {
  return shortFormat.format(parseDay(day));
}

const longFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/** "Sep 25, 2025" */
export function formatLong(day: string): string {
  return longFormat.format(parseDay(day));
}

/** "Today", "Yesterday", "3 days ago", or "Sep 14" once it is over two weeks. */
export function formatRelative(day: string, today: string): string {
  const ago = diffDays(day, today);
  if (ago <= 0) return ago === 0 ? 'Today' : formatShort(day);
  if (ago === 1) return 'Yesterday';
  if (ago <= 14) return `${ago} days ago`;
  return formatShort(day);
}
