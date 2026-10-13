import { useRef, type KeyboardEvent } from 'react';
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { cn } from '../utils/cn';
import {
  axisTick,
  chartAnimates,
  gridStroke,
  seriesColor,
  valueAxis,
  type ChartSeries,
} from './chartTheme';
import { ActivePoint, type ChartRow as Row } from './ActivePoint';
import { ChartTooltip } from './ChartTooltip';

export interface BarClickInfo {
  /** Which series' bar was activated (the first series for keyboard use). */
  seriesKey: string;
  /** Index of the row in `data`. */
  index: number;
}

export interface BarChartProps {
  data: Row[];
  /** Property used for the x axis. */
  xKey: string;
  series: ChartSeries[];
  /** Accessible name for the chart, e.g. "Rounds fired, last 30 days". */
  'aria-label': string;
  /** Chart height in px. Width fills the container. Default 240. */
  height?: number;
  /** Stack the series instead of grouping them. */
  stacked?: boolean;
  /** Default: shown when there is more than one series. */
  showLegend?: boolean;
  xTickFormatter?: (value: string | number) => string;
  valueFormatter?: (value: number) => string;
  /** Makes bars clickable: navigate, open a modal, filter a table. Also fires
   *  for the keyboard: arrow keys move through bars, Enter or Space activates.
   *  Offer the same action elsewhere too if the chart is the only way to it. */
  onBarClick?: (datum: Row, info: BarClickInfo) => void;
  className?: string;
}

export function BarChart({
  data,
  xKey,
  series,
  height = 240,
  stacked,
  showLegend = series.length > 1,
  xTickFormatter,
  valueFormatter,
  onBarClick,
  className,
  'aria-label': ariaLabel,
}: BarChartProps) {
  const activeRow = useRef<Row | null>(null);
  // Round tick values instead of Recharts' evenly spaced ones (0, 65, 130...).
  const axis = valueAxis(data, series.map((s) => s.key), stacked);

  function onKeyDown(e: KeyboardEvent<HTMLElement>) {
    const row = activeRow.current;
    if (!onBarClick || !row || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    onBarClick(row, { seriesKey: series[0].key, index: data.indexOf(row) });
  }

  return (
    <figure
      aria-label={ariaLabel}
      onKeyDown={onBarClick ? onKeyDown : undefined}
      className={cn(
        'w-full',
        onBarClick && '[&_.recharts-bar-rectangle]:cursor-pointer',
        className,
      )}
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid vertical={false} stroke={gridStroke} strokeDasharray="3 3" />
          <XAxis
            dataKey={xKey}
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            tickFormatter={xTickFormatter}
            minTickGap={16}
          />
          <YAxis
            {...axis}
            tick={axisTick}
            tickLine={false}
            axisLine={false}
            width={40}
            tickFormatter={valueFormatter ? (v: number) => valueFormatter(v) : undefined}
          />
          <Tooltip
            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
            // No slide-in: it would otherwise fly in from the far left on first hover.
            isAnimationActive={false}
            content={<ChartTooltip valueFormatter={valueFormatter} />}
          />
          {onBarClick && <ActivePoint onChange={(row) => { activeRow.current = row; }} />}
          {showLegend && <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />}
          {series.map((s, i) => (
            <Bar
              isAnimationActive={chartAnimates}
              key={s.key}
              dataKey={s.key}
              name={s.label}
              fill={seriesColor(s, i)}
              stackId={stacked ? 'stack' : undefined}
              radius={stacked ? 0 : [3, 3, 0, 0]}
              maxBarSize={28}
              onClick={
                onBarClick
                  ? (item, index) => onBarClick(item.payload as Row, { seriesKey: s.key, index })
                  : undefined
              }
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </figure>
  );
}
