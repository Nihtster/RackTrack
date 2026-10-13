import { useRef, type KeyboardEvent } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart as RechartsLineChart,
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

export interface PointClickInfo {
  /** Index of the row in `data`. */
  index: number;
}

export interface LineChartProps {
  data: Row[];
  /** Property used for the x axis. */
  xKey: string;
  series: ChartSeries[];
  /** Accessible name for the chart, e.g. "Rounds per month". */
  'aria-label': string;
  /** Chart height in px. Width fills the container. Default 240. */
  height?: number;
  /** Draw a dot on every data point. */
  showDots?: boolean;
  /** Default: shown when there is more than one series. */
  showLegend?: boolean;
  xTickFormatter?: (value: string | number) => string;
  valueFormatter?: (value: number) => string;
  /** Makes the chart clickable: it fires for the point nearest the pointer
   *  (the one the tooltip is on). Also for the keyboard: arrow keys move
   *  between points, Enter or Space activates. The row holds every series, so
   *  there is no per-series callback. */
  onPointClick?: (datum: Row, info: PointClickInfo) => void;
  className?: string;
}

export function LineChart({
  data,
  xKey,
  series,
  height = 240,
  showDots = false,
  showLegend = series.length > 1,
  xTickFormatter,
  valueFormatter,
  onPointClick,
  className,
  'aria-label': ariaLabel,
}: LineChartProps) {
  const activeRow = useRef<Row | null>(null);
  // Round tick values instead of Recharts' evenly spaced ones (0, 65, 130...).
  const axis = valueAxis(data, series.map((s) => s.key), false);

  // Keyboard: the row the tooltip is on. (Mouse reads the index off the click
  // event itself, which is never stale.)
  function onKeyDown(e: KeyboardEvent<HTMLElement>) {
    const row = activeRow.current;
    if (!onPointClick || !row || (e.key !== 'Enter' && e.key !== ' ')) return;
    e.preventDefault();
    onPointClick(row, { index: data.indexOf(row) });
  }

  return (
    <figure
      aria-label={ariaLabel}
      onKeyDown={onPointClick ? onKeyDown : undefined}
      className={cn('w-full', onPointClick && 'cursor-pointer', className)}
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <RechartsLineChart
          data={data}
          margin={{ top: 8, right: 8, bottom: 0, left: 0 }}
          onClick={
            onPointClick
              ? (state) => {
                  const index = Number(state?.activeIndex);
                  if (Number.isInteger(index) && data[index]) onPointClick(data[index], { index });
                }
              : undefined
          }
        >
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
            cursor={{ stroke: gridStroke }}
            // No slide-in: it would otherwise fly in from the far left on first hover.
            isAnimationActive={false}
            content={<ChartTooltip valueFormatter={valueFormatter} />}
          />
          {onPointClick && <ActivePoint onChange={(row) => { activeRow.current = row; }} />}
          {showLegend && <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />}
          {series.map((s, i) => {
            const color = seriesColor(s, i);
            return (
              <Line
                key={s.key}
                type="monotone"
                dataKey={s.key}
                name={s.label}
                stroke={color}
                strokeWidth={2}
                isAnimationActive={chartAnimates}
                dot={showDots ? { r: 3, fill: color, strokeWidth: 0 } : false}
                activeDot={{ r: 4, fill: color, strokeWidth: 0 }}
              />
            );
          })}
        </RechartsLineChart>
      </ResponsiveContainer>
    </figure>
  );
}
