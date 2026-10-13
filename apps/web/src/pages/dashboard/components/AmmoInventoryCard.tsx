import { Card, CardBody, CardHeader, EmptyState, Icon, Package, ProgressBar } from '@racktrack/ui';
import type { AmmoLevel } from '../derive';
import { ViewAllLink } from './ViewAllLink';

const number = new Intl.NumberFormat('en-US');

export function AmmoInventoryCard({ levels }: { levels: AmmoLevel[] }) {
  return (
    <Card className="flex flex-col">
      <CardHeader title="Ammo inventory" actions={<ViewAllLink to="/ammo" />} />
      {levels.length === 0 ? (
        <EmptyState
          icon={<Icon icon={Package} size="md" />}
          title="No ammo on record"
          description="Add what you have on hand to see stock levels."
        />
      ) : (
        <CardBody>
          <ul className="space-y-4">
            {levels.map(({ stock, percent, intent }) => (
              <li key={stock.id}>
                <div className="mb-1.5 flex items-baseline justify-between gap-3 text-sm">
                  <span className="font-medium text-ink">{stock.caliber}</span>
                  <span className="text-xs text-ink-muted tabular-nums">
                    {number.format(stock.onHand)} rds · {percent}%
                  </span>
                </div>
                <ProgressBar
                  value={stock.onHand}
                  max={stock.target}
                  intent={intent}
                  size="sm"
                  aria-label={`${stock.caliber} stock`}
                  valueLabel={`${percent}%`}
                />
              </li>
            ))}
          </ul>
        </CardBody>
      )}
    </Card>
  );
}
