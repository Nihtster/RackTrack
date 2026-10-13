import { useState, type ReactNode, type Ref } from 'react';
import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useMergeRefs,
  useRole,
  useTransitionStatus,
} from '@floating-ui/react';
import { cn } from '../utils/cn';
import {
  controlDisabled,
  controlField,
  controlFieldHeight,
  controlFieldText,
  controlFocusRing,
  controlSize,
} from '../theme/control';
import { motionDuration, motionPop } from '../theme/motion';
import { useFieldControl, useFieldLabelId } from './fieldContext';

// Internal: the field-styled button + popover that DatePicker and
// DateRangePicker share. The picker supplies what to show and the calendar.

export interface DateFieldShellProps {
  /** Text shown in the field, or null for the placeholder. */
  display: string | null;
  placeholder: string;
  size?: keyof typeof controlSize;
  invalid?: boolean;
  disabled?: boolean;
  /** Hidden inputs so the value submits with a surrounding <form>. */
  hiddenInputs?: Array<{ name: string; value: string }>;
  id?: string;
  'aria-describedby'?: string;
  'aria-label'?: string;
  popoverLabel: string;
  className?: string;
  ref?: Ref<HTMLButtonElement>;
  /** The calendar; call `close` once the user has finished choosing. */
  children: (close: () => void) => ReactNode;
}

function CalendarIcon() {
  return (
    <svg
      className="size-4 shrink-0 text-ink-muted"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}

export function DateFieldShell({
  display,
  placeholder,
  size = 'md',
  invalid,
  disabled,
  hiddenInputs,
  popoverLabel,
  className,
  ref,
  children,
  ...rest
}: DateFieldShellProps) {
  const [open, setOpen] = useState(false);

  const control = useFieldControl({
    id: rest.id,
    'aria-describedby': rest['aria-describedby'],
    invalid,
  });

  // The button's visible text is the chosen date (or the placeholder), so the
  // accessible name has to include it: a bare aria-label would hide the value
  // from screen readers. In a Field, name it by the field's label plus itself.
  const labelId = useFieldLabelId();
  const shown = display ?? placeholder;
  const nameProps =
    labelId && control.id
      ? { 'aria-labelledby': `${labelId} ${control.id}` }
      : rest['aria-label']
        ? { 'aria-label': `${rest['aria-label']}: ${shown}` }
        : {};

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
    middleware: [offset(6), flip(), shift({ padding: 8 })],
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useClick(context),
    useDismiss(context),
    useRole(context, { role: 'dialog' }),
  ]);

  const { isMounted, status } = useTransitionStatus(context, { duration: motionDuration });

  // `ref` is a plain prop in React 19, not a ref object read during render.
  // oxlint-disable-next-line react/refs
  const triggerRef = useMergeRefs([refs.setReference, ref]);

  return (
    <div className="w-full">
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        {...nameProps}
        aria-haspopup="dialog"
        aria-expanded={open}
        {...control}
        {...getReferenceProps()}
        className={cn(
          controlField,
          controlFieldHeight[size],
          controlFieldText[size],
          controlFocusRing,
          controlDisabled,
          'flex items-center justify-between gap-2 text-left',
          !display && 'text-ink-muted',
          className,
        )}
      >
        <span className="truncate">{display ?? placeholder}</span>
        <CalendarIcon />
      </button>
      {hiddenInputs?.map(({ name, value }) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      {isMounted && (
        <FloatingPortal>
          <FloatingFocusManager context={context} modal={false} initialFocus={-1}>
            <div
              ref={refs.setFloating}
              style={floatingStyles}
              {...getFloatingProps()}
              aria-label={popoverLabel}
              className="z-50"
            >
              {/* Inner element carries the motion; the outer one is positioned. */}
              <div data-status={status} className={cn('shadow-lg', motionPop)}>
                {children(() => setOpen(false))}
              </div>
            </div>
          </FloatingFocusManager>
        </FloatingPortal>
      )}
    </div>
  );
}
