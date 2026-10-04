export interface Firearm {
  id: string;
  name: string;
  caliber: string;
  createdAt: string;
}

// Demo data — stands in for the API until the backend is built.
export const demoFirearms: Firearm[] = [
  {
    id: '1',
    name: 'Glock 19',
    caliber: '9mm',
    createdAt: '2026-01-15T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Ruger 10/22',
    caliber: '.22 LR',
    createdAt: '2026-03-02T00:00:00.000Z',
  },
  {
    id: '3',
    name: 'Remington 870',
    caliber: '12 Gauge',
    createdAt: '2026-05-20T00:00:00.000Z',
  },
];
