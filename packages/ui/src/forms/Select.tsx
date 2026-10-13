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
import { Icon, ChevronDown } from '../icons';

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
      <Icon
        icon={ChevronDown}
        className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-ink-muted"
      />
    </div>
  );
}
