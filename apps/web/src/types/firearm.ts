export type FirearmType = 'pistol' | 'rifle' | 'smg' | 'shotgun' | 'sniper';

export interface Firearm {
  id: string;
  name: string;
  caliber: string;
  type: FirearmType;
  createdAt: string;
}
