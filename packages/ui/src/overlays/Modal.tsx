import { useId, type ReactNode, type RefObject } from 'react';
import {
  FloatingFocusManager,
  FloatingOverlay,
  FloatingPortal,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
  useTransitionStatus,
} from '@floating-ui/react';
import { cn } from '../utils/cn';
import { controlFocusRing } from '../theme/control';
import { motionDuration, motionFade, motionPop } from '../theme/motion';
import { Card, CardBody, CardFooter, CardHeader } from '../layout/Card';
import { Icon, X } from '../icons';

export type ModalSize = 'sm' | 'md' | 'lg';

const widths: Record<ModalSize, string> = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-xl',
};

export interface ModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  /** Short explanation under the title; also the dialog's accessible description. */
  description?: ReactNode;
  children?: ReactNode;
  /** Buttons row, usually a cancel and a primary action. */
  footer?: ReactNode;
  size?: ModalSize;
  /** `alertdialog` for destructive confirmations, so screen readers announce it. */
  role?: 'dialog' | 'alertdialog';
  /** Clicking the backdrop closes it. Default true. Escape always closes. */
  closeOnOverlayClick?: boolean;
  /** Element to focus on open. Defaults to the first focusable one. */
  initialFocus?: RefObject<HTMLElement | null>;
  className?: string;
}

// Accessible dialog: focus is trapped and restored, Escape closes, the page
// behind stops scrolling, and the title and description are announced.
export function Modal({
  open,
  onOpenChange,
  title,
  description,
  children,
  footer,
  size = 'md',
  role = 'dialog',
  closeOnOverlayClick = true,
  initialFocus,
  className,
}: ModalProps) {
  const titleId = useId();
  const descriptionId = useId();

  const { refs, context } = useFloating({ open, onOpenChange });
  const { getFloatingProps } = useInteractions([
    useDismiss(context, { outsidePress: closeOnOverlayClick, outsidePressEvent: 'mousedown' }),
    useRole(context, { role }),
  ]);
  const { isMounted, status } = useTransitionStatus(context, { duration: motionDuration });

  if (!isMounted) return null;

  return (
    <FloatingPortal>
      <FloatingOverlay
        lockScroll
        data-status={status}
        className={cn('z-50 grid place-items-center bg-app/70 p-4 backdrop-blur-sm', motionFade)}
      >
        <FloatingFocusManager context={context} initialFocus={initialFocus}>
          <div
            // Floating UI's ref setter, not a ref object read during render.
            // oxlint-disable-next-line react/refs
            ref={refs.setFloating}
            aria-labelledby={titleId}
            aria-describedby={description ? descriptionId : undefined}
            {...getFloatingProps()}
            data-status={status}
            className={cn('w-full', widths[size], motionPop, className)}
          >
            <Card size="lg" className="shadow-2xl">
              <CardHeader>
                <div className="min-w-0">
                  <h2 id={titleId} className="text-base font-semibold text-ink">
                    {title}
                  </h2>
                  {description && (
                    <p id={descriptionId} className="mt-0.5 text-sm text-ink-muted">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  aria-label="Close"
                  onClick={() => onOpenChange(false)}
                  className={cn(
                    'ml-auto flex size-8 shrink-0 items-center justify-center rounded-control text-ink-muted transition-colors hover:bg-surface-raised hover:text-ink',
                    controlFocusRing,
                  )}
                >
                  <Icon icon={X} strokeWidth={2.5} />
                </button>
              </CardHeader>
              {children && (
                <CardBody className="max-h-[calc(100dvh-14rem)] overflow-y-auto text-sm text-ink">
                  {children}
                </CardBody>
              )}
              {footer && <CardFooter>{footer}</CardFooter>}
            </Card>
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
}
