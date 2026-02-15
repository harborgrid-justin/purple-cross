import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants';

/**
 * Register Page
 * User registration (disabled - admin only)
 */
export default function RegisterPage() {
  // Registration is admin-only, redirect to login
  redirect(ROUTES.LOGIN);
}
