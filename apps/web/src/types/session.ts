/** Rounds fired from one stock of ammo in a session. */
export interface SessionLoad {
  /** The stock they came out of; unset when the session was logged without ammo. */
  ammoId?: string;
  rounds: number;
}

/** What the log-rounds form submits. */
export interface NewRoundSession {
  /** Calendar day, YYYY-MM-DD. */
  date: string;
  firearmId: string;
  location: string;
  /** One entry per ammo type fired. A mixed session has several. */
  loads: SessionLoad[];
  notes?: string;
}

/** One range session with one firearm. */
export interface RoundSession extends NewRoundSession {
  id: string;
  /** All loads added together. */
  rounds: number;
}
