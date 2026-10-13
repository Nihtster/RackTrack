import { describe, expect, it } from 'vitest';
import type { AmmoStock, Firearm, LogRoundsDraft } from '../types';
import {
  ammoFor,
  initialLogRounds,
  isMixed,
  LOG_LOCATIONS,
  logRoundsReducer,
  totalRounds,
  validateLogRounds,
} from './logRounds';

const today = '2026-10-13';

const glock: Firearm = { id: 'g', name: 'Glock', caliber: '9mm', type: 'pistol', createdAt: today };
const ar: Firearm = {
  id: 'ar',
  name: 'AR',
  caliber: '5.56',
  alsoFires: ['.223'],
  type: 'rifle',
  createdAt: today,
};

const nine: AmmoStock = { id: 'n', caliber: '9mm', onHand: 100, target: 500 };
const fiveFiveSix: AmmoStock = { id: 'a', caliber: '5.56', onHand: 200, target: 500 };
const twoTwoThree: AmmoStock = { id: 'b', caliber: '.223', onHand: 50, target: 500 };
const stock = [nine, fiveFiveSix, twoTwoThree];

/** A valid single-ammo draft on the Glock; override what a test cares about. */
function draft(overrides: Partial<LogRoundsDraft> = {}): LogRoundsDraft {
  return {
    date: today,
    location: 'Indoor Range',
    firearm: glock,
    ammo: nine,
    rounds: '25',
    loadRounds: {},
    notes: '',
    ...overrides,
  };
}

const check = (d: LogRoundsDraft) => validateLogRounds(d, { today, ammo: stock });

describe('ammoFor', () => {
  it('offers stock in every caliber the firearm can fire', () => {
    expect(ammoFor(glock, stock)).toEqual([nine]);
    expect(ammoFor(ar, stock)).toEqual([fiveFiveSix, twoTwoThree]);
  });

  it('offers nothing without a firearm', () => {
    expect(ammoFor(undefined, stock)).toEqual([]);
  });
});

describe('isMixed', () => {
  it('is true only when there is more than one stock to choose between', () => {
    expect(isMixed([])).toBe(false);
    expect(isMixed([nine])).toBe(false);
    expect(isMixed([fiveFiveSix, twoTwoThree])).toBe(true);
  });
});

describe('totalRounds', () => {
  const options = [fiveFiveSix, twoTwoThree];

  it('adds the valid entries and treats blanks as zero', () => {
    expect(totalRounds(options, { a: '60', b: '30' })).toBe(90);
    expect(totalRounds(options, { a: '60' })).toBe(60);
    expect(totalRounds(options, {})).toBe(0);
  });

  it('ignores entries that are not whole, positive numbers', () => {
    expect(totalRounds(options, { a: '2.5', b: '-4' })).toBe(0);
    expect(totalRounds(options, { a: 'abc', b: '10' })).toBe(10);
  });
});

describe('initialLogRounds', () => {
  it('starts on today, the first firearm and its first ammo', () => {
    expect(initialLogRounds(today, [ar, glock], stock)).toEqual({
      date: today,
      location: LOG_LOCATIONS[0],
      firearm: ar,
      ammo: fiveFiveSix,
      rounds: '',
      loadRounds: {},
      notes: '',
    });
  });

  it('copes with no firearms', () => {
    const empty = initialLogRounds(today, [], stock);
    expect(empty.firearm).toBeUndefined();
    expect(empty.ammo).toBeUndefined();
  });
});

describe('logRoundsReducer', () => {
  it('sets a text field and leaves the rest alone', () => {
    const before = draft();
    const after = logRoundsReducer(before, { type: 'field', field: 'location', value: 'Skeet Club' });
    expect(after).toEqual({ ...before, location: 'Skeet Club' });
    expect(after).not.toBe(before);
  });

  it('moves to the new firearm, its first ammo, and clears mixed entries', () => {
    const before = draft({ loadRounds: { n: '5' }, rounds: '40' });
    const after = logRoundsReducer(before, { type: 'firearm', firearm: ar, ammo: stock });
    expect(after.firearm).toBe(ar);
    expect(after.ammo).toBe(fiveFiveSix);
    expect(after.loadRounds).toEqual({});
    // What the user typed for rounds is theirs to keep.
    expect(after.rounds).toBe('40');
  });

  it('leaves no ammo when the new firearm has none in stock', () => {
    const after = logRoundsReducer(draft(), { type: 'firearm', firearm: ar, ammo: [nine] });
    expect(after.ammo).toBeUndefined();
  });

  it('picks an ammo stock', () => {
    const before = draft({ firearm: ar, ammo: fiveFiveSix });
    expect(logRoundsReducer(before, { type: 'ammo', ammo: twoTwoThree }).ammo).toBe(twoTwoThree);
  });

  it('sets one ammo\'s rounds without touching the others', () => {
    const start = draft({ firearm: ar, loadRounds: { a: '60' } });
    const after = logRoundsReducer(start, { type: 'load', ammoId: 'b', value: '30' });
    expect(after.loadRounds).toEqual({ a: '60', b: '30' });
    expect(start.loadRounds).toEqual({ a: '60' });
  });
});

describe('validateLogRounds: one ammo', () => {
  it('returns the single load', () => {
    expect(check(draft())).toEqual({ ok: true, loads: [{ ammoId: 'n', rounds: 25 }] });
  });

  it('logs without an ammo id when the firearm has no stock', () => {
    const noStock = { ...glock, id: 'x', caliber: '.45', name: 'Colt' };
    expect(check(draft({ firearm: noStock, ammo: undefined, rounds: '10' }))).toEqual({
      ok: true,
      loads: [{ ammoId: undefined, rounds: 10 }],
    });
  });

  it('rejects empty, zero, negative and fractional rounds', () => {
    for (const rounds of ['', '0', '-3', '2.5']) {
      const result = check(draft({ rounds }));
      expect(result.ok).toBe(false);
      if (!result.ok) expect(result.errors.rounds).toMatch(/whole number/);
    }
  });

  it('rejects more rounds than are in stock', () => {
    expect(check(draft({ rounds: '101' }))).toEqual({
      ok: false,
      errors: { rounds: 'Only 100 rds of 9mm in stock.' },
    });
  });
});

describe('validateLogRounds: mixed ammo', () => {
  const mixed = (loadRounds: Record<string, string>) =>
    check(draft({ firearm: ar, ammo: fiveFiveSix, loadRounds }));

  it('returns one load per ammo that was used', () => {
    expect(mixed({ a: '60', b: '30' })).toEqual({
      ok: true,
      loads: [
        { ammoId: 'a', rounds: 60 },
        { ammoId: 'b', rounds: 30 },
      ],
    });
  });

  it('skips blank and zero entries', () => {
    expect(mixed({ a: '', b: '30' })).toEqual({ ok: true, loads: [{ ammoId: 'b', rounds: 30 }] });
  });

  it('needs at least one ammo type to have rounds', () => {
    expect(mixed({})).toEqual({
      ok: false,
      errors: { rounds: 'Enter rounds for at least one ammo type.' },
    });
  });

  it('reports a problem on the field it belongs to', () => {
    expect(mixed({ a: '60', b: '51' })).toEqual({
      ok: false,
      errors: { loads: { b: 'Only 50 rds in stock.' } },
    });
    expect(mixed({ a: '1.5' })).toEqual({
      ok: false,
      errors: { loads: { a: 'Whole rounds, 0 or more.' } },
    });
  });
});

describe('validateLogRounds: the rest of the form', () => {
  it('rejects a missing or future date', () => {
    const missing = check(draft({ date: '' }));
    const future = check(draft({ date: '2026-10-14' }));
    expect(missing.ok === false && missing.errors.date).toBe('Pick a date.');
    expect(future.ok === false && future.errors.date).toBe('A session cannot be in the future.');
  });

  it('allows today', () => {
    expect(check(draft({ date: today })).ok).toBe(true);
  });

  it('needs a firearm', () => {
    const result = check(draft({ firearm: undefined, ammo: undefined }));
    expect(result.ok === false && result.errors.firearm).toBe('Choose a firearm.');
  });

  it('reports every problem at once', () => {
    const result = check(draft({ date: '', firearm: undefined, ammo: undefined, rounds: '' }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(Object.keys(result.errors).sort()).toEqual(['date', 'firearm', 'rounds']);
  });
});
