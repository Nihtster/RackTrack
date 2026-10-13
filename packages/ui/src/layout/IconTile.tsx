import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

// Tile and glyph size together: the glyph steps through the same 16 / 20 / 24px
// as Icon's sm / md / lg, so an Icon passed as a child needs no size of its own.
const sizeClasses = {
  sm: 'size-8 [&>svg]:size-4',
  md: 'size-10 [&>svg]:size-5',
  lg: 'size-12 [&>svg]:size-6',
} as const;

// Full class strings so Tailwind can see them.
const toneClasses = {
  default: 'bg-surface-raised text-accent-bright',
  neutral: 'bg-surface-raised text-ink-muted',
  accent: 'bg-accent/15 text-accent',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  critical: 'bg-critical/15 text-critical',
  violet: 'bg-violet/15 text-violet',
} as const;

export type IconTileSize = keyof typeof sizeClasses;
export type IconTileTone = keyof typeof toneClasses;

export interface IconTileProps extends HTMLAttributes<HTMLSpanElement> {
  size?: IconTileSize;
  /** `default` is the plain accent look; the rest tint tile and glyph together. */
  tone?: IconTileTone;
  /** A circle instead of a rounded square (activity feeds, avatars). */
  round?: boolean;
}

// A tinted square holding an icon: stat tiles, list rows, feed items. Put an
// <Icon> inside; it is decorative unless you give the Icon a label.
export function IconTile({
  size = 'md',
  tone = 'default',
  round = false,
  className,
  ...rest
}: IconTileProps) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center',
        round ? 'rounded-full' : 'rounded-control',
        sizeClasses[size],
        toneClasses[tone],
        className,
      )}
      {...rest}
    />
  );
}
