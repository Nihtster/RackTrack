import { useState, type Ref } from 'react';
import { controlSize } from '../theme/control';
import { Calendar } from './Calendar';
import { DateFieldShell } from './DateFieldShell';
import { parseISO } from './date';

export interface DatePickerProps {
  /** Controlled value ("YYYY-MM-DD", or "" for none). */
  value?: string;
  defaultValue?: string;
  onValueChange?: (date: string) => void;
  min?: string;
  max?: string;
  placeholder?: string;
  size?: keyof typeof controlSize;
  invalid?: boolean;
  disabled?: boolean;
  /** Submits the value with a surrounding <form>. */
  name?: string;
  id?: string;
  'aria-describedby'?: string;
  'aria-label'?: string;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
}

const format = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });

// Themed replacement for <input type="date">: the browser's own calendar popup
// can't be styled, so this opens our Calendar instead. For two dates, use
// DateRangePicker.
export function DatePicker({
  value,
  defaultValue = '',
  onValueChange,
  min,
  max,
  placeholder = 'Select date',
  name,
  ...rest
}: DatePickerProps) {
  const [inner, setInner] = useState(defaultValue);
  const current = value ?? inner;
  const date = parseISO(current);

  return (
    <DateFieldShell
      {...rest}
      display={date ? format.format(date) : null}
      placeholder={placeholder}
      popoverLabel="Choose date"
      hiddenInputs={name ? [{ name, value: current }] : undefined}
    >
      {(close) => (
        <Calendar
          value={current}
          min={min}
          max={max}
          autoFocus
          onChange={(next) => {
            if (value === undefined) setInner(next);
            onValueChange?.(next);
            close();
          }}
        />
      )}
    </DateFieldShell>
  );
}
