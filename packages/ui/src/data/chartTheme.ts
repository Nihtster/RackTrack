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
