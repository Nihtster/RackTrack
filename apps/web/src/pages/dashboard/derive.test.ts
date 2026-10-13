import { describe, expect, it } from 'vitest';
import type { Firearm } from '../../types/firearm';
import {
  ammoLevels,
  deriveActivity,
  deriveStats,
  maintenanceStatus,
  recentFirearms,
  roundsPerDay,
  upcomingMaintenance,
  type DashboardData,
} from './derive';

const today = '2026-10-13';

const firearm = (id: string, name: string, createdAt: string): Firearm => ({
  id,
  name,
  caliber: '9mm',
  type: 'pistol',
  createdAt,
});

const data: DashboardData = {
  firearms: [
    firearm('1', 'Glock', '2026-01-01'),
    firearm('2', 'Ruger', '2026-06-01'),
    firearm('3', 'Sig', '2026-09-20'),
  ],
  ammo: [
    { id: 'a', caliber: '9mm', onHand: 100, target: 1000 }, // 10%: low
    { id: 'b', caliber: '.22', onHand: 400, target: 1000 }, // 40%: watch
    { id: 'c', caliber: '5.56', onHand: 900, target: 1000 }, // 90%
    { id: 'd', caliber: '12ga', onHand: 0, target: 500 }, // none on hand
  ],
  sessions: [
    { id: 's1', date: '2026-10-13', firearmId: '1', rounds: 50, location: 'Indoor' },
    { id: 's2', date: '2026-10-13', firearmId: '2', rounds: 30, location: 'Outdoor' },
    { id: 's3', date: '2026-09-14', firearmId: '1', rounds: 100, location: 'Indoor' }, // day 30 of the window
    { id: 's4', date: '2026-09-13', firearmId: '1', rounds: 200, location: 'Indoor' }, // just outside it
  ],
  maintenance: [
    { id: 'm1', firearmId: '1', task: 'Clean', dueDate: '2026-10-10' }, // overdue
    { id: 'm2', firearmId: '2', task: 'Oil', dueDate: '2026-10-13' }, // due today: due soon
    { id: 'm3', firearmId: '2', task: 'Inspect', dueDate: '2026-10-27' }, // 14 days: due soon
    { id: 'm4', firearmId: '3', task: 'Strip', dueDate: '2026-10-28' }, // 15 days: scheduled
    { id: 'm5', firearmId: '1', task: 'Old job', dueDate: '2026-08-01', completedAt: '2026-08-03' },
    { id: 'm6', firearmId: '1', task: 'Newer job', dueDate: '2026-09-01', completedAt: '2026-09-05' },
  ],
};

describe('maintenanceStatus', () => {
  it('splits overdue, due soon and scheduled at the 14-day line', () => {
    const status = (dueDate: string) =>
      maintenanceStatus({ id: 'x', firearmId: '1', task: 't', dueDate }, today);
    expect(status('2026-10-12')).toBe('overdue');
    expect(status('2026-10-13')).toBe('due-soon');
    expect(status('2026-10-27')).toBe('due-soon');
    expect(status('2026-10-28')).toBe('scheduled');
  });
});

describe('deriveStats', () => {
  const stats = deriveStats(data, today);

  it('counts firearms and all-time rounds', () => {
    expect(stats.firearms).toBe(3);
    expect(stats.totalRounds).toBe(380);
  });

  it('counts the last 30 days inclusive of today and not beyond', () => {
    expect(stats.roundsLast30).toBe(180);
  });

  it('counts open jobs that are overdue or due soon', () => {
    expect(stats.maintenanceDue).toBe(3);
    expect(stats.maintenanceOverdue).toBe(1);
  });

  it('counts only calibers with stock, and flags the low ones', () => {
    expect(stats.ammoTypes).toBe(3);
    expect(stats.ammoLow).toBe(1);
  });
});

describe('roundsPerDay', () => {
  const days = roundsPerDay(data.sessions, today, 30);

  it('returns one entry per day, oldest first, ending today', () => {
    expect(days).toHaveLength(30);
    expect(days[0].date).toBe('2026-09-14');
    expect(days.at(-1)?.date).toBe(today);
  });

  it('sums sessions on the same day and fills quiet days with zero', () => {
    expect(days.at(-1)?.rounds).toBe(80);
    expect(days[0].rounds).toBe(100);
    expect(days[10].rounds).toBe(0);
    expect(days.at(-1)?.label).toBe('Oct 13');
  });
});

describe('upcomingMaintenance', () => {
  it('lists open jobs soonest first with their firearm and status', () => {
    const upcoming = upcomingMaintenance(data, today, 10);
    expect(upcoming.map((t) => t.id)).toEqual(['m1', 'm2', 'm3', 'm4']);
    expect(upcoming[0]).toMatchObject({ firearm: 'Glock', status: 'overdue', daysUntil: -3 });
  });

  it('respects the limit', () => {
    expect(upcomingMaintenance(data, today, 2)).toHaveLength(2);
  });
});

describe('recentFirearms', () => {
  it('orders by when they were added and totals rounds and last service', () => {
    const recent = recentFirearms(data, 2);
    expect(recent.map((r) => r.firearm.id)).toEqual(['3', '2']);

    const glock = recentFirearms(data, 3).find((r) => r.firearm.id === '1');
    expect(glock?.roundsFired).toBe(350);
    expect(glock?.lastMaintenance).toBe('2026-09-05');

    expect(recent[0].lastMaintenance).toBeUndefined();
  });
});

describe('ammoLevels', () => {
  it('puts the emptiest stock first and picks an intent per level', () => {
    const levels = ammoLevels(data.ammo);
    expect(levels.map((l) => l.stock.id)).toEqual(['d', 'a', 'b', 'c']);
    expect(levels.map((l) => l.intent)).toEqual(['critical', 'critical', 'warning', 'accent']);
    expect(levels[1].percent).toBe(10);
  });

  it('caps the percent at 100 when stock exceeds its target', () => {
    const [level] = ammoLevels([{ id: 'x', caliber: 'x', onHand: 1500, target: 1000 }]);
    expect(level.percent).toBe(100);
  });
});

describe('deriveActivity', () => {
  it('mixes rounds, completed jobs and new firearms, newest first', () => {
    const items = deriveActivity(data, 20);
    expect(items[0].date >= items[1].date).toBe(true);
    expect(new Set(items.map((i) => i.kind))).toEqual(new Set(['rounds', 'maintenance', 'firearm']));
    expect(items.find((i) => i.id === 'firearm-3')?.title).toBe('Sig registered');
    expect(items.find((i) => i.id === 'session-s1')?.title).toBe('50 rounds logged');
  });

  it('leaves out jobs that are not done yet', () => {
    expect(deriveActivity(data, 50).some((i) => i.id === 'maintenance-m1')).toBe(false);
  });

  it('respects the limit', () => {
    expect(deriveActivity(data, 3)).toHaveLength(3);
  });
});
