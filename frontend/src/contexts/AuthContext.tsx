import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { api } from '../services/api';
import { STORAGE_KEYS } from '../constants';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  firstName?: string | null;
  lastName?: string | null;
  staffId?: string | null;
}

interface LoginResponse {
  data?: {
    user?: AuthUser;
    accessToken?: string;
    refreshToken?: string;
  };
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }): JSX.Element {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Hydrate from storage on first load. The access token is validated lazily
    // by the API client's 401/refresh interceptor on the first real request.
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<void> => {
    const resp = (await api.auth.login({ email, password })) as LoginResponse;
    const data = resp?.data;
    if (!data?.accessToken || !data.user) {
      throw new Error('Login failed');
    }
    localStorage.setItem(STORAGE_KEYS.TOKEN, data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
    }
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));
    setUser(data.user);
  }, []);

  const logout = useCallback(async (): Promise<void> => {
    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    if (refreshToken) {
      try {
        await api.auth.logout(refreshToken);
      } catch (err) {
        // Best-effort: a failed server-side revoke shouldn't block local logout.
        void err;
      }
    }
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    setUser(null);
  }, []);

  const hasRole = useCallback(
    (roles: string[]): boolean => {
      if (roles.length === 0) {
        return true;
      }
      return user != null && roles.includes(user.role);
    },
    [user]
  );

  const value: AuthContextValue = {
    user,
    isAuthenticated: user != null,
    isLoading,
    login,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
