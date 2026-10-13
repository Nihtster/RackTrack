import { Crosshair, Icon, Package, StatTile, Target, Wrench } from '@racktrack/ui';
import type { DashboardStats } from '../../../types';

const number = new Intl.NumberFormat('en-US');

export function StatsRow({ stats }: { stats: DashboardStats }) {
  return (
    <section aria-label="Summary" className="grid grid-cols-1 gap-4 min-[520px]:grid-cols-2 xl:grid-cols-4">
      <StatTile
        label="Firearms"
        value={stats.firearms}
        delta="Registered"
        icon={<Icon icon={Crosshair} size="md" />}
        iconTone="accent"
      />
      <StatTile
        label="Total Rounds"
        value={number.format(stats.totalRounds)}
        delta="Logged"
        icon={<Icon icon={Target} size="md" />}
        iconTone="success"
      />
      <StatTile
        label="Maintenance"
        value={stats.maintenanceDue}
        delta={stats.maintenanceOverdue > 0 ? `${stats.maintenanceOverdue} Overdue` : 'Due Soon'}
        deltaIntent={stats.maintenanceOverdue > 0 ? 'critical' : 'warning'}
        icon={<Icon icon={Wrench} size="md" />}
        iconTone="warning"
      />
      <StatTile
        label="Ammo Types"
        value={stats.ammoTypes}
        delta="In Inventory"
        icon={<Icon icon={Package} size="md" />}
        iconTone="violet"
      />
    </section>
  );
}
