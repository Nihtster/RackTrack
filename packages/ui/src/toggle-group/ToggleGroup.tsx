import { useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import {
  controlBase,
  controlDisabled,
  controlFocusRing,
  controlSize,
} from '../theme/control';

export interface ToggleGroupOption<T extends string> {
  value: T;
  label: ReactNode;
  disabled?: boolean;
}

export interface ToggleGroupProps<T extends string> {
  options: ToggleGroupOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: keyof typeof controlSize;
  /** Accessible name for the group, e.g. "Filter by type". */
  'aria-label': string;
  className?: string;
}

// Row of chips where exactly one is selected (filters, time ranges).
// Radio-group semantics: one tab stop, arrow keys move and select.
export function ToggleGroup<T extends string>({
  options,
  value,
  onChange,
  size = 'sm',
  className,
  ...rest
}: ToggleGroupProps<T>) {
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const dir =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? 1
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? -1
          : 0;
    if (!dir) return;
    e.preventDefault();
    const current = options.findIndex((o) => o.value === value);
    for (let step = 1; step <= options.length; step++) {
      const i = (current + dir * step + options.length * step) % options.length;
      if (!options[i].disabled) {
        onChange(options[i].value);
        refs.current[i]?.focus();
        return;
      }
    }
  }

  return (
    <div
      role="radiogroup"
      onKeyDown={onKeyDown}
      className={cn('inline-flex flex-wrap items-center gap-2', className)}
      {...rest}
    >
      {options.map((option, i) => {
        const selected = option.value === value;
        return (
          <button
            key={option.value}
            ref={(node) => {
              refs.current[i] = node;
            }}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={option.disabled}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              controlBase,
              controlFocusRing,
              controlDisabled,
              controlSize[size],
              'border',
              selected
                ? 'border-accent bg-accent/15 text-accent-bright'
                : 'border-border bg-transparent text-ink-muted hover:border-ink-muted hover:text-ink',
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
