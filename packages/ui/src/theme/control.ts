// Shared look for interactive controls (Button, Input, Select, ...).
// Class strings are written out in full so Tailwind can detect them.

export const controlSize = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2.5',
} as const;

// Square variant of controlSize, for icon-only controls.
export const controlIconSize = {
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
} as const satisfies Record<keyof typeof controlSize, string>;

export const controlBase =
  'inline-flex items-center justify-center rounded-control font-medium whitespace-nowrap transition-colors';

export const controlFocusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-bright';

export const controlDisabled = 'disabled:opacity-50 disabled:cursor-not-allowed';
