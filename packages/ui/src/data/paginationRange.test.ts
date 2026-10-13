import { describe, expect, it } from 'vitest';
import { paginationRange } from './paginationRange';

// Render a range as "1 … 4 5 6 … 20" for readable assertions.
const show = (page: number, count: number, siblings = 1, boundaries = 1) =>
  paginationRange(page, count, siblings, boundaries)
    .map((item) => (item === 'dots' ? '…' : item))
    .join(' ');

describe('paginationRange', () => {
  it('shows every page when they all fit', () => {
    expect(show(3, 5)).toBe('1 2 3 4 5');
    expect(show(4, 7)).toBe('1 2 3 4 5 6 7');
  });

  it('returns nothing for zero pages', () => {
    expect(show(1, 0)).toBe('');
  });

  it('collapses the far end when near the start', () => {
    expect(show(1, 20)).toBe('1 2 3 4 5 … 20');
    expect(show(3, 20)).toBe('1 2 3 4 5 … 20');
    expect(show(4, 20)).toBe('1 2 3 4 5 … 20');
  });

  it('collapses both ends in the middle', () => {
    expect(show(5, 20)).toBe('1 … 4 5 6 … 20');
    expect(show(10, 20)).toBe('1 … 9 10 11 … 20');
    expect(show(16, 20)).toBe('1 … 15 16 17 … 20');
  });

  it('collapses the near end when near the finish', () => {
    expect(show(17, 20)).toBe('1 … 16 17 18 19 20');
    expect(show(20, 20)).toBe('1 … 16 17 18 19 20');
  });

  it('widens the window with more siblings', () => {
    expect(show(10, 20, 2)).toBe('1 … 8 9 10 11 12 … 20');
  });

  it('keeps the same number of slots on every page of a long list', () => {
    const lengths = new Set(
      Array.from({ length: 20 }, (_, i) => paginationRange(i + 1, 20).length),
    );
    expect([...lengths]).toEqual([7]);
  });

  it('always includes the current page', () => {
    for (let page = 1; page <= 30; page++) {
      expect(paginationRange(page, 30)).toContain(page);
    }
  });
});
