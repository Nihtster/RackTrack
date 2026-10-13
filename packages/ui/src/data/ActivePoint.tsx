import { useEffect } from 'react';
import { useActiveTooltipDataPoints } from 'recharts';

export type ChartRow = Record<string, string | number>;

// Render inside a Recharts chart. Reports the data row the tooltip is on, so
// the surrounding figure can activate it from the keyboard (or on click).
export function ActivePoint({ onChange }: { onChange: (row: ChartRow | null) => void }) {
  const points = useActiveTooltipDataPoints<ChartRow>();
  const row = points?.[0] ?? null;
  useEffect(() => onChange(row), [row, onChange]);
  return null;
}
