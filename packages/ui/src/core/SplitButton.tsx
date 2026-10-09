import type { MouseEventHandler, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Menu, type MenuItem } from './Menu';
import { Button, type ButtonSize, type ButtonVariant } from './Button';

export interface SplitButtonProps {
  /** Main action label. */
  children: ReactNode;
  /** Runs when the main (left) part is clicked. */
  onClick?: MouseEventHandler<HTMLButtonElement>;
  /** Alternate actions shown in the chevron menu. */
  options: MenuItem[];
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  leadingIcon?: ReactNode;
  /** Accessible name for the chevron button. */
  menuLabel?: string;
  className?: string;
}

function ChevronDown() {
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
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export function SplitButton({
  children,
  onClick,
  options,
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  leadingIcon,
  menuLabel = 'More options',
  className,
}: SplitButtonProps) {
  const inactive = disabled || loading;

  return (
    <div className={cn('inline-flex', className)}>
      <Button
        variant={variant}
        size={size}
        loading={loading}
        disabled={disabled}
        leadingIcon={leadingIcon}
        onClick={onClick}
        className="rounded-r-none"
      >
        {children}
      </Button>
      <Menu
        items={options}
        trigger={
          <Button
            iconOnly
            variant={variant}
            size={size}
            disabled={inactive}
            aria-label={menuLabel}
            className="rounded-l-none border-l border-l-ink/20"
          >
            <ChevronDown />
          </Button>
        }
      />
    </div>
  );
}
