import { useMemo } from 'react';
import { api } from '../data/api';
import type { DashboardData } from '../pages/dashboard/derive';
import { useQuery } from './useQuery';

/** Everything the dashboard reads, loaded together. */
export function useDashboardData(): {
  data: DashboardData | undefined;
  error: Error | undefined;
  isLoading: boolean;
} {
  const firearms = useQuery(api.firearms);
  const ammo = useQuery(api.ammo);
  const sessions = useQuery(api.sessions);
  const maintenance = useQuery(api.maintenance);

  const queries = [firearms, ammo, sessions, maintenance];
  const isLoading = queries.some((q) => q.isLoading);
  const error = queries.find((q) => q.error)?.error;

  const data = useMemo<DashboardData | undefined>(() => {
    if (!firearms.data || !ammo.data || !sessions.data || !maintenance.data) return undefined;
    return {
      firearms: firearms.data,
      ammo: ammo.data,
      sessions: sessions.data,
      maintenance: maintenance.data,
    };
  }, [firearms.data, ammo.data, sessions.data, maintenance.data]);

  return { data, error, isLoading };
}
