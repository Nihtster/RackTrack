import type { AmmoStock } from '../../types/ammo';
import type { Firearm } from '../../types/firearm';
import type { MaintenanceTask } from '../../types/maintenance';
import type { RoundSession } from '../../types/session';
import { addDays, toDay } from '../../lib/day';

// Demo data: stands in for the API until the backend is built. Dates are
// written as "days before/after today" so the dashboard always has a recent
// month of activity and sensible due dates, whenever it is opened.
const today = toDay(new Date());
const ago = (days: number) => addDays(today, -days);
const ahead = (days: number) => addDays(today, days);

export const demoFirearms: Firearm[] = [
  { id: '1', name: 'Glock 19 Gen5', caliber: '9mm', type: 'pistol', createdAt: ago(210) },
  { id: '2', name: 'Ruger 10/22', caliber: '.22 LR', type: 'rifle', createdAt: ago(160) },
  { id: '3', name: 'Remington 870', caliber: '12 Gauge', type: 'shotgun', createdAt: ago(95) },
  { id: '4', name: 'Ruger AR-556', caliber: '5.56x45mm', type: 'rifle', createdAt: ago(60) },
  { id: '5', name: 'Sig Sauer P365', caliber: '9mm', type: 'pistol', createdAt: ago(21) },
  { id: '6', name: 'Savage 110', caliber: '.308 Win', type: 'sniper', createdAt: ago(6) },
];

export const demoAmmo: AmmoStock[] = [
  { id: 'a1', caliber: '9mm', onHand: 1240, target: 2000 },
  { id: 'a2', caliber: '.22 LR', onHand: 2850, target: 3000 },
  { id: 'a3', caliber: '5.56x45mm', onHand: 420, target: 1500 },
  { id: 'a4', caliber: '12 Gauge', onHand: 90, target: 500 },
  { id: 'a5', caliber: '.308 Win', onHand: 160, target: 400 },
];

// [days ago, firearm id, rounds, location]
const sessionRows: [number, string, number, string][] = [
  [0, '1', 100, 'Indoor Range'],
  [1, '4', 60, 'Outdoor Range'],
  [3, '2', 200, 'Outdoor Range'],
  [4, '5', 50, 'Indoor Range'],
  [6, '1', 120, 'Indoor Range'],
  [8, '3', 25, 'Skeet Club'],
  [9, '2', 150, 'Outdoor Range'],
  [11, '4', 90, 'Outdoor Range'],
  [12, '6', 20, 'Outdoor Range'],
  [14, '1', 80, 'Indoor Range'],
  [15, '5', 45, 'Indoor Range'],
  [17, '2', 250, 'Outdoor Range'],
  [18, '4', 120, 'Outdoor Range'],
  [20, '3', 30, 'Skeet Club'],
  [21, '1', 140, 'Indoor Range'],
  [23, '6', 25, 'Outdoor Range'],
  [24, '2', 180, 'Outdoor Range'],
  [26, '5', 60, 'Indoor Range'],
  [27, '4', 100, 'Outdoor Range'],
  [29, '1', 110, 'Indoor Range'],
  [34, '2', 220, 'Outdoor Range'],
  [41, '1', 130, 'Indoor Range'],
  [52, '3', 40, 'Skeet Club'],
];

export const demoSessions: RoundSession[] = sessionRows.map(([daysAgo, firearmId, rounds, location], i) => ({
  id: `s${i + 1}`,
  date: ago(daysAgo),
  firearmId,
  rounds,
  location,
}));

export const demoMaintenance: MaintenanceTask[] = [
  // Upcoming
  { id: 'm1', firearmId: '1', task: 'Deep clean and lubricate', dueDate: ago(5) },
  { id: 'm2', firearmId: '2', task: 'Clean bolt and barrel', dueDate: ahead(4) },
  { id: 'm3', firearmId: '4', task: 'Inspect gas system', dueDate: ahead(11) },
  { id: 'm4', firearmId: '3', task: 'Check magazine spring', dueDate: ahead(29) },
  { id: 'm5', firearmId: '5', task: 'Detail strip and clean', dueDate: ahead(45) },
  // Done
  { id: 'm6', firearmId: '1', task: 'Detail strip and clean', dueDate: ago(40), completedAt: ago(38) },
  { id: 'm7', firearmId: '2', task: 'Clean bolt and barrel', dueDate: ago(30), completedAt: ago(33) },
  { id: 'm8', firearmId: '3', task: 'Clean and oil', dueDate: ago(25), completedAt: ago(20) },
  { id: 'm9', firearmId: '4', task: 'Clean and lubricate', dueDate: ago(16), completedAt: ago(14) },
  { id: 'm10', firearmId: '5', task: 'Function check', dueDate: ago(12), completedAt: ago(10) },
];
