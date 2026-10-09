import type { Ref, SelectHTMLAttributes } from 'react';
import { cn } from '../utils/cn';
import {
  controlDisabled,
  controlField,
  controlFieldHeight,
  controlFieldText,
  controlFocusRing,
  controlSize,
} from '../theme/control';
import { useFieldControl } from './fieldContext';

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  size?: keyof typeof controlSize;
  invalid?: boolean;
  /** Empty first option, e.g. "Choose a caliber". */
  placeholder?: string;
  ref?: Ref<HTMLSelectElement>;
}

// Styled native <select>: keeps keyboard, screen-reader and mobile-picker
// behavior for free. Pass <option> children.
export function Select({
  size = 'md',
  invalid,
  placeholder,
  className,
  children,
  ref,
  ...rest
}: SelectProps) {
  const control = useFieldControl({
    id: rest.id,
    'aria-describedby': rest['aria-describedby'],
    invalid,
    required: rest.required,
  });

  return (
    <div className="relative w-full">
      <select
        ref={ref}
        {...rest}
        {...control}
        className={cn(
          controlField,
          controlFieldHeight[size],
          controlFieldText[size],
          controlFocusRing,
          controlDisabled,
          'appearance-none pr-9',
          className,
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {children}
      </select>
      <svg
        className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-ink-muted"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}
