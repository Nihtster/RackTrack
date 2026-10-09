import { useId, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { FieldContext } from './fieldContext';

export interface FieldProps {
  label: ReactNode;
  /** Helper text under the control. Replaced by `error` when there is one. */
  hint?: ReactNode;
  /** Error message; also marks the control invalid. */
  error?: ReactNode;
  required?: boolean;
  /** Override the generated id (to match an existing `htmlFor`). */
  id?: string;
  className?: string;
  children: ReactNode;
}

// Label + control + hint/error, wired for screen readers: the label targets the
// control, and hint/error are announced through aria-describedby.
export function Field({ label, hint, error, required, id, className, children }: FieldProps) {
  const generated = useId();
  const controlId = id ?? generated;
  const hintId = `${controlId}-hint`;
  const errorId = `${controlId}-error`;
  const message = error ? 'error' : hint ? 'hint' : null;

  return (
    <FieldContext.Provider
      value={{
        id: controlId,
        describedBy: message === 'error' ? errorId : message === 'hint' ? hintId : undefined,
        invalid: !!error,
        required: !!required,
      }}
    >
      <div className={cn('flex flex-col gap-1.5', className)}>
        <label htmlFor={controlId} className="text-sm font-medium text-ink">
          {label}
          {required && (
            <span className="ml-0.5 text-critical" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {children}
        {message === 'error' && (
          <p id={errorId} className="text-xs text-critical">
            {error}
          </p>
        )}
        {message === 'hint' && (
          <p id={hintId} className="text-xs text-ink-muted">
            {hint}
          </p>
        )}
      </div>
    </FieldContext.Provider>
  );
}
