import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/lib/providers';
import { APP_INFO } from '@/constants';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: `${APP_INFO.NAME} - Veterinary Practice Management`,
    template: `%s | ${APP_INFO.NAME}`,
  },
  description: 'Modern veterinary practice management system built with Next.js and NestJS',
  keywords: ['veterinary', 'practice management', 'pet care', 'animal health'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.className}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
