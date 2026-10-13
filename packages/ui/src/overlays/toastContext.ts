import { createContext, useContext, type ReactNode } from 'react';
import type { Intent } from '../theme/intent';

export interface ToastOptions {
  title: ReactNode;
  description?: ReactNode;
  /** Colors the toast and picks its icon. Default `neutral`. */
  intent?: Extract<Intent, 'neutral' | 'success' | 'warning' | 'critical'>;
  /** Milliseconds before it dismisses itself; 0 keeps it until dismissed.
   *  Default 3000, or 4000 when the toast has an `action`. */
  duration?: number;
  /** Optional button inside the toast, e.g. "Undo". */
  action?: { label: string; onClick: () => void };
}

export interface ToastApi {
  /** Shows a toast and returns its id. */
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

export const ToastContext = createContext<ToastApi | null>(null);

// Call from any component under <ToastProvider>.
export function useToast(): ToastApi {
  const api = useContext(ToastContext);
  if (!api) throw new Error('useToast must be used inside <ToastProvider>');
  return api;
}
