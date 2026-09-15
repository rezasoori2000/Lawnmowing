import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
      // The real API isn't reachable yet in every dev environment - keep
      // showing cached/seed data rather than surfacing a hard error screen.
      refetchOnWindowFocus: false,
    },
  },
});
