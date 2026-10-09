import { useId, useState, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { controlDisabled, controlFocusRing } from '../theme/control';
import { useRovingSelection } from '../hooks/useRovingSelection';

export interface TabItem<T extends string> {
  value: T;
  label: ReactNode;
  /** Panel content, rendered only while the tab is active. */
  content: ReactNode;
  disabled?: boolean;
}

export interface TabsProps<T extends string> {
  items: TabItem<T>[];
  /** Controlled value. Omit to let Tabs manage it (see `defaultValue`). */
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  /** Accessible name for the tab list, e.g. "Firearm details". */
  'aria-label': string;
  className?: string;
}

export function Tabs<T extends string>({
  items,
  value,
  defaultValue,
  onValueChange,
  className,
  'aria-label': ariaLabel,
}: TabsProps<T>) {
  const baseId = useId();
  const [inner, setInner] = useState<T>(
    defaultValue ?? items.find((i) => !i.disabled)?.value ?? items[0].value,
  );
  const active = value ?? inner;

  function change(next: T) {
    if (value === undefined) setInner(next);
    onValueChange?.(next);
  }

  const { onKeyDown, setRef } = useRovingSelection(items, active, change);
  const activeItem = items.find((i) => i.value === active);

  return (
    <div className={className}>
      {/* Scrolls sideways on narrow screens instead of wrapping. */}
      <div
        role="tablist"
        aria-label={ariaLabel}
        onKeyDown={onKeyDown}
        className="flex overflow-x-auto border-b border-border"
      >
        {items.map((item, i) => {
          const selected = item.value === active;
          return (
            <button
              key={item.value}
              ref={setRef(i)}
              id={`${baseId}-tab-${item.value}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${item.value}`}
              disabled={item.disabled}
              tabIndex={selected ? 0 : -1}
              onClick={() => change(item.value)}
              className={cn(
                'relative -mb-px shrink-0 rounded-t-control border-b-2 px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors',
                // Keyboard focus is a tint, not an outline: the tab list scrolls
                // (overflow clips an offset ring) and an outline would cover the
                // selected underline.
                'focus-visible:bg-accent/10 focus-visible:outline-none',
                controlDisabled,
                selected
                  ? 'border-accent text-ink'
                  : 'border-transparent text-ink-muted hover:text-ink',
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {activeItem && (
        <div
          role="tabpanel"
          id={`${baseId}-panel-${activeItem.value}`}
          aria-labelledby={`${baseId}-tab-${activeItem.value}`}
          tabIndex={0}
          className={cn('pt-4', controlFocusRing)}
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
}
