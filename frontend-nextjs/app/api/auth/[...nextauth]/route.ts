import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth';

/**
 * NextAuth.js API Route Handler
 * Handles all authentication routes
 */

const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
