import { QueryClient, QueryClientProvider, focusManager } from '@tanstack/react-query';
import { useEffect, useMemo, type ReactNode } from 'react';
import { AppState, type AppStateStatus } from 'react-native';
import { QUERY_GC_TIME_MS, QUERY_STALE_TIME_MS } from '@app/config/constants';
import { AppError } from '@shared/api/error';

function onAppStateChange(status: AppStateStatus) {
  focusManager.setFocused(status === 'active');
}

export function QueryProvider({ children }: { children: ReactNode }) {
  const client = useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: QUERY_STALE_TIME_MS,
            gcTime: QUERY_GC_TIME_MS,
            retry: (failureCount, error) => {
              if (error instanceof AppError && (error.kind === 'AUTH' || error.kind === 'VALIDATION' || error.kind === 'NOT_FOUND')) {
                return false;
              }
              return failureCount < 2;
            },
            refetchOnWindowFocus: true,
          },
          mutations: { retry: 0 },
        },
      }),
    [],
  );

  useEffect(() => {
    const sub = AppState.addEventListener('change', onAppStateChange);
    return () => sub.remove();
  }, []);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
