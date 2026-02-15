// API Types
export * from './api';

// Entity Types
export * from './entities';

// Next.js Specific Types
export interface PageProps<
  TParams = Record<string, string>,
  TSearchParams = Record<string, string | string[] | undefined>
> {
  params: Promise<TParams>;
  searchParams: Promise<TSearchParams>;
}

export interface LayoutProps<TParams = Record<string, string>> {
  children: React.ReactNode;
  params: Promise<TParams>;
}

// Auth Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthSession {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}
