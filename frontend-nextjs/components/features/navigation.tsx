'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'next-auth/react';
import type { User } from '@/types';
import { ROUTES, APP_INFO } from '@/constants';

interface NavigationProps {
  user: User;
}

const navItems = [
  { name: 'Dashboard', href: ROUTES.DASHBOARD },
  { name: 'Patients', href: ROUTES.PATIENTS },
  { name: 'Clients', href: ROUTES.CLIENTS },
  { name: 'Appointments', href: ROUTES.APPOINTMENTS },
  { name: 'Staff', href: ROUTES.STAFF },
];

export default function Navigation({ user }: NavigationProps) {
  const pathname = usePathname();

  const handleSignOut = () => {
    signOut({ callbackUrl: ROUTES.LOGIN });
  };

  return (
    <aside className="w-64 bg-white shadow-md">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary-600">{APP_INFO.NAME}</h1>
        <p className="text-sm text-gray-600">v{APP_INFO.VERSION}</p>
      </div>

      <nav className="mt-6">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`block px-6 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-64 border-t border-gray-200 p-6">
        <div className="mb-4">
          <p className="text-sm font-medium text-gray-900">
            {user.firstName} {user.lastName}
          </p>
          <p className="text-xs text-gray-600">{user.email}</p>
          <p className="text-xs text-gray-500">{user.role}</p>
        </div>
        <button
          onClick={handleSignOut}
          className="w-full rounded-md bg-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
