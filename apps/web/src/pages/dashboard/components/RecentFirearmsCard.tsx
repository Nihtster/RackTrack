import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  Crosshair,
  EmptyState,
  Icon,
  IconTile,
  List,
  ListItem,
} from '@racktrack/ui';
import { formatLong } from '../../../lib/day';
import { firearmTypeLabel, type RecentFirearm } from '../derive';
import { ViewAllLink } from './ViewAllLink';

const number = new Intl.NumberFormat('en-US');

// A label over a value, for the figures at the right of a row.
function Figure({ label, children }: { label: string; children: string }) {
  return (
    <div>
      <dt className="text-ink-muted">{label}</dt>
      <dd className="font-semibold text-ink tabular-nums">{children}</dd>
    </div>
  );
}

export function RecentFirearmsCard({ firearms }: { firearms: RecentFirearm[] }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader title="Recent Firearms" actions={<ViewAllLink to="/firearms" />} />
      {firearms.length === 0 ? (
        <EmptyState
          icon={<Icon icon={Crosshair} size="md" />}
          title="No firearms yet"
          description="Add your first firearm to start tracking it."
        />
      ) : (
        <List>
          {firearms.map(({ firearm, roundsFired, lastMaintenance }) => (
            <ListItem
              key={firearm.id}
              leading={
                <IconTile tone="neutral">
                  <Icon icon={Crosshair} />
                </IconTile>
              }
              title={firearm.name}
              description={`${firearmTypeLabel[firearm.type]} · ${firearm.caliber}`}
              // Hidden on narrow screens, where the name and type fill the row.
              trailing={
                <dl className="hidden shrink-0 gap-6 text-xs min-[520px]:flex">
                  <Figure label="Last Maintenance">
                    {lastMaintenance ? formatLong(lastMaintenance) : 'Never'}
                  </Figure>
                  <Figure label="Rounds Fired">{number.format(roundsFired)}</Figure>
                </dl>
              }
              renderLink={({ className, children }) => (
                <Link to="/firearms" className={className}>
                  {children}
                </Link>
              )}
            />
          ))}
        </List>
      )}
    </Card>
  );
}
