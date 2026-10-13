/** One range session with one firearm. */
export interface RoundSession {
  id: string;
  /** Calendar day, YYYY-MM-DD. */
  date: string;
  firearmId: string;
  rounds: number;
  location: string;
}
