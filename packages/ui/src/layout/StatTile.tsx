import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Card, type CardSize } from './Card';
import { intentText, type Intent } from '../theme/intent';

// lg is the original horizontal layout; md shrinks it. sm is a square (from
// Card's sm) with everything stacked: icon, value, label, delta.
const sizeClasses = {
  sm: {
    root: 'justify-center gap-1 p-2', // square + column come from Card sm
    text: 'w-full text-center',
    icon: 'size-8 [&>svg]:size-4',
    label: 'text-[11px]',
    value: 'text-xl',
    delta: 'text-[10px]',
  },
  md: {
    root: 'gap-3 p-3',
    text: '',
    icon: 'size-10 [&>svg]:size-5',
    label: 'text-xs',
    value: 'text-xl',
    delta: 'text-xs',
  },
  lg: {
    root: 'gap-4 p-4',
    text: '',
    icon: 'size-12 [&>svg]:size-6',
    label: 'text-sm',
    value: 'text-2xl',
    delta: 'text-xs',
  },
} as const satisfies Record<CardSize, Record<string, string>>;

export interface StatTileProps {
  label: ReactNode;
  value: ReactNode;
  /** Small note under the value, e.g. "+12% vs last month" or "Due Soon". */
  delta?: ReactNode;
  deltaIntent?: Intent;
  /** Icon shown in a tile at the left. Sized by the tile's `size`. */
  icon?: ReactNode;
  size?: CardSize;
  className?: string;
}

export function StatTile({
  label,
  value,
  delta,
  deltaIntent = 'neutral',
  icon,
  size = 'md',
  className,
}: StatTileProps) {
  const s = sizeClasses[size];
  return (
    <Card size={size} className={cn('flex items-center', s.root, className)}>
      {icon && (
        <div
          className={cn(
            'flex shrink-0 items-center justify-center rounded-control bg-surface-raised text-accent-bright',
            s.icon,
          )}
        >
          {icon}
        </div>
      )}
      <div className={cn('min-w-0', s.text)}>
        <div className={cn('truncate text-ink-muted', s.label)}>{label}</div>
        <div className={cn('font-semibold text-ink', s.value)}>{value}</div>
        {delta && (
          <div className={cn(s.delta, intentText[deltaIntent])}>{delta}</div>
        )}
      </div>
    </Card>
  );
}
