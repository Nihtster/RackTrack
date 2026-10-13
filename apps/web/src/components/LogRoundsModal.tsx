import { useId, useMemo, useReducer, useState, type FormEvent } from 'react';
import { Button, DatePicker, Field, Input, Modal, Select, Textarea } from '@racktrack/ui';
import { api } from '../data/api';
import { toDay } from '../lib/day';
import {
  ammoFor,
  initialLogRounds,
  isMixed,
  LOG_LOCATIONS,
  logRoundsReducer,
  totalRounds,
  validateLogRounds,
  type LogRoundsErrors,
} from '../lib/logRounds';
import { firearmCalibers, type AmmoStock, type Firearm, type RoundSession } from '../types';
import { MultiCaliberAmmoFields } from './MultiCaliberAmmoFields';

const number = new Intl.NumberFormat('en-US');

interface LogRoundsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  firearms: Firearm[];
  ammo: AmmoStock[];
  /** Called with the saved session, after the modal has closed itself. */
  onLogged: (session: RoundSession, firearm: Firearm) => void;
}

// The form lives in its own component so it mounts fresh each time the modal
// opens (Modal unmounts its content when closed): no stale values or errors.
function LogRoundsForm({
  formId,
  firearms,
  ammo,
  onSaved,
  onSaving,
}: {
  formId: string;
  firearms: Firearm[];
  ammo: AmmoStock[];
  onSaved: (session: RoundSession, firearm: Firearm) => void;
  onSaving: (saving: boolean) => void;
}) {
  // Fixed for the life of the form, so "today" cannot change under an edit.
  const [today] = useState(() => toDay(new Date()));
  const [logRounds, dispatch] = useReducer(logRoundsReducer, undefined, () =>
    initialLogRounds(today, firearms, ammo),
  );
  const [errors, setErrors] = useState<LogRoundsErrors>({});

  const { firearm } = logRounds;
  const options = useMemo(() => ammoFor(firearm, ammo), [ammo, firearm]);
  const mixed = isMixed(options);

  async function submit(event: FormEvent) {
    event.preventDefault();
    const result = validateLogRounds(logRounds, { today, ammo });
    if (!result.ok || !firearm) {
      setErrors(result.ok ? {} : result.errors);
      return;
    }
    setErrors({});

    onSaving(true);
    try {
      const session = await api.logSession({
        date: logRounds.date,
        firearmId: firearm.id,
        location: logRounds.location,
        loads: result.loads,
        notes: logRounds.notes.trim() || undefined,
      });
      onSaved(session, firearm);
    } catch (error) {
      setErrors({ submit: error instanceof Error ? error.message : 'Could not save the session.' });
      onSaving(false);
    }
  }

  return (
    <form id={formId} onSubmit={submit} noValidate className="grid gap-4 sm:grid-cols-2">
      <Field label="Date" error={errors.date} required>
        <DatePicker
          value={logRounds.date}
          onValueChange={(value) => dispatch({ type: 'field', field: 'date', value })}
          max={today}
        />
      </Field>

      <Field label="Location">
        <Select
          value={logRounds.location}
          onChange={(e) => dispatch({ type: 'field', field: 'location', value: e.target.value })}
        >
          {LOG_LOCATIONS.map((l) => (
            <option key={l}>{l}</option>
          ))}
        </Select>
      </Field>

      <Field label="Firearm" error={errors.firearm} required className="sm:col-span-2">
        <Select
          value={firearm?.id ?? ''}
          onChange={(e) =>
            dispatch({
              type: 'firearm',
              firearm: firearms.find((f) => f.id === e.target.value),
              ammo,
            })
          }
        >
          {firearms.map((f) => (
            <option key={f.id} value={f.id}>
              {f.name} · {firearmCalibers(f).join(' / ')}
            </option>
          ))}
        </Select>
      </Field>

      {mixed ? (
        <>
          <MultiCaliberAmmoFields
            options={options}
            values={logRounds.loadRounds}
            onChange={(ammoId, value) => dispatch({ type: 'load', ammoId, value })}
            errors={errors.loads ?? {}}
            total={totalRounds(options, logRounds.loadRounds)}
          />
          {errors.rounds && (
            <p role="alert" className="text-xs text-critical sm:col-span-2">
              {errors.rounds}
            </p>
          )}
        </>
      ) : (
        <>
          <Field
            label="Ammo"
            hint={
              options.length === 0
                ? `No ${firearm?.caliber ?? ''} ammo in inventory. Rounds are logged without it.`
                : undefined
            }
            className="sm:col-span-2"
          >
            <Select
              value={logRounds.ammo?.id ?? ''}
              disabled={options.length === 0}
              onChange={(e) =>
                dispatch({ type: 'ammo', ammo: options.find((a) => a.id === e.target.value) })
              }
            >
              {options.length === 0 && <option value="">None available</option>}
              {options.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.caliber} · {number.format(a.onHand)} rds in stock
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Rounds fired" error={errors.rounds} required className="sm:col-span-2">
            <Input
              type="number"
              inputMode="numeric"
              min={1}
              step={1}
              placeholder="50"
              value={logRounds.rounds}
              onChange={(e) => dispatch({ type: 'field', field: 'rounds', value: e.target.value })}
            />
          </Field>
        </>
      )}

      <Field label="Notes" className="sm:col-span-2">
        <Textarea
          rows={2}
          placeholder="Optional notes..."
          value={logRounds.notes}
          onChange={(e) => dispatch({ type: 'field', field: 'notes', value: e.target.value })}
        />
      </Field>

      {errors.submit && (
        <p role="alert" className="text-sm text-critical sm:col-span-2">
          {errors.submit}
        </p>
      )}
    </form>
  );
}

export function LogRoundsModal({ open, onOpenChange, firearms, ammo, onLogged }: LogRoundsModalProps) {
  const formId = useId();
  const [saving, setSaving] = useState(false);

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="Log Rounds"
      description="Record a range session and update ammo stock."
      footer={
        <>
          <Button variant="secondary" onClick={() => onOpenChange(false)} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" form={formId} loading={saving}>
            Log Rounds
          </Button>
        </>
      }
    >
      <LogRoundsForm
        formId={formId}
        firearms={firearms}
        ammo={ammo}
        onSaving={setSaving}
        onSaved={(session, firearm) => {
          setSaving(false);
          onOpenChange(false);
          onLogged(session, firearm);
        }}
      />
    </Modal>
  );
}
