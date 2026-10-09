// Shared status colors (tinted background + matching text) for non-solid
// elements like Badge. Full class strings so Tailwind can detect them.
export const intentTint = {
  neutral: 'bg-surface-raised text-ink-muted border-border',
  accent: 'bg-accent/15 text-accent-bright border-accent/30',
  success: 'bg-success/15 text-success border-success/30',
  warning: 'bg-warning/15 text-warning border-warning/30',
  critical: 'bg-critical/15 text-critical border-critical/30',
} as const;

export type Intent = keyof typeof intentTint;

// Text-only status colors, for small annotations (stat deltas, helper text).
export const intentText = {
  neutral: 'text-ink-muted',
  accent: 'text-accent-bright',
  success: 'text-success',
  warning: 'text-warning',
  critical: 'text-critical',
} as const satisfies Record<Intent, string>;
