import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { cn } from '../utils/cn';
import { controlFocusRing } from '../theme/control';
import { Button } from '../core/Button';
import {
  addDays,
  addMonths,
  daysInMonth,
  parseISO,
  startOfMonth,
  toISO,
} from './date';

// Internal month grid shared by Calendar (one date) and RangeCalendar (two).
// It owns the month view, keyboard navigation and day rendering; callers decide
// what "selected" means through getDayState / onSelectDay.

export interface DayState {
  /** Filled accent day: the chosen date, or either end of a range. */
  selected: boolean;
  /** Part of a highlighted range (including its ends). */
  inRange?: boolean;
  rangeStart?: boolean;
  rangeEnd?: boolean;
}

export interface CalendarGridProps {
  /** ISO date the view and keyboard focus start on; today (clamped to min/max) if missing. */
  seed?: string;
  min?: string;
  max?: string;
  weekStartsOn?: 0 | 1;
  showRange?: boolean;
  autoFocus?: boolean;
  className?: string;
  /** `preview` is the hovered or keyboard-focused day, for range hover preview. */
  getDayState: (iso: string, preview: string | null) => DayState;
  onSelectDay: (iso: string) => void;
}

function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      className="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === 'left' ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6'} />
    </svg>
  );
}

function clamp(iso: string, min?: string, max?: string) {
  if (min && iso < min) return min;
  if (max && iso > max) return max;
  return iso;
}

export function CalendarGrid({
  seed,
  min,
  max,
  weekStartsOn = 0,
  showRange = true,
  autoFocus = false,
  className,
  getDayState,
  onSelectDay,
}: CalendarGridProps) {
  const headingId = useId();
  const rangeId = useId();
  const todayISO = toISO(new Date());

  const [initial] = useState(() => clamp(seed && parseISO(seed) ? seed : toISO(new Date()), min, max));
  const [view, setView] = useState(() => startOfMonth(parseISO(initial)!));
  const [focused, setFocused] = useState(initial);
  const [hovered, setHovered] = useState<string | null>(null);
  const [focusWithin, setFocusWithin] = useState(false);
  const dayRefs = useRef(new Map<string, HTMLButtonElement>());
  const focusAfterRender = useRef(false);

  const monthKey = toISO(view).slice(0, 7);
  // Roving tabindex: the focused day if it is on screen, else the 1st of the month.
  const tabbable = focused.slice(0, 7) === monthKey ? focused : `${monthKey}-01`;
  const preview = hovered ?? (focusWithin ? focused : null);

  useEffect(() => {
    if (autoFocus) dayRefs.current.get(tabbable)?.focus();
    // Only on mount.
    // oxlint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (focusAfterRender.current) {
      focusAfterRender.current = false;
      dayRefs.current.get(focused)?.focus();
    }
  }, [focused, view]);

  function moveFocus(next: Date) {
    const iso = clamp(toISO(next), min, max);
    setFocused(iso);
    setView(startOfMonth(parseISO(iso)!));
    focusAfterRender.current = true;
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    const current = parseISO(focused)!;
    const weekday = (current.getDay() - weekStartsOn + 7) % 7;
    const moves: Record<string, Date> = {
      ArrowLeft: addDays(current, -1),
      ArrowRight: addDays(current, 1),
      ArrowUp: addDays(current, -7),
      ArrowDown: addDays(current, 7),
      Home: addDays(current, -weekday),
      End: addDays(current, 6 - weekday),
      PageUp: addMonths(current, e.shiftKey ? -12 : -1),
      PageDown: addMonths(current, e.shiftKey ? 12 : 1),
    };
    const next = moves[e.key];
    if (!next) return;
    e.preventDefault();
    moveFocus(next);
  }

  const lead = (view.getDay() - weekStartsOn + 7) % 7;
  const cells: Array<string | null> = [
    ...Array<null>(lead).fill(null),
    ...Array.from({ length: daysInMonth(view) }, (_, i) => `${monthKey}-${String(i + 1).padStart(2, '0')}`),
  ];
  while (cells.length % 7) cells.push(null);
  const weeks = Array.from({ length: cells.length / 7 }, (_, i) => cells.slice(i * 7, i * 7 + 7));

  const monthLabel = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(view);
  const dayName = new Intl.DateTimeFormat(undefined, { weekday: 'short' });
  const fullDate = new Intl.DateTimeFormat(undefined, { dateStyle: 'full' });
  // 2023-01-01 was a Sunday.
  const weekdays = Array.from({ length: 7 }, (_, i) =>
    dayName.format(new Date(2023, 0, 1 + ((i + weekStartsOn) % 7))),
  );

  const medium = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium' });
  const minDate = parseISO(min);
  const maxDate = parseISO(max);
  const rangeLabel =
    minDate && maxDate
      ? `Available: ${medium.format(minDate)} – ${medium.format(maxDate)}`
      : minDate
        ? `Available from ${medium.format(minDate)}`
        : maxDate
          ? `Available until ${medium.format(maxDate)}`
          : null;

  const prevDisabled = !!min && toISO(addDays(view, -1)) < min;
  const nextDisabled = !!max && toISO(new Date(view.getFullYear(), view.getMonth() + 1, 1)) > max;

  return (
    <div
      className={cn('w-fit rounded-card border border-border bg-surface-raised p-3 text-ink', className)}
    >
      <div className="mb-2 flex items-center justify-between">
        <Button
          iconOnly
          size="sm"
          variant="ghost"
          aria-label="Previous month"
          disabled={prevDisabled}
          onClick={() => setView(addMonths(view, -1))}
        >
          <Chevron direction="left" />
        </Button>
        <div id={headingId} aria-live="polite" className="text-sm font-semibold">
          {monthLabel}
        </div>
        <Button
          iconOnly
          size="sm"
          variant="ghost"
          aria-label="Next month"
          disabled={nextDisabled}
          onClick={() => setView(addMonths(view, 1))}
        >
          <Chevron direction="right" />
        </Button>
      </div>

      <div
        role="grid"
        aria-labelledby={headingId}
        aria-describedby={showRange && rangeLabel ? rangeId : undefined}
        onKeyDown={onKeyDown}
        onFocus={() => setFocusWithin(true)}
        onBlur={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget)) setFocusWithin(false);
        }}
        onMouseLeave={() => setHovered(null)}
      >
        <div role="row" className="grid grid-cols-7">
          {weekdays.map((name) => (
            <div
              key={name}
              role="columnheader"
              className="flex h-8 items-center justify-center text-xs font-medium text-ink-muted"
            >
              {name.slice(0, 2)}
            </div>
          ))}
        </div>
        {weeks.map((week, w) => (
          <div key={w} role="row" className="grid grid-cols-7">
            {week.map((iso, i) => {
              if (!iso) return <div key={i} role="gridcell" aria-hidden="true" />;
              const state = getDayState(iso, preview);
              const disabled = (!!min && iso < min) || (!!max && iso > max);
              return (
                // The cell carries the range band so it runs unbroken across days.
                <div
                  key={iso}
                  role="gridcell"
                  aria-selected={state.selected}
                  className={cn(
                    state.inRange && 'bg-accent/15',
                    state.rangeStart && 'rounded-l-control',
                    state.rangeEnd && 'rounded-r-control',
                  )}
                >
                  <button
                    ref={(node) => {
                      if (node) dayRefs.current.set(iso, node);
                      else dayRefs.current.delete(iso);
                    }}
                    type="button"
                    aria-current={iso === todayISO ? 'date' : undefined}
                    aria-label={fullDate.format(parseISO(iso)!)}
                    disabled={disabled}
                    tabIndex={iso === tabbable ? 0 : -1}
                    onClick={() => {
                      setFocused(iso);
                      onSelectDay(iso);
                    }}
                    onMouseEnter={() => setHovered(iso)}
                    className={cn(
                      'mx-auto flex size-9 items-center justify-center rounded-control text-sm transition-colors pointer-coarse:size-11',
                      controlFocusRing,
                      // Out-of-range days: muted, struck through, no hover, so they
                      // read as unavailable and not just faded.
                      'disabled:cursor-not-allowed disabled:text-ink-muted disabled:line-through disabled:opacity-35 disabled:hover:bg-transparent',
                      state.selected
                        ? 'bg-accent font-semibold text-ink hover:bg-accent-bright'
                        : 'hover:bg-surface',
                      !state.selected && iso === todayISO && 'ring-1 ring-accent ring-inset',
                    )}
                  >
                    {Number(iso.slice(8))}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>
      {showRange && rangeLabel && (
        <p id={rangeId} className="mt-2 border-t border-border pt-2 text-center text-xs text-ink-muted">
          {rangeLabel}
        </p>
      )}
    </div>
  );
}
