import type { AmmoStock } from './ammo';
import type { Firearm } from './firearm';

/**
 * The log-rounds form while it is being filled in. It holds the chosen objects
 * (a whole firearm, a whole ammo stock), not their ids; the saved session keeps
 * only the ids (see `NewRoundSession`).
 */
export interface LogRoundsDraft {
  /** Calendar day, YYYY-MM-DD. */
  date: string;
  location: string;
  firearm: Firearm | undefined;
  /** The stock picked in the single-ammo form. */
  ammo: AmmoStock | undefined;
  /** Rounds text for the single-ammo form. */
  rounds: string;
  /** Rounds text per ammo id, for a firearm with several calibers. */
  loadRounds: Record<string, string>;
  notes: string;
}
