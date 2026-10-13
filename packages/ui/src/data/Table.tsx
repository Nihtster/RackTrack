import {
  createContext,
  useContext,
  type HTMLAttributes,
  type ReactNode,
  type TdHTMLAttributes,
  type ThHTMLAttributes,
} from 'react';
import { cn } from '../utils/cn';
import { controlFocusRing } from '../theme/control';
import { EmptyState, type EmptyStateProps } from '../feedback/EmptyState';
import { ChevronDown, ChevronUp, Icon } from '../icons';

// Composable table, adapted from Mantine's Table API: Table + TableHead /
// TableBody / TableFoot / TableRow / TableHeader / TableCell / TableCaption.
// Sorting is controlled: the parent owns the sort state and the row order.

export type TableSize = 'sm' | 'md' | 'lg';
export type SortDirection = 'asc' | 'desc';

const cellPadding: Record<TableSize, string> = {
  sm: 'px-3 py-2',
  md: 'px-4 py-3',
  lg: 'px-5 py-4',
};

const TableSizeContext = createContext<TableSize>('md');

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  size?: TableSize;
  /** Alternate row backgrounds. */
  striped?: boolean;
  /** Highlight the row under the pointer (mouse only). */
  highlightOnHover?: boolean;
  /** Outer border and rounded corners. Default true. */
  withTableBorder?: boolean;
  /** Divider between columns. */
  withColumnBorders?: boolean;
  /** Divider between body rows. Default true. */
  withRowBorders?: boolean;
  /** Keep the header visible while the body scrolls. Give the container a
   *  height via `containerClassName` (e.g. `max-h-96`). */
  stickyHeader?: boolean;
  /** Classes for the scroll container around the table. */
  containerClassName?: string;
  /** Names the scrollable region for screen readers; also makes it focusable
   *  so keyboard users can scroll a table that overflows. */
  scrollLabel?: string;
}

export function Table({
  size = 'md',
  striped,
  highlightOnHover,
  withTableBorder = true,
  withColumnBorders,
  withRowBorders = true,
  stickyHeader,
  containerClassName,
  scrollLabel,
  className,
  ...rest
}: TableProps) {
  return (
    <TableSizeContext.Provider value={size}>
      {/* Wide tables scroll sideways instead of squashing or breaking the page. */}
      <div
        role={scrollLabel ? 'region' : undefined}
        aria-label={scrollLabel}
        tabIndex={scrollLabel ? 0 : undefined}
        className={cn(
          'w-full overflow-auto bg-surface text-ink',
          withTableBorder && 'rounded-card border border-border',
          scrollLabel && controlFocusRing,
          containerClassName,
        )}
      >
        <table
          className={cn(
            'w-full border-collapse text-left text-sm',
            withRowBorders &&
              '[&_tbody>tr]:border-b [&_tbody>tr]:border-border [&_tbody>tr:last-child]:border-b-0',
            striped && '[&_tbody>tr:nth-child(even)]:bg-surface-raised/40',
            highlightOnHover && '[&_tbody>tr:hover]:bg-surface-raised/70',
            withColumnBorders &&
              '[&_:is(th,td):not(:last-child)]:border-r [&_:is(th,td):not(:last-child)]:border-border',
            stickyHeader && '[&_thead_th]:sticky [&_thead_th]:top-0 [&_thead_th]:z-10',
            className,
          )}
          {...rest}
        />
      </div>
    </TableSizeContext.Provider>
  );
}

export function TableHead({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('border-b border-border', className)} {...rest} />;
}

export function TableBody(props: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody {...props} />;
}

export function TableFoot({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tfoot className={cn('border-t border-border bg-surface-raised/40', className)} {...rest} />;
}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {
  /** Accent-tinted background for a chosen row. */
  selected?: boolean;
}

export function TableRow({ selected, className, ...rest }: TableRowProps) {
  return (
    <tr
      aria-selected={selected || undefined}
      className={cn(selected && 'bg-accent/10', className)}
      {...rest}
    />
  );
}

export function TableCaption({ className, ...rest }: HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption className={cn('px-4 py-2 text-left text-xs text-ink-muted', className)} {...rest} />;
}

interface CellAlign {
  /** Right-aligned with tabular digits, for numbers. */
  numeric?: boolean;
}

export interface TableCellProps extends TdHTMLAttributes<HTMLTableCellElement>, CellAlign {}

export function TableCell({ numeric, className, ...rest }: TableCellProps) {
  const size = useContext(TableSizeContext);
  return (
    <td
      className={cn(cellPadding[size], numeric && 'text-right tabular-nums', className)}
      {...rest}
    />
  );
}

export interface TableHeaderProps
  extends Omit<ThHTMLAttributes<HTMLTableCellElement>, 'onClick'>,
    CellAlign {
  /** Makes the header a sort button. Pair with `sorted`. */
  onSort?: () => void;
  /** Current direction for this column, or null/undefined when not sorted by it. */
  sorted?: SortDirection | null;
}

function SortIcon({ direction }: { direction: SortDirection | null | undefined }) {
  // Both chevrons are always drawn; the one for the active direction stays solid.
  return (
    <span className="flex shrink-0 flex-col -space-y-1.5" aria-hidden="true">
      <Icon
        icon={ChevronUp}
        size="xs"
        strokeWidth={2.5}
        className={direction === 'desc' ? 'opacity-30' : undefined}
      />
      <Icon
        icon={ChevronDown}
        size="xs"
        strokeWidth={2.5}
        className={direction === 'asc' ? 'opacity-30' : undefined}
      />
    </span>
  );
}

export function TableHeader({
  numeric,
  onSort,
  sorted,
  className,
  children,
  scope = 'col',
  ...rest
}: TableHeaderProps) {
  const size = useContext(TableSizeContext);
  const sortable = !!onSort;

  return (
    <th
      scope={scope}
      aria-sort={
        sortable ? (sorted === 'asc' ? 'ascending' : sorted === 'desc' ? 'descending' : 'none') : undefined
      }
      className={cn(
        'bg-surface text-xs font-medium whitespace-nowrap text-ink-muted',
        cellPadding[size],
        numeric && 'text-right',
        className,
      )}
      {...rest}
    >
      {sortable ? (
        <button
          type="button"
          onClick={onSort}
          className={cn(
            '-mx-1 inline-flex items-center gap-1 rounded-control px-1 py-0.5 font-medium transition-colors hover:text-ink',
            numeric && 'flex-row-reverse',
            sorted && 'text-ink',
            controlFocusRing,
          )}
        >
          {children}
          <SortIcon direction={sorted} />
        </button>
      ) : (
        children
      )}
    </th>
  );
}

export interface TableEmptyProps extends EmptyStateProps {
  /** Number of columns, so the message spans the whole row. */
  colSpan: number;
}

// Drop into TableBody when there are no rows.
export function TableEmpty({ colSpan, ...emptyState }: TableEmptyProps): ReactNode {
  return (
    <tr>
      <td colSpan={colSpan}>
        <EmptyState {...emptyState} />
      </td>
    </tr>
  );
}
