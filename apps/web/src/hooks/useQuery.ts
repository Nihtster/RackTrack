import { useCallback, useEffect, useState } from 'react';

export interface QueryResult<T> {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
  /** Runs the fetch again, keeping the current data on screen meanwhile. */
  refetch: () => void;
}

/**
 * Runs `fetcher` on mount and reports its result. Pass a stable function (one
 * from `data/api`), not an inline arrow, or it will refetch every render.
 * A deliberately small stand-in for a data-fetching library.
 */
export function useQuery<T>(fetcher: () => Promise<T>): QueryResult<T> {
  const [state, setState] = useState<Omit<QueryResult<T>, 'refetch'>>({
    data: undefined,
    error: undefined,
    isLoading: true,
  });
  const [version, setVersion] = useState(0);

  useEffect(() => {
    let current = true;
    fetcher().then(
      (data) => current && setState({ data, error: undefined, isLoading: false }),
      (error: unknown) =>
        current &&
        setState({
          data: undefined,
          error: error instanceof Error ? error : new Error(String(error)),
          isLoading: false,
        }),
    );
    return () => {
      current = false;
    };
  }, [fetcher, version]);

  const refetch = useCallback(() => setVersion((v) => v + 1), []);

  return { ...state, refetch };
}
