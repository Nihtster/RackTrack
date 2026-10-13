import { useRef, type ReactNode } from 'react';
import { Button } from '../core/Button';
import { Modal } from './Modal';

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** `danger` for destructive actions like delete. Default `primary`. */
  intent?: 'primary' | 'danger';
  /** Runs when confirmed. The dialog does not close itself: do that (or keep it
   *  open with `loading` while saving) from here. */
  onConfirm: () => void;
  /** Shows a spinner on the confirm button and blocks both buttons. */
  loading?: boolean;
}

// "Are you sure?" built on Modal. Focus starts on Cancel, so pressing Enter by
// reflex never confirms a destructive action.
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  intent = 'primary',
  onConfirm,
  loading,
}: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  return (
    <Modal
      open={open}
      onOpenChange={(next) => !loading && onOpenChange(next)}
      title={title}
      description={description}
      size="sm"
      role={intent === 'danger' ? 'alertdialog' : 'dialog'}
      initialFocus={cancelRef}
      footer={
        <>
          <Button ref={cancelRef} variant="ghost" disabled={loading} onClick={() => onOpenChange(false)}>
            {cancelLabel}
          </Button>
          <Button variant={intent === 'danger' ? 'danger' : 'primary'} loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
        </>
      }
    />
  );
}
