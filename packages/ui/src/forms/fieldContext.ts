import { createContext, useContext } from 'react';

export interface FieldContextValue {
  id: string;
  /** Id of the <label>, for controls whose own text should join the name. */
  labelId: string;
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

// For controls that show a value as text (date pickers): the accessible name
// should be "<label> <value>", not just the label. Returns undefined outside a Field.
export function useFieldLabelId() {
  return useContext(FieldContext)?.labelId;
}
