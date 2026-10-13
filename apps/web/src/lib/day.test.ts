import { describe, expect, it } from 'vitest';
import { addDays, diffDays, formatRelative, formatShort, parseDay, toDay } from './day';

describe('day helpers', () => {
  it('round-trips a day through Date as a local calendar day', () => {
    expect(toDay(parseDay('2026-03-09'))).toBe('2026-03-09');
  });

  it('adds days across month and year boundaries', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01');
    expect(addDays('2026-01-01', -1)).toBe('2025-12-31');
  });

  it('counts whole days across a daylight-saving change', () => {
    // US clocks go forward on 2026-03-08: that day has 23 hours.
    expect(diffDays('2026-03-07', '2026-03-09')).toBe(2);
    expect(diffDays('2026-03-09', '2026-03-07')).toBe(-2);
  });

  it('formats short and relative days', () => {
    expect(formatShort('2026-09-05')).toBe('Sep 5');
    expect(formatRelative('2026-10-13', '2026-10-13')).toBe('Today');
    expect(formatRelative('2026-10-12', '2026-10-13')).toBe('Yesterday');
    expect(formatRelative('2026-10-10', '2026-10-13')).toBe('3 days ago');
    expect(formatRelative('2026-09-01', '2026-10-13')).toBe('Sep 1');
  });
});
