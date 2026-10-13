import type { AmmoStock, Firearm, LogRoundsDraft, SessionLoad } from '../types';
import { firearmCalibers } from '../types';

// The rules of the log-rounds form, kept out of the component so they can be
// read and tested without rendering anything. The form's values are one
// `LogRoundsDraft`; the reducer changes it, `validateLogRounds` checks it.

export const LOG_LOCATIONS = ['Indoor Range', 'Outdoor Range', 'Skeet Club', 'Private Land'];

const number = new Intl.NumberFormat('en-US');

// ---- ammo -----------------------------------------------------------------

/** Stock in any caliber the firearm can fire, not only the one it is chambered in. */
export function ammoFor(firearm: Firearm | undefined, ammo: AmmoStock[]): AmmoStock[] {
  if (!firearm) return [];
  const calibers = firearmCalibers(firearm);
  return ammo.filter((a) => calibers.includes(a.caliber));
}

/** Several stocks to choose between means one session can mix them. */
export function isMixed(options: AmmoStock[]): boolean {
  return options.length > 1;
}

/** A rounds field's text as a number: blank is 0, anything else is parsed as typed. */
function parseRounds(text: string): number {
  return text.trim() === '' ? 0 : Number(text);
}

/** Sum of the valid, positive entries in a mixed session's per-ammo fields. */
export function totalRounds(options: AmmoStock[], loadRounds: Record<string, string>): number {
  return options.reduce((sum, o) => {
    const rounds = parseRounds(loadRounds[o.id] ?? '');
    return sum + (Number.isInteger(rounds) && rounds > 0 ? rounds : 0);
  }, 0);
}

// ---- the draft ------------------------------------------------------------

/** A blank form for `today`, on the first firearm and its first ammo. */
export function initialLogRounds(today: string, firearms: Firearm[], ammo: AmmoStock[]): LogRoundsDraft {
  const firearm = firearms[0];
  return {
    date: today,
    location: LOG_LOCATIONS[0],
    firearm,
    ammo: ammoFor(firearm, ammo)[0],
    rounds: '',
    loadRounds: {},
    notes: '',
  };
}

export type LogRoundsAction =
  /** A plain text field changed. */
  | { type: 'field'; field: 'date' | 'location' | 'rounds' | 'notes'; value: string }
  /** The firearm changed: its ammo and any mixed-session entries no longer apply. */
  | { type: 'firearm'; firearm: Firearm | undefined; ammo: AmmoStock[] }
  /** The single-ammo form's stock pick changed. */
  | { type: 'ammo'; ammo: AmmoStock | undefined }
  /** One ammo's rounds changed in the mixed form. */
  | { type: 'load'; ammoId: string; value: string };

export function logRoundsReducer(draft: LogRoundsDraft, action: LogRoundsAction): LogRoundsDraft {
  switch (action.type) {
    case 'field':
      return { ...draft, [action.field]: action.value };
    case 'firearm':
      return {
        ...draft,
        firearm: action.firearm,
        ammo: ammoFor(action.firearm, action.ammo)[0],
        loadRounds: {},
      };
    case 'ammo':
      return { ...draft, ammo: action.ammo };
    case 'load':
      return { ...draft, loadRounds: { ...draft.loadRounds, [action.ammoId]: action.value } };
  }
}

// ---- validation -----------------------------------------------------------

export type LogRoundsErrors = Partial<Record<'date' | 'firearm' | 'rounds' | 'submit', string>> & {
  /** Messages per stock id, for a mixed session. */
  loads?: Record<string, string>;
};

export type LogRoundsResult =
  | { ok: true; loads: SessionLoad[] }
  | { ok: false; errors: LogRoundsErrors };

/**
 * Checks a draft against today's date and the ammo on hand; on success returns
 * the loads to save. The ammo options come from the draft's firearm.
 */
export function validateLogRounds(
  draft: LogRoundsDraft,
  context: { today: string; ammo: AmmoStock[] },
): LogRoundsResult {
  const { date, firearm, rounds, loadRounds } = draft;
  const options = ammoFor(firearm, context.ammo);
  const errors: LogRoundsErrors = {};
  let loads: SessionLoad[] = [];

  if (!date) errors.date = 'Pick a date.';
  else if (date > context.today) errors.date = 'A session cannot be in the future.';
  if (!firearm) errors.firearm = 'Choose a firearm.';

  if (isMixed(options)) {
    const perAmmo: Record<string, string> = {};
    for (const option of options) {
      const count = parseRounds(loadRounds[option.id] ?? '');
      if (!Number.isInteger(count) || count < 0) perAmmo[option.id] = 'Whole rounds, 0 or more.';
      else if (count > option.onHand) perAmmo[option.id] = `Only ${number.format(option.onHand)} rds in stock.`;
      else if (count > 0) loads.push({ ammoId: option.id, rounds: count });
    }
    if (Object.keys(perAmmo).length > 0) errors.loads = perAmmo;
    else if (loads.length === 0) errors.rounds = 'Enter rounds for at least one ammo type.';
  } else {
    const stock = options.find((o) => o.id === draft.ammo?.id);
    const count = Number(rounds);
    if (!Number.isInteger(count) || count < 1) {
      errors.rounds = 'Enter a whole number of rounds, at least 1.';
    } else if (stock && count > stock.onHand) {
      errors.rounds = `Only ${number.format(stock.onHand)} rds of ${stock.caliber} in stock.`;
    } else {
      loads = [{ ammoId: stock?.id, rounds: count }];
    }
  }

  return Object.keys(errors).length > 0 ? { ok: false, errors } : { ok: true, loads };
}
