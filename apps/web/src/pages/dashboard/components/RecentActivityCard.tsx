import { Link } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  ChevronRight,
  Crosshair,
  EmptyState,
  History,
  Icon,
  Target,
  Wrench,
} from '@racktrack/ui';
import type { IconComponent } from '@racktrack/ui';
import { formatRelative } from '../../../lib/day';
import type { ActivityItem } from '../derive';

const kindIcon: Record<ActivityItem['kind'], IconComponent> = {
  rounds: Target,
  maintenance: Wrench,
  firearm: Crosshair,
};

export function RecentActivityCard({ items, today }: { items: ActivityItem[]; today: string }) {
  return (
    <Card className="flex flex-col">
      <CardHeader title="Recent activity" />
      {items.length === 0 ? (
        <EmptyState
          icon={<Icon icon={History} size="md" />}
          title="No activity yet"
          description="Logged rounds, maintenance and new firearms appear here."
        />
      ) : (
        <CardBody className="p-0">
          <ul className="divide-y divide-border">
            {items.map((item) => (
              <li key={item.id}>
                <Link
                  to={item.href}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-raised focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-bright"
                >
                  <span className="flex size-9 shrink-0 items-center justify-center rounded-control bg-surface-raised text-accent-bright">
                    <Icon icon={kindIcon[item.kind]} size="md" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink">{item.title}</div>
                    <div className="truncate text-xs text-ink-muted">
                      {item.subtitle} · {formatRelative(item.date, today)}
                    </div>
                  </div>
                  <Icon icon={ChevronRight} className="text-ink-muted" />
                </Link>
              </li>
            ))}
          </ul>
        </CardBody>
      )}
    </Card>
  );
}
