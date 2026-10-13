import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { cn } from '../utils/cn';
import { controlFocusRing } from '../theme/control';
import { intentFill } from '../theme/intent';
import { motionDuration, motionSlide } from '../theme/motion';
import { Button } from '../core/Button';
import { ToastContext, type ToastApi, type ToastOptions } from './toastContext';

interface ToastEntry extends ToastOptions {
  id: string;
}

const DEFAULT_DURATION = 3000;
// A toast with a button (e.g. Undo) needs a moment longer to be noticed and used.
const DEFAULT_ACTION_DURATION = 4000;

// TODO(icon set): swap these inline SVGs for Icon components once #67 lands.
const icons = {
  neutral: 'M12 8v5m0 3h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  success: 'm8 12 3 3 5-6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
  warning: 'M12 9v4m0 3h.01M10.3 4 2.8 17a2 2 0 0 0 1.7 3h15a2 2 0 0 0 1.7-3L13.7 4a2 2 0 0 0-3.4 0Z',
  critical: 'm9 9 6 6m0-6-6 6M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z',
} as const;

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
      <svg
        className="mt-0.5 size-5 shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d={icons[intent]} />
      </svg>
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
          'flex size-6 shrink-0 items-center justify-center rounded-control text-ink-muted transition-colors hover:text-ink',
          controlFocusRing,
        )}
      >
        <svg className="size-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
          <path d="M6 6l12 12M18 6 6 18" />
        </svg>
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
