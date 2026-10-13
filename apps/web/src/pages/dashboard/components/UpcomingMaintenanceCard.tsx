import { Badge, Card, CardBody, CardHeader, EmptyState, Icon, Wrench } from '@racktrack/ui';
import { formatShort } from '../../../lib/day';
import { statusBadge, type UpcomingTask } from '../derive';
import { ViewAllLink } from './ViewAllLink';

export function UpcomingMaintenanceCard({ tasks }: { tasks: UpcomingTask[] }) {
  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Upcoming maintenance"
        actions={<ViewAllLink to="/maintenance" />}
      />
      {tasks.length === 0 ? (
        <EmptyState
          icon={<Icon icon={Wrench} size="md" />}
          title="Nothing scheduled"
          description="Maintenance you schedule will show up here."
        />
      ) : (
        <CardBody className="p-0">
          <ul className="divide-y divide-border">
            {tasks.map((t) => (
              <li key={t.id} className="flex items-center justify-between gap-3 px-4 py-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-ink">{t.firearm}</div>
                  <div className="truncate text-xs text-ink-muted">
                    {t.task} · {formatShort(t.dueDate)}
                  </div>
                </div>
                <Badge intent={statusBadge[t.status].intent} size="sm">
                  {statusBadge[t.status].label}
                </Badge>
              </li>
            ))}
          </ul>
        </CardBody>
      )}
    </Card>
  );
}
