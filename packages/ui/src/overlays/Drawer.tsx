import type { ReactNode } from 'react';
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
import { motionDrawer, motionDuration, motionFade } from '../theme/motion';

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Accessible name, announced when the drawer opens (e.g. "Navigation"). */
  label: string;
  children: ReactNode;
  /** Classes for the panel itself. Default width is 18rem, at most 85% of the screen. */
  className?: string;
}

// A panel that slides in from the left over a dimmed page. Focus is trapped
// inside and returned to whatever opened it, the page behind stops scrolling,
// and Escape or a tap outside closes it. It has no header or close button of
// its own: what goes inside is up to the caller.
export function Drawer({ open, onOpenChange, label, children, className }: DrawerProps) {
  const { refs, context } = useFloating({ open, onOpenChange });
  const { getFloatingProps } = useInteractions([
    useDismiss(context, { outsidePressEvent: 'mousedown' }),
    useRole(context, { role: 'dialog' }),
  ]);
  const { isMounted, status } = useTransitionStatus(context, { duration: motionDuration });

  if (!isMounted) return null;

  return (
    <FloatingPortal>
      <FloatingOverlay
        lockScroll
        data-status={status}
        className={cn('z-50 bg-app/70 backdrop-blur-sm', motionFade)}
      >
        {/* initialFocus -1: keep focus on the panel, not the first link, so
            opening doesn't scroll or highlight anything. */}
        <FloatingFocusManager context={context} initialFocus={-1}>
          <div
            // Floating UI's ref setter, not a ref object read during render.
            // oxlint-disable-next-line react/refs
            ref={refs.setFloating}
            aria-label={label}
            {...getFloatingProps()}
            data-status={status}
            className={cn('h-full w-72 max-w-[85vw] shadow-2xl', motionDrawer, className)}
          >
            {children}
          </div>
        </FloatingFocusManager>
      </FloatingOverlay>
    </FloatingPortal>
  );
}
