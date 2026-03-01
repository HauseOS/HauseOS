import type { Metadata } from 'next';
import './globals.css';

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
    <html lang="en">
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
