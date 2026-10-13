import {
  Card,
  CardHeader,
  EmptyState,
  Icon,
  List,
  ListItem,
  Package,
  ProgressBar,
} from '@racktrack/ui';
import type { AmmoLevel } from '../derive';
import { ViewAllLink } from './ViewAllLink';

const number = new Intl.NumberFormat('en-US');

export function AmmoInventoryCard({ levels }: { levels: AmmoLevel[] }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader title="Ammo Inventory" actions={<ViewAllLink to="/ammo" />} />
      {levels.length === 0 ? (
        <EmptyState
          icon={<Icon icon={Package} size="md" />}
          title="No ammo on record"
          description="Add what you have on hand to see stock levels."
        />
      ) : (
        <List>
          {levels.map(({ stock, percent, intent }) => (
            <ListItem
              key={stock.id}
              title={stock.caliber}
              description={<span className="tabular-nums">{number.format(stock.onHand)} rds</span>}
              trailing={
                <div className="flex shrink-0 items-center gap-3">
                  <ProgressBar
                    value={stock.onHand}
                    max={stock.target}
                    intent={intent}
                    size="sm"
                    aria-label={`${stock.caliber} stock`}
                    className="w-24 sm:w-28"
                  />
                  <span className="w-9 text-right text-xs text-ink-muted tabular-nums">{percent}%</span>
                </div>
              }
            />
          ))}
        </List>
      )}
    </Card>
  );
}
