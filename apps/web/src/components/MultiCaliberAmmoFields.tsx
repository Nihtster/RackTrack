import { Field, Input } from '@racktrack/ui';
import type { AmmoStock } from '../types';

const number = new Intl.NumberFormat('en-US');

interface MultiCaliberAmmoFieldsProps {
  /** Every stock the firearm can fire, across its calibers. */
  options: AmmoStock[];
  /** Rounds typed per stock id; empty means not used. */
  values: Record<string, string>;
  onChange: (ammoId: string, rounds: string) => void;
  /** Error message per stock id. */
  errors: Record<string, string>;
  /** Sum of the valid entries, for the running total. */
  total: number;
}

// A firearm that takes more than one caliber (a 5.56 rifle also fires .223) can
// use several in one session, so it gets a rounds field per ammo type instead of
// a single pick. Leave a type blank to say it was not used.
export function MultiCaliberAmmoFields({
  options,
  values,
  onChange,
  errors,
  total,
}: MultiCaliberAmmoFieldsProps) {
  return (
    <fieldset className="sm:col-span-2">
      <legend className="mb-1 text-sm font-medium text-ink">
        Rounds fired by ammo <span className="text-critical" aria-hidden="true">*</span>
      </legend>
      <p className="mb-3 text-xs text-ink-muted">
        This firearm takes more than one caliber. Enter rounds for each type you fired, and leave
        the rest blank.
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((stock) => (
          <Field
            key={stock.id}
            label={stock.caliber}
            hint={`${number.format(stock.onHand)} rds in stock`}
            error={errors[stock.id]}
          >
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              placeholder="0"
              value={values[stock.id] ?? ''}
              onChange={(e) => onChange(stock.id, e.target.value)}
            />
          </Field>
        ))}
      </div>

      <p className="mt-3 text-sm text-ink-muted" aria-live="polite">
        Total: <span className="font-semibold text-ink tabular-nums">{number.format(total)}</span> rounds
      </p>
    </fieldset>
  );
}
