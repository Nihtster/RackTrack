import {
  cloneElement,
  useState,
  type ReactElement,
  type ReactNode,
  type Ref,
} from 'react';
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
  type Placement,
} from '@floating-ui/react';
import { cn } from '../utils/cn';

export interface TooltipProps {
  /** Tooltip content. Keep it short; it is a hint, not the accessible name. */
  content: ReactNode;
  /** Single element that can hold a ref and receive hover/focus handlers. */
  children: ReactElement<{ ref?: Ref<HTMLElement> }>;
  placement?: Placement;
  /** Hover delay in ms before showing. Focus shows immediately. */
  delay?: number;
  className?: string;
}

export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 400,
  className,
}: TooltipProps) {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [offset(6), flip(), shift({ padding: 8 })],
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    // mouseOnly: touch devices never show it (no hover; avoids sticky tooltips).
    useHover(context, { move: false, delay: { open: delay, close: 0 }, mouseOnly: true }),
    useFocus(context),
    useDismiss(context),
    useRole(context, { role: 'tooltip' }),
  ]);

  const ref = useMergeRefs([refs.setReference, children.props.ref]);

  return (
    <>
      {cloneElement(children, getReferenceProps({ ref }))}
      {open && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className={cn(
              'z-50 max-w-xs rounded-control border border-border bg-surface-raised px-2.5 py-1.5 text-xs text-ink shadow-lg',
              className,
            )}
          >
            {content}
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
