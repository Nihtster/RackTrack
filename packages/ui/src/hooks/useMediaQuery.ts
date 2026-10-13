import { useSyncExternalStore } from 'react';

/**
 * Whether a CSS media query currently matches, kept in step as it changes
 * (window resized, device rotated, input device attached).
 *
 *   const touch = useMediaQuery('(pointer: coarse)')
 *
 * Use it only for what CSS can't decide, such as rendering a different tree
 * instead of hiding one. For anything else prefer Tailwind's variants.
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const list = window.matchMedia(query);
      list.addEventListener('change', onChange);
      return () => list.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    // No window on the server: render the wide layout.
    () => false,
  );
}
