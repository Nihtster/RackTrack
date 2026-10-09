import { CalendarGrid } from './CalendarGrid';

export interface CalendarProps {
  /** Selected date as "YYYY-MM-DD", or empty. */
  value?: string | null;
  onChange: (date: string) => void;
  /** Earliest / latest selectable date ("YYYY-MM-DD"). */
  min?: string;
  max?: string;
  /** 0 = Sunday (default), 1 = Monday. */
  weekStartsOn?: 0 | 1;
  /** Show a caption stating the allowed range when `min` or `max` is set. Default true. */
  showRange?: boolean;
  /** Move focus into the grid on mount (used when it opens in a popover). */
  autoFocus?: boolean;
  className?: string;
}

// One selectable date. For a start/end pair use RangeCalendar.
export function Calendar({ value, onChange, ...rest }: CalendarProps) {
  return (
    <CalendarGrid
      {...rest}
      seed={value || undefined}
      getDayState={(iso) => ({ selected: iso === value })}
      onSelectDay={onChange}
    />
  );
}
