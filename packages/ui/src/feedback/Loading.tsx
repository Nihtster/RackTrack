import { cn } from '../utils/cn';
import { Spinner, type SpinnerSize } from './Spinner';

export interface LoadingProps {
  /** Announced to screen readers; shown beside the spinner unless `hideLabel`. */
  label?: string;
  hideLabel?: boolean;
  size?: SpinnerSize;
  className?: string;
}

export function Loading({
  label = 'Loading',
  hideLabel = false,
  size = 'md',
  className,
}: LoadingProps) {
  return (
    <div
      role="status"
      className={cn('inline-flex items-center gap-3 text-ink-muted', className)}
    >
      <Spinner size={size} />
      <span className={cn('text-sm', hideLabel && 'sr-only')}>{label}</span>
    </div>
  );
}
