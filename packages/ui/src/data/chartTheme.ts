import { colors } from '../theme/colors';

// Shared look for BarChart and LineChart. Recharts draws SVG, so it needs raw
// color values (not Tailwind classes); they come from theme/colors.ts.

export type ChartColor = 'accent' | 'accentBright' | 'success' | 'warning' | 'critical';

export const chartColors: Record<ChartColor, string> = {
  accent: colors.accent,
  accentBright: colors.accentBright,
  success: colors.success,
  warning: colors.warning,
  critical: colors.critical,
};

// Used in order for series that don't set a color.
export const chartPalette: ChartColor[] = ['accent', 'success', 'warning', 'critical', 'accentBright'];

export interface ChartSeries {
  /** Property of each data row to plot. */
  key: string;
  /** Name shown in the tooltip and legend. */
  label: string;
  color?: ChartColor;
}

export const axisTick = { fill: colors.inkMuted, fontSize: 12 };
export const gridStroke = colors.border;

export function seriesColor(series: ChartSeries, index: number) {
  return chartColors[series.color ?? chartPalette[index % chartPalette.length]];
}

// Draw-in animation is skipped when the OS asks for reduced motion. Read once
// at load, which is enough for a setting that rarely changes mid-session.
export const chartAnimates =
  typeof window === 'undefined' || !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Radar axis labels read as headings, so they use the primary ink color.
export const radarLabel = { fill: colors.ink, fontSize: 12, fontWeight: 600 };

// Radar rings need to read against the card, so they are brighter than the
// cartesian grid.
export const radarGrid = { stroke: colors.inkMuted, strokeOpacity: 0.45 };

// Round numbers for a value axis. Recharts spaces ticks evenly between 0 and the
// data's maximum, which gives axes like 0, 65, 130, 195, 260. This picks a step
// from 1, 2, 2.5, 5 times a power of ten so the axis reads 0, 100, 200, 300.
// With `integers`, steps are whole numbers (no 2.5 on a count).
export function niceAxis(
  max: number,
  { maxTicks = 5, integers = false }: { maxTicks?: number; integers?: boolean } = {},
): { max: number; ticks: number[] } {
  if (!Number.isFinite(max) || max <= 0) return { max: 1, ticks: [0, 1] };

  const rough = max / (maxTicks - 1);
  const magnitude = 10 ** Math.floor(Math.log10(rough));
  const multipliers = integers ? [1, 2, 5, 10] : [1, 2, 2.5, 5, 10];
  const candidates = multipliers.map((m) => m * magnitude).filter((s) => !integers || s >= 1);
  const step = candidates.find((s) => s >= rough) ?? Math.max(10 * magnitude, integers ? 1 : 0);

  const top = Math.ceil(max / step) * step;
  const ticks: number[] = [];
  // Rounded to the step's own precision so 0.1 + 0.2 never shows up as a tick.
  const places = Math.max(0, -Math.floor(Math.log10(step)) + 1);
  for (let v = 0; v <= top + step / 2; v += step) ticks.push(Number(v.toFixed(places)));
  return { max: ticks.at(-1) ?? top, ticks };
}

/** Axis props for a chart whose values are `rows`' numbers under `keys` (summed per row when stacked). */
export function valueAxis(
  rows: Record<string, unknown>[],
  keys: string[],
  stacked = false,
): { domain: [number, number]; ticks: number[] } | undefined {
  const values = rows.flatMap((row) => {
    const nums = keys.map((k) => row[k]).filter((v): v is number => typeof v === 'number');
    return stacked ? [nums.reduce((a, b) => a + b, 0)] : nums;
  });
  // Negative values or no data: leave the axis to Recharts.
  if (values.length === 0 || values.some((v) => v < 0)) return undefined;

  const { max, ticks } = niceAxis(Math.max(...values), { integers: values.every(Number.isInteger) });
  return { domain: [0, max], ticks };
}
