import { BarChart, Card, CardBody, CardHeader } from '@racktrack/ui';
import type { DayRounds } from '../derive';
import { ViewAllLink } from './ViewAllLink';

const number = new Intl.NumberFormat('en-US');

export function RoundCountCard({ days }: { days: DayRounds[] }) {
  const total = days.reduce((n, d) => n + d.rounds, 0);

  return (
    <Card className="flex flex-col">
      <CardHeader
        title="Round count"
        actions={<ViewAllLink to="/rounds">View Details →</ViewAllLink>}
      />
      <CardBody className="flex-1">
        <p className="mb-3 text-sm text-ink-muted">
          <span className="text-lg font-semibold text-ink">{number.format(total)}</span> rounds in the
          last 30 days
        </p>
        <BarChart
          aria-label="Rounds fired per day, last 30 days"
          data={days}
          xKey="label"
          series={[{ key: 'rounds', label: 'Rounds', color: 'accent' }]}
          valueFormatter={(v) => number.format(v)}
          height={220}
        />
      </CardBody>
    </Card>
  );
}
