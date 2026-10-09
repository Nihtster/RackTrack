import { cn } from '../utils/cn';

export type SpinnerSize = 'sm' | 'md' | 'lg';

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'size-4',
  md: 'size-6',
  lg: 'size-8',
};

export interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

// Decorative: pair it with text or aria-busy, or use Loading for a labelled one.
export function Spinner({ size = 'sm', className }: SpinnerProps) {
  return (
    <svg
      className={cn('animate-spin', sizeClasses[size], className)}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
        stroke="currentColor"
        strokeWidth="3"
        className="opacity-25"
      />
      <path
        d="M21 12a9 9 0 0 0-9-9"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
