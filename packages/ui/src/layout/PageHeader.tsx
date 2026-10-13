import type { ReactNode } from 'react';
import { cn } from '../utils/cn';

export interface PageHeaderProps {
  title: string;
  /** A line under the title. Markup is fine (a date, a link). */
  subtitle?: ReactNode;
  /** Controls at the right of the title. Keep them compact (icon buttons): they
   *  never wrap under the title, the title's text gives way instead. */
  actions?: ReactNode;
  className?: string;
}

// A row at every width: the title block takes the space the actions leave and
// its text wraps. Wrapping the actions onto their own line instead read as a
// layout glitch when a window was narrowed.
export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-6 flex items-start justify-between gap-4', className)}>
      <div className="min-w-0 flex-1">
        <h1 className="text-2xl font-semibold text-ink sm:text-3xl">{title}</h1>
        {subtitle && <p className="text-ink-muted mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  );
}
