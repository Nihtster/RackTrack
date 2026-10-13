import type { NewRoundSession, RoundSession } from '../types';
import { demoAmmo, demoFirearms, demoMaintenance, demoSessions } from './demo';

// The data-access layer. Each function returns a promise, like the real API
// will, so screens already handle loading and saving. When the backend exists,
// change the bodies here (fetch instead of touching demo arrays) and nothing
// else moves. Reads return copies, so a change is visible as a new value.
const respond = <T>(value: T): Promise<T> => Promise.resolve(value);

export const api = {
  firearms: () => respond([...demoFirearms]),
  ammo: () => respond(demoAmmo.map((a) => ({ ...a }))),
  sessions: () => respond([...demoSessions]),
  maintenance: () => respond([...demoMaintenance]),

  /** Records a session and takes each load's rounds out of the ammo it names. */
  logSession(input: NewRoundSession): Promise<RoundSession> {
    const loads = input.loads.filter((l) => l.rounds > 0);
    if (loads.length === 0 || loads.some((l) => !Number.isInteger(l.rounds))) {
      return Promise.reject(new Error('Rounds must be a whole number of at least 1.'));
    }
    const rounds = loads.reduce((n, l) => n + l.rounds, 0);
    const session: RoundSession = { ...input, loads, rounds, id: `s${demoSessions.length + 1}` };
    demoSessions.push(session);

    for (const load of loads) {
      const stock = demoAmmo.find((a) => a.id === load.ammoId);
      if (stock) stock.onHand = Math.max(0, stock.onHand - load.rounds);
    }

    return respond(session);
  },
};
