import { cn } from '../utils/cn';
import { Button, type ButtonSize } from '../core/Button';
import { DOTS, paginationRange } from './paginationRange';

export interface PaginationProps {
  /** Current page, 1-based. */
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
  /** Pages shown on each side of the current one. Default 1. */
  siblings?: number;
  /** Pages always shown at the start and end. Default 1. */
  boundaries?: number;
  size?: ButtonSize;
  disabled?: boolean;
  /** Accessible name for the navigation landmark. */
  'aria-label'?: string;
  className?: string;
}

// TODO(icon set): swap for Icon components once #67 lands.
function Chevron({ direction }: { direction: 'left' | 'right' }) {
  return (
    <svg
      className="size-4"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={direction === 'left' ? 'm15 6-6 6 6 6' : 'm9 6 6 6-6 6'} />
    </svg>
  );
}

// Controlled page buttons for long tables. The parent owns the page number and
// slices its rows; this only renders the controls.
export function Pagination({
  page,
  pageCount,
  onPageChange,
  siblings = 1,
  boundaries = 1,
  size = 'sm',
  disabled,
  className,
  'aria-label': ariaLabel = 'Pagination',
}: PaginationProps) {
  if (pageCount < 1) return null;
  const current = Math.min(Math.max(page, 1), pageCount);
  const items = paginationRange(current, pageCount, siblings, boundaries);

  return (
    <nav aria-label={ariaLabel} className={className}>
      <ul className="flex flex-wrap items-center gap-1">
        <li>
          <Button
            iconOnly
            size={size}
            variant="ghost"
            aria-label="Previous page"
            disabled={disabled || current === 1}
            onClick={() => onPageChange(current - 1)}
          >
            <Chevron direction="left" />
          </Button>
        </li>
        {items.map((item, i) =>
          item === DOTS ? (
            <li
              key={`dots-${i}`}
              aria-hidden="true"
              className={cn('flex items-center justify-center text-ink-muted', 'size-8')}
            >
              …
            </li>
          ) : (
            <li key={item}>
              <Button
                iconOnly
                size={size}
                variant={item === current ? 'primary' : 'ghost'}
                aria-label={`Page ${item}`}
                aria-current={item === current ? 'page' : undefined}
                disabled={disabled}
                onClick={() => onPageChange(item)}
              >
                <span className="tabular-nums">{item}</span>
              </Button>
            </li>
          ),
        )}
        <li>
          <Button
            iconOnly
            size={size}
            variant="ghost"
            aria-label="Next page"
            disabled={disabled || current === pageCount}
            onClick={() => onPageChange(current + 1)}
          >
            <Chevron direction="right" />
          </Button>
        </li>
      </ul>
    </nav>
  );
}
