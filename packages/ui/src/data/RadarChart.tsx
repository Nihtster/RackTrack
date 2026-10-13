import {
  Legend,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadarChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import { cn } from '../utils/cn';
import { chartAnimates, radarGrid, radarLabel, seriesColor, type ChartSeries } from './chartTheme';
import type { ChartRow as Row } from './ActivePoint';
import { ChartTooltip } from './ChartTooltip';

export interface RadarChartProps {
  /** One row per axis, e.g. `{ stat: 'HP', alpha: 45, bravo: 39 }`. */
  data: Row[];
  /** Property holding each axis' name. */
  axisKey: string;
  /** One polygon per series. */
  series: ChartSeries[];
  /** Accessible name for the chart, e.g. "Accuracy by firearm". */
  'aria-label': string;
  /** Chart height in px. Width fills the container. Default 320. */
  height?: number;
  /** Top of the scale. Defaults to the largest value in the data. */
  max?: number;
  /** Tint inside each polygon, 0 for outlines only. Default 0.15. */
  fillOpacity?: number;
  /** Show the value scale along the first axis. */
  showScale?: boolean;
  /** Default: shown when there is more than one series. */
  showLegend?: boolean;
  valueFormatter?: (value: number) => string;
  className?: string;
}

// Compare several things across the same set of measures.
export function RadarChart({
  data,
  axisKey,
  series,
  height = 320,
  max,
  fillOpacity = 0.15,
  showScale = false,
  showLegend = series.length > 1,
  valueFormatter,
  className,
  'aria-label': ariaLabel,
}: RadarChartProps) {
  return (
    <figure aria-label={ariaLabel} className={cn('w-full', className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart data={data} outerRadius="80%">
          <PolarGrid gridType="polygon" {...radarGrid} />
          <PolarAngleAxis dataKey={axisKey} tick={radarLabel} />
          <PolarRadiusAxis
            angle={90}
            domain={[0, max ?? 'auto']}
            tick={showScale ? { fill: radarGrid.stroke, fontSize: 10 } : false}
            axisLine={false}
            tickCount={5}
          />
          <Tooltip isAnimationActive={false} content={<ChartTooltip valueFormatter={valueFormatter} />} />
          {showLegend && <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />}
          {series.map((s, i) => {
            const color = seriesColor(s, i);
            return (
              <Radar
                key={s.key}
                dataKey={s.key}
                name={s.label}
                stroke={color}
                strokeWidth={2}
                fill={color}
                fillOpacity={fillOpacity}
                isAnimationActive={chartAnimates}
              />
            );
          })}
        </RechartsRadarChart>
      </ResponsiveContainer>
    </figure>
  );
}
