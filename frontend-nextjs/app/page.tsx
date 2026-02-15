import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants';

/**
 * Home Page
 * Redirects to dashboard for authenticated users
 */
export default function HomePage() {
  redirect(ROUTES.DASHBOARD);
}
