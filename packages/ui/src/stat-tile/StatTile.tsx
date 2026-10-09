import type { ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Card } from '../card/Card';
import { intentText, type Intent } from '../theme/intent';

export interface StatTileProps {
  label: ReactNode;
  value: ReactNode;
  /** Small note under the value, e.g. "+12% vs last month" or "Due Soon". */
  delta?: ReactNode;
  deltaIntent?: Intent;
  /** Icon shown in a tile at the left. */
  icon?: ReactNode;
  className?: string;
}

export function StatTile({
  label,
  value,
  delta,
  deltaIntent = 'neutral',
  icon,
  className,
}: StatTileProps) {
  return (
    <Card className={cn('flex items-center gap-4 p-4', className)}>
      {icon && (
        <div className="flex size-12 shrink-0 items-center justify-center rounded-control bg-surface-raised text-accent-bright">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <div className="truncate text-sm text-ink-muted">{label}</div>
        <div className="text-2xl font-semibold text-ink">{value}</div>
        {delta && (
          <div className={cn('text-xs', intentText[deltaIntent])}>{delta}</div>
        )}
      </div>
    </Card>
  );
}
