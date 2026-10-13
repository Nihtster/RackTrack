import { Link } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  ChevronRight,
  Crosshair,
  EmptyState,
  Icon,
} from '@racktrack/ui';
import { formatShort } from '../../../lib/day';
import type { RecentFirearm } from '../derive';
import { ViewAllLink } from './ViewAllLink';

const number = new Intl.NumberFormat('en-US');

export function RecentFirearmsCard({ firearms }: { firearms: RecentFirearm[] }) {
  return (
    <Card className="flex flex-col">
      <CardHeader title="Recent firearms" actions={<ViewAllLink to="/firearms" />} />
      {firearms.length === 0 ? (
        <EmptyState
          icon={<Icon icon={Crosshair} size="md" />}
          title="No firearms yet"
          description="Add your first firearm to start tracking it."
        />
      ) : (
        <CardBody className="p-0">
          <ul className="divide-y divide-border">
            {firearms.map(({ firearm, roundsFired, lastMaintenance }) => (
              <li key={firearm.id}>
                <Link
                  to="/firearms"
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface-raised focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent-bright"
                >
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium text-ink">{firearm.name}</div>
                    <div className="truncate text-xs text-ink-muted">
                      {firearm.caliber} · {number.format(roundsFired)} rounds ·{' '}
                      {lastMaintenance ? `Serviced ${formatShort(lastMaintenance)}` : 'Not yet serviced'}
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
