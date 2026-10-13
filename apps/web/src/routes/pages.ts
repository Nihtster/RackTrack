import { lazy, type ComponentType } from 'react';

// Every page, loaded the first time its route is visited, so each ends up in its
// own chunk. The dashboard alone pulls in the charting library, which the other
// pages never need.
//
// Pages are named exports; React.lazy wants a default one, so this adapts.
function lazyPage<K extends string>(load: () => Promise<Record<K, ComponentType>>, name: K) {
  return lazy(() => load().then((module) => ({ default: module[name] })));
}

export const Dashboard = lazyPage(() => import('../pages/dashboard/Dashboard'), 'Dashboard');

export const FirearmsList = lazyPage(() => import('../pages/firearms/FirearmsList'), 'FirearmsList');
export const FirearmForm = lazyPage(() => import('../pages/firearms/FirearmForm'), 'FirearmForm');

export const RoundsHistory = lazyPage(() => import('../pages/rounds/RoundsHistory'), 'RoundsHistory');
export const LogSession = lazyPage(() => import('../pages/rounds/LogSession'), 'LogSession');

export const MaintenanceSchedule = lazyPage(
  () => import('../pages/maintenance/MaintenanceSchedule'),
  'MaintenanceSchedule',
);
export const MaintenanceHistory = lazyPage(
  () => import('../pages/maintenance/MaintenanceHistory'),
  'MaintenanceHistory',
);

export const AmmoInventory = lazyPage(() => import('../pages/ammo/AmmoInventory'), 'AmmoInventory');
export const AmmoTypes = lazyPage(() => import('../pages/ammo/AmmoTypes'), 'AmmoTypes');
