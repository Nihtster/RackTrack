import type { BadgeIntent } from '@racktrack/ui';
import type { AmmoStock } from '../../types/ammo';
import type { Firearm, FirearmType } from '../../types/firearm';
import type { MaintenanceTask } from '../../types/maintenance';
import type { RoundSession } from '../../types/session';
import { addDays, diffDays, formatLong, formatShort } from '../../lib/day';

// Everything the dashboard shows is derived here from the raw records, as plain
// functions of (data, today). They hold no state and read no clock, so they are
// the same code whether the records come from demo data or an API.

export interface DashboardData {
  firearms: Firearm[];
  ammo: AmmoStock[];
  sessions: RoundSession[];
  maintenance: MaintenanceTask[];
}

/** Days ahead that still counts as "due soon". */
export const DUE_SOON_DAYS = 14;
/** Stock at or below this share of its target is flagged as low. */
export const LOW_AMMO_SHARE = 0.25;

export const firearmTypeLabel: Record<FirearmType, string> = {
  pistol: 'Pistol',
  rifle: 'Rifle',
  smg: 'SMG',
  shotgun: 'Shotgun',
  sniper: 'Sniper',
};

export type MaintenanceStatus = 'overdue' | 'due-soon' | 'scheduled';

export function maintenanceStatus(task: MaintenanceTask, today: string): MaintenanceStatus {
  const until = diffDays(today, task.dueDate);
  if (until < 0) return 'overdue';
  return until <= DUE_SOON_DAYS ? 'due-soon' : 'scheduled';
}

const openTasks = (tasks: MaintenanceTask[]) => tasks.filter((t) => !t.completedAt);

// ---- stat tiles -----------------------------------------------------------

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

export function deriveStats(data: DashboardData, today: string): DashboardStats {
  const windowStart = addDays(today, -29);
  const statuses = openTasks(data.maintenance).map((t) => maintenanceStatus(t, today));
  const inStock = data.ammo.filter((a) => a.onHand > 0);

  return {
    firearms: data.firearms.length,
    totalRounds: data.sessions.reduce((n, s) => n + s.rounds, 0),
    roundsLast30: data.sessions
      .filter((s) => s.date >= windowStart && s.date <= today)
      .reduce((n, s) => n + s.rounds, 0),
    maintenanceDue: statuses.filter((s) => s !== 'scheduled').length,
    maintenanceOverdue: statuses.filter((s) => s === 'overdue').length,
    ammoTypes: inStock.length,
    ammoLow: inStock.filter((a) => a.onHand / a.target <= LOW_AMMO_SHARE).length,
  };
}

// ---- round count chart ----------------------------------------------------

// A type alias, not an interface: chart rows need an index signature, which
// only object type aliases get implicitly.
export type DayRounds = {
  /** YYYY-MM-DD, kept for the tooltip and for linking. */
  date: string;
  /** Short axis label, "Sep 14". */
  label: string;
  rounds: number;
};

/** One entry per day for the `days` days ending today, zero when nothing was fired. */
export function roundsPerDay(sessions: RoundSession[], today: string, days = 30): DayRounds[] {
  const totals = new Map<string, number>();
  for (const s of sessions) totals.set(s.date, (totals.get(s.date) ?? 0) + s.rounds);

  return Array.from({ length: days }, (_, i) => {
    const date = addDays(today, i - (days - 1));
    return { date, label: formatShort(date), rounds: totals.get(date) ?? 0 };
  });
}

// ---- upcoming maintenance -------------------------------------------------

export interface UpcomingTask {
  id: string;
  firearm: string;
  task: string;
  dueDate: string;
  status: MaintenanceStatus;
  /** Negative when overdue. */
  daysUntil: number;
}

/** Open jobs, soonest first (overdue ones lead). */
export function upcomingMaintenance(data: DashboardData, today: string, limit = 3): UpcomingTask[] {
  const byId = new Map(data.firearms.map((f) => [f.id, f]));
  return openTasks(data.maintenance)
    .map((t) => ({
      id: t.id,
      firearm: byId.get(t.firearmId)?.name ?? 'Unknown firearm',
      task: t.task,
      dueDate: t.dueDate,
      status: maintenanceStatus(t, today),
      daysUntil: diffDays(today, t.dueDate),
    }))
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, limit);
}

export const statusBadge: Record<MaintenanceStatus, { label: string; intent: BadgeIntent }> = {
  overdue: { label: 'Overdue', intent: 'critical' },
  'due-soon': { label: 'Due Soon', intent: 'warning' },
  scheduled: { label: 'Scheduled', intent: 'neutral' },
};

// ---- recent firearms ------------------------------------------------------

export interface RecentFirearm {
  firearm: Firearm;
  roundsFired: number;
  /** Day the last job on this firearm was completed, if any. */
  lastMaintenance?: string;
}

/** Most recently added firearms first. */
export function recentFirearms(data: DashboardData, limit = 5): RecentFirearm[] {
  return [...data.firearms]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, limit)
    .map((firearm) => {
      const done = data.maintenance
        .filter((t) => t.firearmId === firearm.id && t.completedAt)
        .map((t) => t.completedAt as string)
        .sort();
      return {
        firearm,
        roundsFired: data.sessions
          .filter((s) => s.firearmId === firearm.id)
          .reduce((n, s) => n + s.rounds, 0),
        lastMaintenance: done.at(-1),
      };
    });
}

// ---- ammo inventory -------------------------------------------------------

export interface AmmoLevel {
  stock: AmmoStock;
  percent: number;
  intent: BadgeIntent;
}

/** Emptiest relative to target first, so what needs restocking is at the top. */
export function ammoLevels(ammo: AmmoStock[]): AmmoLevel[] {
  return ammo
    .map((stock) => {
      const share = stock.target > 0 ? stock.onHand / stock.target : 0;
      const intent: BadgeIntent = share <= LOW_AMMO_SHARE ? 'critical' : 'success';
      return { stock, percent: Math.round(Math.min(share, 1) * 100), intent, share };
    })
    .sort((a, b) => a.share - b.share)
    .map(({ stock, percent, intent }) => ({ stock, percent, intent }));
}

// ---- recent activity ------------------------------------------------------

export interface ActivityItem {
  id: string;
  kind: 'rounds' | 'maintenance' | 'firearm';
  title: string;
  subtitle: string;
  /** YYYY-MM-DD */
  date: string;
  href: string;
}

const number = new Intl.NumberFormat('en-US');

/** Rounds logged, jobs completed and firearms added, newest first. */
export function deriveActivity(data: DashboardData, limit = 4): ActivityItem[] {
  const byId = new Map(data.firearms.map((f) => [f.id, f]));
  const nameOf = (id: string) => byId.get(id)?.name ?? 'Unknown firearm';

  const items: ActivityItem[] = [
    ...data.sessions.map<ActivityItem>((s) => ({
      id: `session-${s.id}`,
      kind: 'rounds',
      title: `Added ${number.format(s.rounds)} rounds of ${byId.get(s.firearmId)?.caliber ?? 'ammo'}`,
      subtitle: `${formatLong(s.date)} · ${nameOf(s.firearmId)}`,
      date: s.date,
      href: '/rounds',
    })),
    ...data.maintenance
      .filter((t) => t.completedAt)
      .map<ActivityItem>((t) => ({
        id: `maintenance-${t.id}`,
        kind: 'maintenance',
        title: 'Completed maintenance',
        subtitle: `${formatLong(t.completedAt as string)} · ${nameOf(t.firearmId)}`,
        date: t.completedAt as string,
        href: '/maintenance/history',
      })),
    ...data.firearms.map<ActivityItem>((f) => ({
      id: `firearm-${f.id}`,
      kind: 'firearm',
      title: 'Registered new firearm',
      subtitle: `${formatLong(f.createdAt)} · ${f.name}`,
      date: f.createdAt,
      href: '/firearms',
    })),
  ];

  return items.sort((a, b) => b.date.localeCompare(a.date) || a.id.localeCompare(b.id)).slice(0, limit);
}
