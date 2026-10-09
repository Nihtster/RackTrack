import type { KeyboardEvent } from 'react';
import { cn } from '../utils/cn';
import { controlFocusRing } from '../theme/control';
import { Input, type InputProps } from './Input';

export interface SearchInputProps
  extends Omit<InputProps, 'type' | 'value' | 'onChange' | 'leading' | 'trailing'> {
  value: string;
  onValueChange: (value: string) => void;
  /** Accessible name for the clear button. */
  clearLabel?: string;
}

// TODO(icon set): swap these inline SVGs for Icon components once #67 lands.
function SearchIcon() {
  return (
    <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function ClearIcon() {
  return (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

// Controlled search box for list filters: search icon, clear button once there
// is text, and Escape also clears.
export function SearchInput({
  value,
  onValueChange,
  clearLabel = 'Clear search',
  onKeyDown,
  className,
  ...rest
}: SearchInputProps) {
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    onKeyDown?.(e);
    if (e.key === 'Escape' && value) {
      e.preventDefault();
      onValueChange('');
    }
  }

  return (
    <Input
      {...rest}
      type="search"
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      onKeyDown={handleKeyDown}
      leading={<SearchIcon />}
      trailing={
        value ? (
          <button
            type="button"
            aria-label={clearLabel}
            onClick={() => onValueChange('')}
            className={cn(
              'flex size-7 items-center justify-center rounded-control text-ink-muted transition-colors hover:text-ink',
              controlFocusRing,
            )}
          >
            <ClearIcon />
          </button>
        ) : undefined
      }
      // The native clear "x" would double up with ours.
      className={cn('[&::-webkit-search-cancel-button]:hidden', className)}
    />
  );
}
