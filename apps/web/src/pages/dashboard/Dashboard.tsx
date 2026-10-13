import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Card,
  EmptyState,
  Icon,
  Package,
  PageHeader,
  Plus,
  Skeleton,
  Tooltip,
  useToast,
  Wrench,
} from '@racktrack/ui';
import type { IconComponent } from '@racktrack/ui';
import { LogRoundsModal } from '../../components/LogRoundsModal';
import { useDashboardData } from '../../hooks/useDashboardData';
import { toDay } from '../../lib/day';
import { AmmoInventoryCard } from './components/AmmoInventoryCard';
import { RecentActivityCard } from './components/RecentActivityCard';
import { RecentFirearmsCard } from './components/RecentFirearmsCard';
import { RoundCountCard } from './components/RoundCountCard';
import { StatsRow } from './components/StatsRow';
import { UpcomingMaintenanceCard } from './components/UpcomingMaintenanceCard';
import {
  ammoLevels,
  deriveActivity,
  deriveStats,
  recentFirearms,
  roundsPerDay,
  upcomingMaintenance,
} from './derive';

const dateFormat = new Intl.DateTimeFormat('en-US', {
  weekday: 'short',
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

// The three quick actions as icon buttons. Each has an accessible name, and a
// tooltip says it on hover. Logging rounds opens a modal; the others go to
// their pages.
function QuickActions({ onLogRounds }: { onLogRounds: () => void }) {
  const navigate = useNavigate();
  const actions: { label: string; icon: IconComponent; run: () => void; primary?: boolean }[] = [
    { label: 'Log rounds', icon: Plus, run: onLogRounds, primary: true },
    { label: 'Add maintenance', icon: Wrench, run: () => navigate('/maintenance') },
    { label: 'Add ammo', icon: Package, run: () => navigate('/ammo') },
  ];

  return (
    <>
      {actions.map(({ label, icon, run, primary }) => (
        <Tooltip key={label} content={label}>
          <Button
            iconOnly
            variant={primary ? 'primary' : 'secondary'}
            aria-label={label}
            onClick={run}
          >
            <Icon icon={icon} />
          </Button>
        </Tooltip>
      ))}
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div role="status" aria-label="Loading dashboard" className="space-y-4">
      <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <Skeleton key={i} className="h-[74px] rounded-card" />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-3">
        <Skeleton className="h-80 rounded-card xl:col-span-2" />
        <Skeleton className="h-80 rounded-card" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-72 rounded-card" />
        ))}
      </div>
    </div>
  );
}

export function Dashboard() {
  const { data, error, isLoading, reload } = useDashboardData();
  const { toast } = useToast();
  const [logging, setLogging] = useState(false);
  // One "today" per mount, so every card agrees about what day it is.
  const [now] = useState(() => new Date());
  const today = toDay(now);

  const view = useMemo(() => {
    if (!data) return undefined;
    return {
      stats: deriveStats(data, today),
      days: roundsPerDay(data.sessions, today, 30),
      upcoming: upcomingMaintenance(data, today),
      firearms: recentFirearms(data),
      levels: ammoLevels(data.ammo),
      activity: deriveActivity(data),
    };
  }, [data, today]);

  return (
    <>
      <PageHeader
        title="Dashboard"
        subtitle={
          <>
            {/* On a phone the date sits under the title; from `sm` it moves
                beside the action buttons. */}
            <time dateTime={today} className="block sm:hidden">
              {dateFormat.format(now)}
            </time>
            Your firearms, ammo, and maintenance, all in one place.
          </>
        }
        actions={
          <>
            <time dateTime={today} className="mr-2 hidden text-sm text-ink-muted sm:block">
              {dateFormat.format(now)}
            </time>
            <QuickActions onLogRounds={() => setLogging(true)} />
          </>
        }
      />

      {data && (
        <LogRoundsModal
          open={logging}
          onOpenChange={setLogging}
          firearms={data.firearms}
          ammo={data.ammo}
          onLogged={(session, firearm) => {
            reload();
            toast({
              title: `Logged ${session.rounds.toLocaleString('en-US')} rounds`,
              description: `${firearm.name} · ${session.location}`,
              intent: 'success',
            });
          }}
        />
      )}

      {isLoading && <DashboardSkeleton />}

      {error && (
        <Card>
          <EmptyState
            title="Couldn't load the dashboard"
            description={error.message}
          />
        </Card>
      )}

      {view && (
        <div className="space-y-4">
          <StatsRow stats={view.stats} />

          <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-[3fr_2fr_2fr]">
            <div className="lg:col-span-2 xl:col-span-1">
              <RecentFirearmsCard firearms={view.firearms} />
            </div>
            <UpcomingMaintenanceCard tasks={view.upcoming} />
            <AmmoInventoryCard levels={view.levels} />
          </div>

          <div className="grid gap-4 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <RoundCountCard days={view.days} />
            </div>
            <RecentActivityCard items={view.activity} />
          </div>
        </div>
      )}
    </>
  );
}
