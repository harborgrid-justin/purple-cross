import NextAuth from 'next-auth';
import { authConfig } from './auth';

/**
 * NextAuth.js utilities
 * Export auth and signIn/signOut functions
 */

export const { auth, signIn, signOut, handlers } = NextAuth(authConfig);
