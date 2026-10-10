import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    // offlineFirst still sends the request while offline, so a service worker cache can answer it.
    queries: {
      staleTime: 60_000,
      refetchOnWindowFocus: false,
      networkMode: 'offlineFirst',
    },
  },
})
