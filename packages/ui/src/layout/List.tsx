import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { ChevronRight, Icon } from '../icons';

export type ListProps = HTMLAttributes<HTMLUListElement>;

// A vertical list of rows with a hairline between them, for the inside of a
// Card. Rows are ListItems.
export function List({ className, ...rest }: ListProps) {
  return <ul className={cn('divide-y divide-border', className)} {...rest} />;
}

const rowClass = 'flex gap-3 px-4 py-3';

const interactiveClass =
  'transition-colors hover:bg-surface-raised focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-bright';

export interface ListItemLinkProps {
  className: string;
  children: ReactNode;
}

export interface ListItemProps extends Omit<HTMLAttributes<HTMLLIElement>, 'title'> {
  /** Left slot: usually an IconTile. */
  leading?: ReactNode;
  title: ReactNode;
  /** Muted line(s) under the title. */
  description?: ReactNode;
  /** Right slot before the chevron: a badge, a figure, a meter. */
  trailing?: ReactNode;
  /** Align the slots to the top of the row instead of the middle, for rows with
   *  more than one line of description. */
  alignStart?: boolean;
  /** Makes the whole row a link. Receives the row's class and content; return
   *  your router's link around them, as the Sidebar's `renderLink` does. */
  renderLink?: (props: ListItemLinkProps) => ReactNode;
  /** Shows a chevron at the right. Defaults to true when the row is a link. */
  chevron?: boolean;
}

// One row of a List. Static by default; pass `renderLink` to make it navigate.
export function ListItem({
  leading,
  title,
  description,
  trailing,
  alignStart,
  renderLink,
  chevron = renderLink !== undefined,
  className,
  ...rest
}: ListItemProps) {
  const content = (
    <>
      {leading}
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-ink">{title}</div>
        {description && <div className="text-xs text-ink-muted [&>*]:truncate">{description}</div>}
      </div>
      {trailing}
      {chevron && <Icon icon={ChevronRight} className="shrink-0 text-ink-muted" />}
    </>
  );

  const layout = cn(rowClass, alignStart ? 'items-start' : 'items-center');

  return (
    <li className={className} {...rest}>
      {renderLink ? (
        renderLink({ className: cn(layout, interactiveClass), children: content })
      ) : (
        <div className={layout}>{content}</div>
      )}
    </li>
  );
}
