import type { ButtonHTMLAttributes, ReactNode, Ref } from 'react';
import { cn } from '../utils/cn';
import { Spinner } from '../loading/Spinner';
import {
  controlBase,
  controlDisabled,
  controlFocusRing,
  controlIconSize,
  controlSize,
} from '../theme/control';

export type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'link';
export type ButtonSize = keyof typeof controlSize;

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-accent text-ink hover:bg-accent-bright',
  secondary:
    'bg-surface-raised text-ink border border-border hover:border-accent hover:text-accent-bright',
  danger: 'bg-critical text-app hover:bg-critical/85',
  ghost: 'bg-transparent text-ink-muted hover:bg-surface-raised hover:text-ink',
  // Inline text action ("View All →"): no box, so drop height and padding.
  link: 'h-auto pointer-coarse:h-auto px-0 bg-transparent text-accent-bright hover:text-accent hover:underline',
};

interface ButtonBaseProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Shows a spinner and blocks interaction. Keeps the button's width. */
  loading?: boolean;
  /** Icon rendered before the label. */
  leadingIcon?: ReactNode;
  /** Icon rendered after the label. */
  trailingIcon?: ReactNode;
  children?: ReactNode;
  ref?: Ref<HTMLButtonElement>;
}

export type ButtonProps = ButtonBaseProps &
  (
    | { iconOnly?: false }
    | {
        /** Square button showing only an icon (pass it as `children`). */
        iconOnly: true;
        /** Required: with no visible text, this is the button's accessible name. */
        'aria-label': string;
      }
  );

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  leadingIcon,
  trailingIcon,
  type = 'button',
  className,
  children,
  ref,
  iconOnly = false,
  ...rest
}: ButtonProps) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cn(
        'relative',
        controlBase,
        controlFocusRing,
        controlDisabled,
        iconOnly ? controlIconSize[size] : controlSize[size],
        variantClasses[variant],
        className,
      )}
      {...rest}
    >
      {/* Content stays in flow (invisible while loading) so width doesn't jump. */}
      <span className={cn('inline-flex items-center gap-[inherit]', loading && 'invisible')}>
        {leadingIcon}
        {children}
        {trailingIcon}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center">
          <Spinner />
        </span>
      )}
    </button>
  );
}
