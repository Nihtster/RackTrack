import type { ReactNode } from 'react';

interface Entry {
  name?: string | number;
  value?: string | number | ReadonlyArray<string | number>;
  color?: string;
  dataKey?: string | number;
  /** Pie slices carry their color here. */
  payload?: { fill?: string };
}

export interface ChartTooltipProps {
  active?: boolean;
  label?: ReactNode;
  payload?: ReadonlyArray<Entry>;
  /** Format the heading (the x value). */
  labelFormatter?: (label: ReactNode) => ReactNode;
  /** Format each value. */
  valueFormatter?: (value: number) => string;
}

// Tooltip body for the charts, in the app's surface style.
export function ChartTooltip({
  active,
  label,
  payload,
  labelFormatter,
  valueFormatter,
}: ChartTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className="min-w-32 rounded-control border border-border bg-surface-raised px-3 py-2 text-xs shadow-lg">
      {label !== undefined && label !== '' && (
        <div className="mb-1 font-medium text-ink">
          {labelFormatter ? labelFormatter(label) : label}
        </div>
      )}
      <ul className="space-y-0.5">
        {payload.map((entry) => {
          const value = Number(entry.value);
          return (
            <li key={String(entry.dataKey)} className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-ink-muted">
                <span
                  className="size-2 rounded-full"
                  style={{ backgroundColor: entry.color ?? entry.payload?.fill }}
                  aria-hidden="true"
                />
                {entry.name}
              </span>
              <span className="tabular-nums text-ink">
                {valueFormatter ? valueFormatter(value) : value.toLocaleString()}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
