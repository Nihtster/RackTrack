import { useEffect, useState } from 'react';

export interface QueryResult<T> {
  data: T | undefined;
  error: Error | undefined;
  isLoading: boolean;
}

/**
 * Runs `fetcher` on mount and reports its result. Pass a stable function (one
 * from `data/api`), not an inline arrow, or it will refetch every render.
 * A deliberately small stand-in for a data-fetching library.
 */
export function useQuery<T>(fetcher: () => Promise<T>): QueryResult<T> {
  const [state, setState] = useState<QueryResult<T>>({
    data: undefined,
    error: undefined,
    isLoading: true,
  });

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
  }, [fetcher]);

  return state;
}
