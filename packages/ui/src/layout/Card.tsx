import { createContext, useContext, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '../utils/cn';

export type CardSize = 'sm' | 'md' | 'lg';

// lg is the original roomy layout; md tightens padding. sm is a square
// (aspect-square, so its height follows the width its container gives it) with
// stacked header / body / footer, for small widgets. Content that doesn't fit
// is clipped, so keep it short.
const sizeClasses = {
  sm: {
    root: 'aspect-square flex flex-col overflow-hidden',
    header: 'px-2.5 py-2',
    title: 'truncate text-xs',
    body: 'min-h-0 flex-1 p-2.5',
    footer: 'px-2.5 py-2',
  },
  md: { root: '', header: 'px-3 py-2.5', title: 'text-sm', body: 'p-3', footer: 'px-3 py-2.5' },
  lg: { root: '', header: 'px-4 py-3', title: 'text-sm', body: 'p-4', footer: 'px-4 py-3' },
} as const satisfies Record<CardSize, Record<string, string>>;

// Header, body and footer follow the Card's size so they stay in step.
const CardSizeContext = createContext<CardSize>('md');

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  size?: CardSize;
}

export function Card({ size = 'md', className, ...rest }: CardProps) {
  return (
    <CardSizeContext.Provider value={size}>
      <div
        className={cn(
          'rounded-card border border-border bg-surface text-ink',
          sizeClasses[size].root,
          className,
        )}
        {...rest}
      />
    </CardSizeContext.Provider>
  );
}

export interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title?: ReactNode;
  /** Right-aligned slot, e.g. a "View All" link button. */
  actions?: ReactNode;
}

// Pass `title` (+ `actions`) for the common case, or `children` for custom content.
export function CardHeader({ title, actions, className, children, ...rest }: CardHeaderProps) {
  const size = sizeClasses[useContext(CardSizeContext)];
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 border-b border-border',
        size.header,
        className,
      )}
      {...rest}
    >
      {title && <h2 className={cn('font-semibold text-ink', size.title)}>{title}</h2>}
      {children}
      {actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function CardBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const size = sizeClasses[useContext(CardSizeContext)];
  return <div className={cn(size.body, className)} {...rest} />;
}

export function CardFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  const size = sizeClasses[useContext(CardSizeContext)];
  return (
    <div
      className={cn(
        'flex items-center justify-end gap-2 border-t border-border',
        size.footer,
        className,
      )}
      {...rest}
    />
  );
}
