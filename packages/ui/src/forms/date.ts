// Date helpers for Calendar and DatePicker. Values are ISO date strings
// ("2026-10-09"), the same format as <input type="date">, so they are easy to
// store and sort. Dates are handled in local time to avoid timezone shifts.

const pad = (n: number) => String(n).padStart(2, '0');

export function toISO(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function parseISO(iso?: string | null): Date | null {
  const m = iso ? /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso) : null;
  if (!m) return null;
  const [y, mo, d] = [Number(m[1]), Number(m[2]), Number(m[3])];
  const date = new Date(y, mo - 1, d);
  const valid = date.getFullYear() === y && date.getMonth() === mo - 1 && date.getDate() === d;
  return valid ? date : null;
}

export const addDays = (d: Date, n: number) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

// Keeps the day of month where possible (Jan 31 + 1 month = Feb 28/29).
export function addMonths(d: Date, n: number) {
  const first = new Date(d.getFullYear(), d.getMonth() + n, 1);
  const last = daysInMonth(first);
  return new Date(first.getFullYear(), first.getMonth(), Math.min(d.getDate(), last));
}

export const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);

export const daysInMonth = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();

// ISO strings compare correctly as plain strings.
export function clampISO(iso: string, min?: string, max?: string) {
  if (min && iso < min) return min;
  if (max && iso > max) return max;
  return iso;
}
