import type { HTMLAttributes } from 'react';
import { cn } from '../utils/cn';

// Placeholder block for content that is still loading. Size it with className
// (e.g. `h-4 w-32`).
export function Skeleton({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn('animate-pulse rounded-control bg-surface-raised', className)}
      {...rest}
    />
  );
}
