import { describe, expect, it } from 'vitest';
import { chartColors, chartPalette, seriesColor } from './chartTheme';

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
