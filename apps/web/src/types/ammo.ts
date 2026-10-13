/** Rounds on hand for one caliber, against the amount you like to keep. */
export interface AmmoStock {
  id: string;
  caliber: string;
  onHand: number;
  /** Stock level that counts as full; the inventory bar is onHand / target. */
  target: number;
}
