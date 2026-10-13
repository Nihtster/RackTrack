import { demoAmmo, demoFirearms, demoMaintenance, demoSessions } from './demo';

// The data-access layer. Each function returns a promise, like the real API
// will, so screens already handle loading. When the backend exists, change the
// bodies here (fetch instead of returning demo arrays) and nothing else moves.
const respond = <T>(value: T): Promise<T> => Promise.resolve(value);

export const api = {
  firearms: () => respond(demoFirearms),
  ammo: () => respond(demoAmmo),
  sessions: () => respond(demoSessions),
  maintenance: () => respond(demoMaintenance),
};
