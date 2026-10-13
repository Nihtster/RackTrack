import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { controlFocusRing } from '../theme/control';
import { intentFill } from '../theme/intent';
import { motionDuration, motionSlide } from '../theme/motion';
import { Button } from '../core/Button';
import { Icon, StatusIcon, X } from '../icons';
import { ToastContext, type ToastApi, type ToastOptions } from './toastContext';

interface ToastEntry extends ToastOptions {
  id: string;
}

const DEFAULT_DURATION = 3000;
// A toast with a button (e.g. Undo) needs a moment longer to be noticed and used.
const DEFAULT_ACTION_DURATION = 4000;

function ToastItem({
  toast,
  onDismissed,
}: {
  toast: ToastEntry;
  onDismissed: (id: string) => void;
}) {
  const { id, title, description, action, intent = 'neutral' } = toast;
  const duration = toast.duration ?? (action ? DEFAULT_ACTION_DURATION : DEFAULT_DURATION);
  const [status, setStatus] = useState<'initial' | 'open' | 'close'>('initial');
  const [paused, setPaused] = useState(false);
  const closing = useRef(false);

  const close = useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setStatus('close');
    window.setTimeout(() => onDismissed(id), motionDuration);
  }, [id, onDismissed]);

  // Enter shortly after mount so the initial state paints first. A timeout, not
  // requestAnimationFrame: rAF never fires in a hidden tab, which would leave the
  // toast invisible.
  useEffect(() => {
    const timer = window.setTimeout(() => setStatus('open'), 20);
    return () => window.clearTimeout(timer);
  }, []);

  // Auto-dismiss, paused while the pointer or focus is on the toast.
  useEffect(() => {
    if (!duration || paused) return;
    const timer = window.setTimeout(close, duration);
    return () => window.clearTimeout(timer);
  }, [duration, paused, close]);

  return (
    <div
      role={intent === 'critical' ? 'alert' : 'status'}
      data-status={status}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className={cn(
        'pointer-events-auto relative flex w-full gap-3 overflow-hidden rounded-card border border-border bg-surface-raised py-3 pr-3 pl-4 text-ink shadow-lg',
        motionSlide,
      )}
    >
      <span className={cn('absolute inset-y-0 left-0 w-1', intentFill[intent])} aria-hidden="true" />
      <StatusIcon intent={intent} size="md" className="mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium">{title}</div>
        {description && <div className="mt-0.5 text-sm text-ink-muted">{description}</div>}
        {action && (
          <Button
            variant="link"
            size="sm"
            className="mt-1"
            onClick={() => {
              action.onClick();
              close();
            }}
          >
            {action.label}
          </Button>
        )}
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={close}
        className={cn(
          // Grows to a 44px target on touch; the negative margin keeps the toast's layout.
          'flex size-6 shrink-0 items-center justify-center rounded-control text-ink-muted transition-colors hover:text-ink pointer-coarse:-m-2.5 pointer-coarse:size-11',
          controlFocusRing,
        )}
      >
        <Icon icon={X} size="xs" strokeWidth={2.5} />
      </button>
    </div>
  );
}

export interface ToastProviderProps {
  children: ReactNode;
  /** Most toasts shown at once; older ones are dropped. Default 4. */
  max?: number;
}

// Mount once near the app root, then call `useToast().toast({...})` anywhere.
export function ToastProvider({ children, max = 4 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastEntry[]>([]);
  const counter = useRef(0);

  const remove = useCallback((id: string) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const api = useMemo<ToastApi>(
    () => ({
      toast(options) {
        const id = `toast-${++counter.current}`;
        setToasts((current) => [...current, { ...options, id }].slice(-max));
        return id;
      },
      // Dropping the entry unmounts it without the exit animation; the item's
      // own close button animates. Programmatic dismiss favors being immediate.
      dismiss: remove,
    }),
    [max, remove],
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* Fixed viewport region; the wrapper ignores the pointer so only the
          toasts themselves are clickable. */}
      <div
        role="region"
        aria-label="Notifications"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-[60] flex flex-col items-end gap-2 sm:left-auto sm:w-96"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismissed={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}
