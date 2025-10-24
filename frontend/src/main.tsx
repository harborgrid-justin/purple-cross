/**
 * WF-COMP-XXX | main.tsx - main
 * Purpose: React application entry point with optimized TanStack Query configuration
 * Dependencies: react, @tanstack/react-query
 * Last Updated: 2025-10-24 | File Type: .tsx
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import App from './App';
import './styles/index.css';
import {
  QUERY_STALE_TIME,
  QUERY_CACHE_TIME,
  QUERY_RETRY,
} from './constants';

/**
 * Optimized QueryClient configuration for Purple Cross
 *
 * Performance Strategy:
 * - Standard staleTime (5 minutes): Reduces unnecessary API calls
 * - Retry with exponential backoff: Handles transient failures gracefully
 * - No refetch on window focus: Veterinary staff often switch windows
 * - Refetch on reconnect: Ensures data freshness after network issues
 * - Network mode 'online': Prevents queries when offline
 *
 * Data Freshness Philosophy:
 * For a veterinary practice management system:
 * - Patient/client data changes moderately (5 min staleTime is good)
 * - Appointment data should be fresher (override with DYNAMIC)
 * - Medical records are mostly append-only (STANDARD is fine)
 * - Static data like breeds/medications can be cached longer (STATIC)
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Stale Time: 5 minutes - Data is considered fresh for this duration
      // During this time, queries won't refetch even on component remount
      staleTime: QUERY_STALE_TIME.STANDARD,

      // Cache Time: 10 minutes - Inactive data is garbage collected after this
      // Should be >= staleTime to prevent premature data removal
      gcTime: QUERY_CACHE_TIME.DEFAULT, // Note: gcTime replaces cacheTime in v5

      // Retry: 3 attempts with exponential backoff
      // Handles transient network issues and server hiccups
      retry: QUERY_RETRY.DEFAULT,

      // Retry delay with exponential backoff and jitter
      // Attempt 1: ~1000ms, Attempt 2: ~2000ms, Attempt 3: ~4000ms
      retryDelay: (attemptIndex: number) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch on window focus: DISABLED
      // Veterinary staff frequently switch between applications (email, phone, etc.)
      // Auto-refetching would cause unnecessary API load and UI disruptions
      refetchOnWindowFocus: false,

      // Refetch on reconnect: ENABLED
      // When internet connection is restored, fetch latest data
      refetchOnReconnect: true,

      // Refetch on mount: ENABLED (but only for stale data)
      // Combined with staleTime, this provides good balance
      refetchOnMount: true,

      // Network mode: online
      // Only fetch when online, prevent errors when offline
      networkMode: 'online',

      // Structure preserving: Keep referential equality when data hasn't changed
      // Prevents unnecessary re-renders
      structuralSharing: true,
    },
    mutations: {
      // Retry mutations once (conservative for data modification)
      retry: QUERY_RETRY.MINIMAL,

      // Network mode: online
      networkMode: 'online',

      // Retry delay for mutations (shorter than queries)
      retryDelay: 1000,
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Root element not found');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
      {/* React Query DevTools - Only in development */}
      {import.meta.env.DEV && (
        <ReactQueryDevtools
          initialIsOpen={false}
          position="bottom"
          buttonPosition="bottom-right"
        />
      )}
    </QueryClientProvider>
  </React.StrictMode>
);
