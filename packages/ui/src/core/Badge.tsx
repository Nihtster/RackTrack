import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';
import { intentTint, type Intent } from '../theme/intent';

export type BadgeIntent = Intent;
export type BadgeSize = 'sm' | 'md';

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-1.5 py-0.5 text-caption',
  md: 'px-2.5 py-1 text-xs',
};

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  intent?: BadgeIntent;
  size?: BadgeSize;
}

export function Badge({
  intent = 'neutral',
  size = 'md',
  className,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-control border font-medium whitespace-nowrap',
        intentTint[intent],
        sizeClasses[size],
        className,
      )}
      {...rest}
    />
  );
}
