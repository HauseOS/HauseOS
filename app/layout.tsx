import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Providers from './components/Providers';
import AppNav from './components/AppNav';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'HauseOS',
  description: 'Operational hub for Hause Collective',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans`} suppressHydrationWarning>
        <Providers>
          <AppNav />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
