import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers';

export const metadata: Metadata = {
  title: 'myRestro Manager — Manage your Restaurant Digitally',
  description: 'A premium digital restaurant management platform — orders, kitchen, billing, staff & more.',
  keywords: ['restaurant', 'POS', 'order management', 'digital restaurant', 'kitchen display', 'myRestro'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-[#0a0a16]" suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
