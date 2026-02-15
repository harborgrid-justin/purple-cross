import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { apiClient } from './api-client';
import { API_ENDPOINTS } from '@/constants';
import type { User, LoginCredentials } from '@/types';

/**
 * NextAuth.js v5 Configuration
 * Authentication configuration for Purple Cross
 */

interface AuthResponse {
  status: 'success';
  data: {
    user: User;
    accessToken: string;
    refreshToken?: string;
  };
}

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const loginData: LoginCredentials = {
            email: credentials.email as string,
            password: credentials.password as string,
          };

          // Call NestJS backend for authentication
          const response = await apiClient.post<AuthResponse>(
            API_ENDPOINTS.AUTH_LOGIN,
            loginData
          );

          if (response.status === 'success' && response.data) {
            const { user, accessToken, refreshToken } = response.data;

            return {
              id: user.id,
              email: user.email,
              name: `${user.firstName} ${user.lastName}`,
              firstName: user.firstName,
              lastName: user.lastName,
              role: user.role,
              accessToken,
              refreshToken,
            };
          }

          return null;
        } catch (error) {
          console.error('Authentication error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.accessToken = user.accessToken || '';
        token.refreshToken = user.refreshToken || '';
      }

      // Update session if needed
      if (trigger === 'update' && session) {
        token = { ...token, ...session };
      }

      return token;
    },
    async session({ session, token }) {
      // Add custom fields to session
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
          role: token.role as string,
          name: `${token.firstName} ${token.lastName}`,
          image: null,
          emailVerified: null,
        };
        session.accessToken = (token.accessToken as string) || '';
        session.refreshToken = (token.refreshToken as string) || '';
      }

      return session;
    },
  },
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env['NEXTAUTH_SECRET'] || 'development-secret-change-in-production',
};

// Extend the built-in session types
declare module 'next-auth' {
  interface Session {
    user: User;
    accessToken: string;
    refreshToken?: string;
  }

  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    accessToken?: string;
    refreshToken?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    accessToken: string;
    refreshToken?: string;
  }
}
