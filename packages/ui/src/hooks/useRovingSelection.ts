import { useRef, type KeyboardEvent } from 'react';

interface Item<T extends string> {
  value: T;
  disabled?: boolean;
}

const STEP_KEYS: Record<string, 1 | -1> = {
  ArrowRight: 1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowUp: -1,
};

// Index to move to for a key press, or undefined if the key isn't navigation.
// `enabled` holds the indexes of non-disabled items; `current` is the selected
// item's index. Arrow keys wrap around.
function targetIndex(key: string, enabled: number[], current: number) {
  if (key === 'Home') return enabled[0];
  if (key === 'End') return enabled[enabled.length - 1];

  const step = STEP_KEYS[key];
  if (!step) return undefined;

  const position = Math.max(0, enabled.indexOf(current));
  return enabled[(position + step + enabled.length) % enabled.length];
}

// Keyboard model shared by ToggleGroup and Tabs: one tab stop (the selected
// item), arrow keys move and select, Home/End jump to the ends, disabled items
// are skipped. Spread `setRef(i)` on each item and `onKeyDown` on the container.
export function useRovingSelection<T extends string>(
  items: Item<T>[],
  value: T,
  onChange: (value: T) => void,
) {
  const refs = useRef<Array<HTMLElement | null>>([]);

  function onKeyDown(e: KeyboardEvent<HTMLElement>) {
    const enabled = items.flatMap((item, i) => (item.disabled ? [] : [i]));
    if (!enabled.length) return;

    const current = items.findIndex((item) => item.value === value);
    const target = targetIndex(e.key, enabled, current);
    if (target === undefined) return;

    e.preventDefault();
    onChange(items[target].value);
    refs.current[target]?.focus();
  }

  function setRef(i: number) {
    return (node: HTMLElement | null) => {
      refs.current[i] = node;
    };
  }

  return { onKeyDown, setRef };
}
