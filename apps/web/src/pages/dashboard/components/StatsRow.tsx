import { Crosshair, Icon, Package, StatTile, Target, Wrench } from '@racktrack/ui';
import type { DashboardStats } from '../derive';

const number = new Intl.NumberFormat('en-US');

export function StatsRow({ stats }: { stats: DashboardStats }) {
  return (
    <section aria-label="Summary" className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
      <StatTile
        label="Firearms registered"
        value={stats.firearms}
        icon={<Icon icon={Crosshair} size="md" />}
      />
      <StatTile
        label="Total rounds"
        value={number.format(stats.totalRounds)}
        delta={`+${number.format(stats.roundsLast30)} last 30 days`}
        deltaIntent="success"
        icon={<Icon icon={Target} size="md" />}
      />
      <StatTile
        label="Maintenance due"
        value={stats.maintenanceDue}
        delta={stats.maintenanceOverdue > 0 ? `${stats.maintenanceOverdue} overdue` : 'All on schedule'}
        deltaIntent={stats.maintenanceOverdue > 0 ? 'critical' : 'success'}
        icon={<Icon icon={Wrench} size="md" />}
      />
      <StatTile
        label="Ammo types in inventory"
        value={stats.ammoTypes}
        delta={stats.ammoLow > 0 ? `${stats.ammoLow} running low` : 'Stocked'}
        deltaIntent={stats.ammoLow > 0 ? 'warning' : 'success'}
        icon={<Icon icon={Package} size="md" />}
      />
    </section>
  );
}
