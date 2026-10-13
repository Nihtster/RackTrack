import { cn } from '../utils/cn';
import { intentFill, intentText, type Intent } from '../theme/intent';

export type ProgressBarSize = 'sm' | 'md' | 'lg';

const trackHeight: Record<ProgressBarSize, string> = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export interface ProgressBarProps {
  value: number;
  /** Value that counts as 100%. Default 100. */
  max?: number;
  /** Fill color. Pick it from the value yourself (e.g. critical when stock is
   *  low) so the thresholds stay in your app, not in the component. */
  intent?: Intent;
  size?: ProgressBarSize;
  /** Text above the bar. Also used as its accessible name. */
  label?: string;
  /** Show the value to the right of the bar. */
  showValue?: boolean;
  /** Replace the default "62%" text, e.g. "1,240 rds". */
  valueLabel?: string;
  /** Accessible name when there is no visible `label`. */
  'aria-label'?: string;
  className?: string;
}

// Determinate meter for ammo stock and rounds-until-maintenance.
export function ProgressBar({
  value,
  max = 100,
  intent = 'accent',
  size = 'md',
  label,
  showValue,
  valueLabel,
  className,
  'aria-label': ariaLabel,
}: ProgressBarProps) {
  const safeMax = max > 0 ? max : 100;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const percent = (clamped / safeMax) * 100;
  const valueText = valueLabel ?? `${Math.round(percent)}%`;

  return (
    <div className={cn('w-full', className)}>
      {label && <div className="mb-1.5 text-sm text-ink-muted">{label}</div>}
      <div className="flex items-center gap-3">
        <div
          role="progressbar"
          aria-label={label ?? ariaLabel}
          aria-valuemin={0}
          aria-valuemax={safeMax}
          aria-valuenow={clamped}
          aria-valuetext={valueText}
          className={cn('w-full overflow-hidden rounded-full bg-surface-raised', trackHeight[size])}
        >
          <div
            className={cn(
              'h-full rounded-full motion-safe:transition-[width] motion-safe:duration-300',
              intentFill[intent],
            )}
            style={{ width: `${percent}%` }}
          />
        </div>
        {showValue && (
          <span className={cn('shrink-0 text-xs tabular-nums', intentText[intent === 'accent' ? 'neutral' : intent])}>
            {valueText}
          </span>
        )}
      </div>
    </div>
  );
}
