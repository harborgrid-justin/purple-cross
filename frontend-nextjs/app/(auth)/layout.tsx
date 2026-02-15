import type { LayoutProps } from '@/types';
import { APP_INFO } from '@/constants';

/**
 * Auth Layout
 * Layout for authentication pages (login, register)
 */
export default async function AuthLayout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-primary-600">{APP_INFO.NAME}</h1>
          <p className="mt-2 text-gray-600">Veterinary Practice Management</p>
        </div>
        <div className="rounded-lg bg-white p-8 shadow-md">{children}</div>
      </div>
    </div>
  );
}
