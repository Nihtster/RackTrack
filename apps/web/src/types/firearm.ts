export type FirearmType = 'pistol' | 'rifle' | 'smg' | 'shotgun' | 'sniper';

export interface Firearm {
  id: string;
  name: string;
  /** The caliber it is chambered in, and the one shown on lists. */
  caliber: string;
  /** Other calibers it can safely fire, e.g. a 5.56x45mm rifle also takes .223 Rem. */
  alsoFires?: string[];
  type: FirearmType;
  createdAt: string;
}

/** Every caliber a firearm can fire, its own first. */
export function firearmCalibers(firearm: Firearm): string[] {
  return [firearm.caliber, ...(firearm.alsoFires ?? [])];
}
