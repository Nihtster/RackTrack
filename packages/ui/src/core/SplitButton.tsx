import type { MouseEventHandler, ReactNode } from 'react';
import { cn } from '../utils/cn';
import { Menu, type MenuItem } from './Menu';
import { Button, type ButtonSize, type ButtonVariant } from './Button';
import { Icon, ChevronDown } from '../icons';

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
            <Icon icon={ChevronDown} />
          </Button>
        }
      />
    </div>
  );
}
