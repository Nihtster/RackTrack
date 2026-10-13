import type { BadgeIntent } from '@racktrack/ui';
import type { AmmoStock } from './ammo';
import type { Firearm } from './firearm';
import type { MaintenanceStatus, MaintenanceTask } from './maintenance';
import type { RoundSession } from './session';

// What the dashboard reads and what it shows. The raw records come from the data
// layer; the rest are shapes derived from them (see pages/dashboard/derive.ts),
// kept here so cards, hooks and other pages can import them without importing
// the logic.

export interface DashboardData {
  firearms: Firearm[];
  ammo: AmmoStock[];
  sessions: RoundSession[];
  maintenance: MaintenanceTask[];
}

export interface DashboardStats {
  firearms: number;
  totalRounds: number;
  /** Rounds in the 30 days up to and including today. */
  roundsLast30: number;
  /** Open jobs that are overdue or due soon. */
  maintenanceDue: number;
  maintenanceOverdue: number;
  ammoTypes: number;
  /** Calibers at or below the low-stock line. */
  ammoLow: number;
}

// A type alias, not an interface: chart rows need an index signature, which
// only object type aliases get implicitly.
export type DayRounds = {
  /** YYYY-MM-DD, kept for the tooltip and for linking. */
  date: string;
  /** Short axis label, "Sep 14". */
  label: string;
  rounds: number;
};

export interface UpcomingTask {
  id: string;
  firearm: string;
  task: string;
  dueDate: string;
  status: MaintenanceStatus;
  /** Negative when overdue. */
  daysUntil: number;
}

export interface RecentFirearm {
  firearm: Firearm;
  roundsFired: number;
  /** Day the last job on this firearm was completed, if any. */
  lastMaintenance?: string;
}

export interface AmmoLevel {
  stock: AmmoStock;
  percent: number;
  intent: BadgeIntent;
}

export interface ActivityItem {
  id: string;
  kind: 'rounds' | 'maintenance' | 'firearm';
  title: string;
  subtitle: string;
  /** YYYY-MM-DD */
  date: string;
  href: string;
}
