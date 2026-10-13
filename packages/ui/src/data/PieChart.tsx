import { useCallback, useRef, type ReactNode } from 'react';
import { Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { cn } from '../utils/cn';
import { controlFocusRing } from '../theme/control';
import { chartAnimates, chartColors, chartPalette, type ChartColor } from './chartTheme';
import { ChartTooltip } from './ChartTooltip';

type Row = Record<string, string | number>;

export interface SliceClickInfo {
  /** Index of the row in `data`. */
  index: number;
}

export interface PieChartProps {
  data: Row[];
  /** Property holding each slice's name. */
  nameKey: string;
  /** Property holding each slice's number. */
  valueKey: string;
  /** Accessible name for the chart, e.g. "Rounds by caliber". */
  'aria-label': string;
  /** Slice colors in order; cycles the palette when omitted. */
  colors?: ChartColor[];
  /** Ring instead of a full disc. */
  donut?: boolean;
  /** Shown in the middle of a donut, e.g. the total. */
  centerLabel?: ReactNode;
  /** Chart diameter in px. Default 220. */
  size?: number;
  /** Show the list beside the chart. Default true. */
  showLegend?: boolean;
  valueFormatter?: (value: number) => string;
  /** Makes slices clickable. The legend rows are real buttons, so this works
   *  from the keyboard too. */
  onSliceClick?: (datum: Row, info: SliceClickInfo) => void;
  className?: string;
}

export function PieChart({
  data,
  nameKey,
  valueKey,
  colors,
  donut,
  centerLabel,
  size = 220,
  showLegend = true,
  valueFormatter,
  onSliceClick,
  className,
  'aria-label': ariaLabel,
}: PieChartProps) {
  // Hovering a slice or legend row dims the other slices. This writes straight
  // to the SVG instead of using React state: a re-render hands Recharts new
  // slice props, which restarts the draw-in animation (visible as a stutter).
  const figureRef = useRef<HTMLElement>(null);
  const setActive = useCallback((index: number | null) => {
    figureRef.current?.querySelectorAll<SVGElement>('.recharts-pie-sector').forEach((el, i) => {
      el.style.opacity = index === null || index === i ? '' : '0.35';
    });
  }, []);

  const total = data.reduce((sum, row) => sum + Number(row[valueKey]), 0);
  const fill = (i: number) =>
    chartColors[(colors ?? chartPalette)[i % (colors ?? chartPalette).length]];
  const format = valueFormatter ?? ((v: number) => v.toLocaleString());

  return (
    <figure
      ref={figureRef}
      aria-label={ariaLabel}
      // text-ink: the center label and legend must not depend on the page's
      // inherited color, which is black outside a Card.
      className={cn(
        'flex flex-col items-center gap-4 text-ink sm:flex-row sm:gap-6',
        '[&_.recharts-pie-sector]:transition-opacity',
        className,
      )}
    >
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsPieChart>
            <Tooltip isAnimationActive={false} content={<ChartTooltip valueFormatter={valueFormatter} />} />
            <Pie
              data={data}
              dataKey={valueKey}
              nameKey={nameKey}
              // Both radii are percentage strings; mixing in a plain 0 breaks the geometry.
              innerRadius={donut ? '62%' : '0%'}
              outerRadius="100%"
              paddingAngle={donut ? 2 : 0}
              stroke="none"
              isAnimationActive={chartAnimates}
              onMouseEnter={(_, index) => setActive(index)}
              onMouseLeave={() => setActive(null)}
              onClick={onSliceClick ? (_, index) => onSliceClick(data[index], { index }) : undefined}
              className={onSliceClick ? 'cursor-pointer' : undefined}
            >
              {data.map((row, i) => (
                <Cell key={String(row[nameKey])} fill={fill(i)} />
              ))}
            </Pie>
          </RechartsPieChart>
        </ResponsiveContainer>
        {donut && centerLabel && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-center">
            {centerLabel}
          </div>
        )}
      </div>

      {showLegend && (
        <ul className="w-full min-w-40 space-y-1">
          {data.map((row, i) => {
            const value = Number(row[valueKey]);
            const percent = total > 0 ? Math.round((value / total) * 100) : 0;
            const content = (
              <>
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: fill(i) }}
                  aria-hidden="true"
                />
                <span className="min-w-0 flex-1 truncate text-left text-ink">{String(row[nameKey])}</span>
                <span className="tabular-nums text-ink-muted">{format(value)}</span>
                <span className="w-9 text-right tabular-nums text-ink-muted">{percent}%</span>
              </>
            );
            const rowClass = 'flex w-full items-center gap-2 rounded-control px-2 py-1.5 text-sm';
            return (
              <li key={String(row[nameKey])}>
                {onSliceClick ? (
                  <button
                    type="button"
                    onClick={() => onSliceClick(row, { index: i })}
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    className={cn(rowClass, 'transition-colors hover:bg-surface-raised', controlFocusRing)}
                  >
                    {content}
                  </button>
                ) : (
                  <div
                    onMouseEnter={() => setActive(i)}
                    onMouseLeave={() => setActive(null)}
                    className={rowClass}
                  >
                    {content}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </figure>
  );
}
