import { QueryClient, type DefaultOptions } from '@tanstack/react-query';
import { QUERY_STALE_TIME, QUERY_CACHE_TIME, QUERY_RETRY } from '@/constants';

/**
 * TanStack Query Client Configuration
 * Centralized configuration for React Query with performance optimizations
 */

const queryConfig: DefaultOptions = {
  queries: {
    // Stale time - how long data is considered fresh
    staleTime: QUERY_STALE_TIME.STANDARD, // 5 minutes default

    // Cache time - how long inactive data stays in cache
    gcTime: QUERY_CACHE_TIME.DEFAULT, // 10 minutes (previously cacheTime)

    // Retry configuration
    retry: QUERY_RETRY.DEFAULT, // 3 retries

    // Refetch configuration
    refetchOnWindowFocus: true, // Refetch when window regains focus
    refetchOnReconnect: true, // Refetch when network reconnects
    refetchOnMount: true, // Refetch on component mount if data is stale

    // Network mode
    networkMode: 'online', // Only fetch when online

    // Error handling
    throwOnError: false, // Don't throw errors, handle via error state
  },
  mutations: {
    // Retry mutations once on failure
    retry: QUERY_RETRY.MINIMAL,

    // Network mode for mutations
    networkMode: 'online',

    // Error handling
    throwOnError: false,
  },
};

/**
 * Create a new QueryClient instance
 * Use this in app providers
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: queryConfig,
  });
}

/**
 * Singleton QueryClient for use in client components
 * DO NOT use in Server Components
 */
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(): QueryClient {
  if (typeof window === 'undefined') {
    // Server: always create a new query client
    return createQueryClient();
  } else {
    // Browser: create query client if it doesn't exist
    if (!browserQueryClient) {
      browserQueryClient = createQueryClient();
    }
    return browserQueryClient;
  }
}
