import { Link } from 'react-router-dom';
import {
  Card,
  CardHeader,
  Crosshair,
  EmptyState,
  History,
  Icon,
  IconTile,
  List,
  ListItem,
  Plus,
  Wrench,
} from '@racktrack/ui';
import type { IconComponent, IconTileTone } from '@racktrack/ui';
import type { ActivityItem } from '../../../types';
import { ViewAllLink } from './ViewAllLink';

const kind: Record<ActivityItem['kind'], { icon: IconComponent; tone: IconTileTone }> = {
  rounds: { icon: Plus, tone: 'success' },
  maintenance: { icon: Wrench, tone: 'warning' },
  firearm: { icon: Crosshair, tone: 'accent' },
};

export function RecentActivityCard({ items }: { items: ActivityItem[] }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader title="Recent Activity" actions={<ViewAllLink to="/rounds" />} />
      {items.length === 0 ? (
        <EmptyState
          icon={<Icon icon={History} size="md" />}
          title="No activity yet"
          description="Logged rounds, maintenance and new firearms appear here."
        />
      ) : (
        <List>
          {items.map((item) => (
            <ListItem
              key={item.id}
              leading={
                <IconTile round tone={kind[item.kind].tone}>
                  <Icon icon={kind[item.kind].icon} />
                </IconTile>
              }
              title={item.title}
              description={item.subtitle}
              renderLink={({ className, children }) => (
                <Link to={item.href} className={className}>
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
