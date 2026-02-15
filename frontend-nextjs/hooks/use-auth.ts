'use client';

import { useSession } from 'next-auth/react';

/**
 * Custom hook for authentication
 * Provides easy access to session data and auth state
 */
export function useAuth() {
  const { data: session, status } = useSession();

  return {
    user: session?.user,
    accessToken: session?.accessToken,
    isAuthenticated: !!session,
    isLoading: status === 'loading',
    status,
  };
}
