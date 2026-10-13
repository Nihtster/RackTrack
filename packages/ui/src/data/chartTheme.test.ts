import { describe, expect, it } from 'vitest';
import { chartColors, chartPalette, niceAxis, seriesColor, valueAxis } from './chartTheme';

describe('seriesColor', () => {
  it('uses the series color when set', () => {
    expect(seriesColor({ key: 'a', label: 'A', color: 'critical' }, 0)).toBe(chartColors.critical);
  });

  it('falls back to the palette in order', () => {
    chartPalette.forEach((name, i) => {
      expect(seriesColor({ key: 'x', label: 'X' }, i)).toBe(chartColors[name]);
    });
  });

  it('cycles when there are more series than colors', () => {
    const n = chartPalette.length;
    expect(seriesColor({ key: 'x', label: 'X' }, n)).toBe(seriesColor({ key: 'y', label: 'Y' }, 0));
  });
});

describe('niceAxis', () => {
  it('rounds the top up to a tidy step', () => {
    expect(niceAxis(247)).toEqual({ max: 300, ticks: [0, 100, 200, 300] });
    expect(niceAxis(2850)).toEqual({ max: 3000, ticks: [0, 1000, 2000, 3000] });
    expect(niceAxis(96)).toEqual({ max: 100, ticks: [0, 25, 50, 75, 100] });
  });

  it('keeps fractional steps off integer data', () => {
    expect(niceAxis(10).ticks).toEqual([0, 2.5, 5, 7.5, 10]);
    expect(niceAxis(10, { integers: true }).ticks).toEqual([0, 5, 10]);
    expect(niceAxis(3, { integers: true }).ticks).toEqual([0, 1, 2, 3]);
  });

  it('handles empty and zero data', () => {
    expect(niceAxis(0)).toEqual({ max: 1, ticks: [0, 1] });
    expect(niceAxis(Number.NaN)).toEqual({ max: 1, ticks: [0, 1] });
  });

  it('does not leak floating-point noise into ticks', () => {
    expect(niceAxis(0.6).ticks).toEqual([0, 0.2, 0.4, 0.6]);
  });
});

describe('valueAxis', () => {
  const rows = [
    { a: 100, b: 50 },
    { a: 247, b: 10 },
  ];

  it('uses the largest single value, or the largest stack', () => {
    expect(valueAxis(rows, ['a', 'b'])?.domain).toEqual([0, 300]);
    expect(valueAxis(rows, ['a', 'b'], true)?.domain).toEqual([0, 300]);
    expect(valueAxis([{ a: 100, b: 100 }], ['a', 'b'], true)?.domain).toEqual([0, 200]);
  });

  it('steps in whole numbers when every value is whole', () => {
    expect(valueAxis([{ a: 7 }], ['a'])?.ticks).toEqual([0, 2, 4, 6, 8]);
  });

  it('leaves the axis to the chart for negative or missing values', () => {
    expect(valueAxis([{ a: -5 }, { a: 10 }], ['a'])).toBeUndefined();
    expect(valueAxis([], ['a'])).toBeUndefined();
  });
});
