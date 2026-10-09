// Shared look for interactive controls (Button, Input, Select, ...).
// Class strings are written out in full so Tailwind can detect them.

// pointer-coarse (touch) bumps sm/md to the 44px touch-target minimum.
export const controlSize = {
  sm: 'h-8 pointer-coarse:h-11 px-3 text-xs gap-1.5',
  md: 'h-10 pointer-coarse:h-11 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
} as const;

// Square variant of controlSize, for icon-only controls.
export const controlIconSize = {
  sm: 'size-8 pointer-coarse:size-11 text-xs',
  md: 'size-10 pointer-coarse:size-11 text-sm',
  lg: 'size-12 text-base',
} as const satisfies Record<keyof typeof controlSize, string>;

export const controlBase =
  'inline-flex items-center justify-center rounded-control font-medium whitespace-nowrap transition-colors';

export const controlFocusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright';

export const controlDisabled = 'disabled:opacity-50 disabled:cursor-not-allowed';

// Text fields (Input, Select, Textarea, SearchInput). Heights match controlSize
// so a field lines up with a Button of the same size; sm/md grow on touch.
export const controlFieldHeight = {
  sm: 'h-8 pointer-coarse:h-11',
  md: 'h-10 pointer-coarse:h-11',
  lg: 'h-12',
} as const satisfies Record<keyof typeof controlSize, string>;

export const controlFieldText = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
} as const satisfies Record<keyof typeof controlSize, string>;

// scheme-dark keeps native bits (date picker, select list, scrollbars) dark
// without declaring the whole page dark.
export const controlField =
  'w-full rounded-control border border-border bg-surface px-3 text-ink placeholder:text-ink-muted scheme-dark transition-colors aria-invalid:border-critical disabled:bg-surface-raised';
