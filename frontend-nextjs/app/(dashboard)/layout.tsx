import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth-utils';
import type { LayoutProps } from '@/types';
import { ROUTES } from '@/constants';
import Navigation from '@/components/features/navigation';

/**
 * Dashboard Layout
 * Layout for authenticated dashboard pages
 */
export default async function DashboardLayout({ children }: LayoutProps) {
  const session = await auth();

  if (!session) {
    redirect(ROUTES.LOGIN);
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navigation user={session.user} />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
