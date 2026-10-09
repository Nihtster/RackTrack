import { useState, type Ref } from 'react';
import { controlSize } from '../theme/control';
import { DateFieldShell } from './DateFieldShell';
import { RangeCalendar, type DateRange } from './RangeCalendar';
import { parseISO } from './date';

export interface DateRangePickerProps {
  /** Controlled range. `end` is "" until the second date is chosen. */
  value?: DateRange;
  defaultValue?: DateRange;
  /** Fires on every click: once with only `start`, again when `end` is set. */
  onValueChange?: (range: DateRange) => void;
  min?: string;
  max?: string;
  placeholder?: string;
  size?: keyof typeof controlSize;
  invalid?: boolean;
  disabled?: boolean;
  /** Names for the two hidden inputs submitted with a surrounding <form>. */
  startName?: string;
  endName?: string;
  id?: string;
  'aria-describedby'?: string;
  'aria-label'?: string;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
}

const EMPTY: DateRange = { start: '', end: '' };
const format = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

function describe({ start, end }: DateRange) {
  const s = parseISO(start);
  if (!s) return null;
  const e = parseISO(end);
  return e ? `${format.format(s)} – ${format.format(e)}` : `${format.format(s)} – …`;
}

// Start and end date in one field. The popover closes once both are chosen.
export function DateRangePicker({
  value,
  defaultValue = EMPTY,
  onValueChange,
  min,
  max,
  placeholder = 'Select date range',
  startName,
  endName,
  ...rest
}: DateRangePickerProps) {
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;

  const hiddenInputs = [
    ...(startName ? [{ name: startName, value: current.start }] : []),
    ...(endName ? [{ name: endName, value: current.end }] : []),
  ];

  return (
    <DateFieldShell
      {...rest}
      display={describe(current)}
      placeholder={placeholder}
      popoverLabel="Choose date range"
      hiddenInputs={hiddenInputs.length ? hiddenInputs : undefined}
    >
      {(close) => (
        <RangeCalendar
          value={current}
          min={min}
          max={max}
          autoFocus
          onChange={(next) => {
            if (value === undefined) setInner(next);
            onValueChange?.(next);
            if (next.end) close();
          }}
        />
      )}
    </DateFieldShell>
  );
}
