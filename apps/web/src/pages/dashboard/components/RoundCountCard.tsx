import { BarChart, Card, CardBody, CardHeader } from '@racktrack/ui';
import type { DayRounds } from '../../../types';
import { ViewAllLink } from './ViewAllLink';

const number = new Intl.NumberFormat('en-US');

export function RoundCountCard({ days }: { days: DayRounds[] }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader
        title={
          <>
            Round Count <span className="font-normal text-ink-muted">(Last 30 Days)</span>
          </>
        }
        actions={<ViewAllLink to="/rounds">View Details →</ViewAllLink>}
      />
      <CardBody className="flex-1">
        <BarChart
          aria-label="Rounds fired per day, last 30 days"
          data={days}
          xKey="label"
          series={[{ key: 'rounds', label: 'Rounds', color: 'success' }]}
          valueFormatter={(v) => number.format(v)}
          height={220}
        />
      </CardBody>
    </Card>
  );
}
