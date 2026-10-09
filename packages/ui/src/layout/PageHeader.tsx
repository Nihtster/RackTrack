import { cn } from '../utils/cn'

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export function PageHeader({ title, subtitle, className }: PageHeaderProps) {
  return (
    <div className={cn('mb-6', className)}>
      <h1 className="text-3xl font-semibold text-ink">{title}</h1>
      {subtitle && <p className="text-ink-muted mt-1">{subtitle}</p>}
    </div>
  );
}
