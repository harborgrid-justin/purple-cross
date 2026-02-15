import { auth } from '@/lib/auth-utils';

/**
 * Dashboard Home Page
 * Main dashboard view
 */
export default async function DashboardPage() {
  const session = await auth();

  return (
    <div>
      <h1 className="mb-6 text-3xl font-bold text-gray-900">Dashboard</h1>
      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-gray-700">
          Welcome back, {session?.user.firstName} {session?.user.lastName}!
        </p>
        <p className="mt-2 text-sm text-gray-600">
          This is your Purple Cross Veterinary Practice Management dashboard.
        </p>
      </div>
    </div>
  );
}
