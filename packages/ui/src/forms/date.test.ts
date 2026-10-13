import { describe, expect, it } from 'vitest';
import {
  addDays,
  addMonths,
  clampISO,
  daysInMonth,
  parseISO,
  startOfMonth,
  toISO,
} from './date';

describe('parseISO / toISO', () => {
  it('round-trips a valid date', () => {
    const date = parseISO('2026-09-26');
    expect(date).not.toBeNull();
    expect(toISO(date!)).toBe('2026-09-26');
  });

  it('is local time, so the day never shifts with the timezone', () => {
    const date = parseISO('2026-01-01')!;
    expect([date.getFullYear(), date.getMonth(), date.getDate()]).toEqual([2026, 0, 1]);
  });

  it('rejects malformed and impossible dates', () => {
    for (const bad of ['', '2026-9-26', '26-09-2026', 'tomorrow', '2026-02-30', '2026-13-01', '2025-02-29']) {
      expect(parseISO(bad)).toBeNull();
    }
    expect(parseISO(null)).toBeNull();
    expect(parseISO(undefined)).toBeNull();
  });

  it('accepts a leap day only in a leap year', () => {
    expect(parseISO('2028-02-29')).not.toBeNull();
    expect(parseISO('2027-02-29')).toBeNull();
  });
});

describe('addDays', () => {
  it('crosses month and year boundaries', () => {
    expect(toISO(addDays(parseISO('2026-09-30')!, 1))).toBe('2026-10-01');
    expect(toISO(addDays(parseISO('2026-12-31')!, 1))).toBe('2027-01-01');
    expect(toISO(addDays(parseISO('2026-03-01')!, -1))).toBe('2026-02-28');
  });
});

describe('addMonths', () => {
  it('keeps the day of month', () => {
    expect(toISO(addMonths(parseISO('2026-09-15')!, 1))).toBe('2026-10-15');
    expect(toISO(addMonths(parseISO('2026-01-15')!, -1))).toBe('2025-12-15');
  });

  it('clamps to the end of a shorter month', () => {
    expect(toISO(addMonths(parseISO('2026-01-31')!, 1))).toBe('2026-02-28');
    expect(toISO(addMonths(parseISO('2028-01-31')!, 1))).toBe('2028-02-29');
    expect(toISO(addMonths(parseISO('2026-03-31')!, -1))).toBe('2026-02-28');
  });

  it('moves a year with 12 months', () => {
    expect(toISO(addMonths(parseISO('2026-09-26')!, 12))).toBe('2027-09-26');
  });
});

describe('month helpers', () => {
  it('startOfMonth returns the 1st', () => {
    expect(toISO(startOfMonth(parseISO('2026-09-26')!))).toBe('2026-09-01');
  });

  it('daysInMonth knows month lengths and leap years', () => {
    expect(daysInMonth(parseISO('2026-09-01')!)).toBe(30);
    expect(daysInMonth(parseISO('2026-10-01')!)).toBe(31);
    expect(daysInMonth(parseISO('2026-02-01')!)).toBe(28);
    expect(daysInMonth(parseISO('2028-02-01')!)).toBe(29);
  });
});

describe('clampISO', () => {
  it('pulls a date inside the range', () => {
    expect(clampISO('2026-09-01', '2026-09-10', '2026-10-05')).toBe('2026-09-10');
    expect(clampISO('2026-11-01', '2026-09-10', '2026-10-05')).toBe('2026-10-05');
  });

  it('leaves an in-range date, and open-ended ranges, alone', () => {
    expect(clampISO('2026-09-20', '2026-09-10', '2026-10-05')).toBe('2026-09-20');
    expect(clampISO('2026-09-01', undefined, '2026-10-05')).toBe('2026-09-01');
    expect(clampISO('2030-01-01', '2026-09-10', undefined)).toBe('2030-01-01');
  });
});
