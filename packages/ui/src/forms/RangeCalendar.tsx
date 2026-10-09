import { CalendarGrid, type DayState } from './CalendarGrid';

export interface DateRange {
  /** "YYYY-MM-DD", or "" for none. */
  start: string;
  /** "YYYY-MM-DD", or "" while the range is still being picked. */
  end: string;
}

export interface RangeCalendarProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  min?: string;
  max?: string;
  weekStartsOn?: 0 | 1;
  showRange?: boolean;
  autoFocus?: boolean;
  className?: string;
}

// Two clicks pick a range: first the start, then the end (earlier clicks swap).
// Between the clicks, hovering or arrowing previews the range.
export function RangeCalendar({ value, onChange, ...rest }: RangeCalendarProps) {
  const { start, end } = value;

  function select(iso: string) {
    if (!start || end) onChange({ start: iso, end: '' });
    else if (iso < start) onChange({ start: iso, end: start });
    else onChange({ start, end: iso });
  }

  function getDayState(iso: string, preview: string | null): DayState {
    const pendingEnd = start && !end ? preview : null;
    const lo = start && pendingEnd && pendingEnd < start ? pendingEnd : start;
    const hi = end || (pendingEnd && pendingEnd > start ? pendingEnd : start);
    const inRange = !!lo && !!hi && iso >= lo && iso <= hi;
    const multiDay = !!lo && lo !== hi;
    return {
      selected: iso === start || (!!end && iso === end),
      inRange: inRange && multiDay,
      rangeStart: multiDay && iso === lo,
      rangeEnd: multiDay && iso === hi,
    };
  }

  return (
    <CalendarGrid
      {...rest}
      seed={start || end || undefined}
      getDayState={getDayState}
      onSelectDay={select}
    />
  );
}
