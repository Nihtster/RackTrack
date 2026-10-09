import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
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

export type InputSize = keyof typeof controlSize;

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: InputSize;
  /** Mark invalid (also set automatically by a surrounding Field with an error). */
  invalid?: boolean;
  /** Decorative icon inside the left edge. */
  leading?: ReactNode;
  /** Interactive content inside the right edge, e.g. a clear button. */
  trailing?: ReactNode;
  ref?: Ref<HTMLInputElement>;
}

// Text, number, date, etc. via the native `type`.
export function Input({
  size = 'md',
  invalid,
  leading,
  trailing,
  className,
  ref,
  ...rest
}: InputProps) {
  const control = useFieldControl({
    id: rest.id,
    'aria-describedby': rest['aria-describedby'],
    invalid,
    required: rest.required,
  });

  const input = (
    <input
      ref={ref}
      {...rest}
      {...control}
      className={cn(
        controlField,
        controlFieldHeight[size],
        controlFieldText[size],
        controlFocusRing,
        controlDisabled,
        leading && 'pl-9',
        trailing && 'pr-10',
        className,
      )}
    />
  );

  if (!leading && !trailing) return input;

  return (
    <div className="relative w-full">
      {leading && (
        <span className="pointer-events-none absolute inset-y-0 left-0 flex w-9 items-center justify-center text-ink-muted">
          {leading}
        </span>
      )}
      {input}
      {trailing && (
        <span className="absolute inset-y-0 right-1 flex items-center">{trailing}</span>
      )}
    </div>
  );
}
