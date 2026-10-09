import type { Ref, TextareaHTMLAttributes } from 'react';
import { cn } from '../utils/cn';
import {
  controlDisabled,
  controlField,
  controlFieldText,
  controlFocusRing,
  controlSize,
} from '../theme/control';
import { useFieldControl } from './fieldContext';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  size?: keyof typeof controlSize;
  invalid?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
}

export function Textarea({
  size = 'md',
  invalid,
  rows = 3,
  className,
  ref,
  ...rest
}: TextareaProps) {
  const control = useFieldControl({
    id: rest.id,
    'aria-describedby': rest['aria-describedby'],
    invalid,
    required: rest.required,
  });

  return (
    <textarea
      ref={ref}
      rows={rows}
      {...rest}
      {...control}
      className={cn(
        controlField,
        controlFieldText[size],
        controlFocusRing,
        controlDisabled,
        'min-h-20 resize-y py-2',
        className,
      )}
    />
  );
}
