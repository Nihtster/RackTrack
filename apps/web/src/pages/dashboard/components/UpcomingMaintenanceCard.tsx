import {
  Badge,
  Card,
  CardHeader,
  Crosshair,
  EmptyState,
  Icon,
  IconTile,
  List,
  ListItem,
  Wrench,
} from '@racktrack/ui';
import { formatLong } from '../../../lib/day';
import type { UpcomingTask } from '../../../types';
import { statusBadge } from '../derive';
import { ViewAllLink } from './ViewAllLink';

export function UpcomingMaintenanceCard({ tasks }: { tasks: UpcomingTask[] }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader title="Upcoming Maintenance" actions={<ViewAllLink to="/maintenance" />} />
      {tasks.length === 0 ? (
        <EmptyState
          icon={<Icon icon={Wrench} size="md" />}
          title="Nothing scheduled"
          description="Maintenance you schedule will show up here."
        />
      ) : (
        <List>
          {tasks.map((t) => (
            <ListItem
              key={t.id}
              alignStart
              leading={
                <IconTile tone="neutral">
                  <Icon icon={Crosshair} />
                </IconTile>
              }
              title={t.firearm}
              description={
                <>
                  <div>{t.task}</div>
                  <div>Due: {formatLong(t.dueDate)}</div>
                </>
              }
              trailing={
                <Badge intent={statusBadge[t.status].intent} size="sm" className="shrink-0">
                  {statusBadge[t.status].label}
                </Badge>
              }
            />
          ))}
        </List>
      )}
    </Card>
  );
}
