import { createContext, useContext } from 'react';

export interface FieldContextValue {
  id: string;
  describedBy?: string;
  invalid: boolean;
  required: boolean;
}

export const FieldContext = createContext<FieldContextValue | null>(null);

interface ControlProps {
  id?: string;
  'aria-describedby'?: string;
  invalid?: boolean;
  required?: boolean;
}

// Used by Input, Select and Textarea: inside a Field they pick up the id,
// aria-describedby, aria-invalid and required automatically. Explicit props win.
export function useFieldControl({
  id,
  'aria-describedby': describedByProp,
  invalid,
  required,
}: ControlProps) {
  const field = useContext(FieldContext);
  const describedBy = [field?.describedBy, describedByProp].filter(Boolean).join(' ');
  return {
    id: id ?? field?.id,
    'aria-describedby': describedBy || undefined,
    'aria-invalid': (invalid ?? field?.invalid) || undefined,
    required: required ?? field?.required,
  };
}
