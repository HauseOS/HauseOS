'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/' },
  { label: 'Content', href: '/content' },
  { label: 'Partnerships', href: '/partnerships' },
  { label: 'Editorial', href: '/editorial' },
  { label: 'Projects', href: '/projects' },
];

export default function AppNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="sticky top-0 z-50 border-b"
      style={{
        background: 'var(--bg-surface)',
        borderColor: 'var(--border-default)',
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span
              className="text-lg font-bold tracking-tight"
              style={{ color: 'var(--text-primary)' }}
            >
              Hause<span style={{ color: 'var(--accent-primary)' }}>OS</span>
            </span>
          </Link>

          {/* Nav Items */}
          <div className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative px-3 py-2 text-sm font-medium rounded-lg transition-colors"
                  style={{
                    color: active
                      ? 'var(--accent-primary)'
                      : 'var(--text-secondary)',
                  }}
                >
                  {item.label}
                  {active && (
                    <span
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full"
                      style={{
                        background: 'var(--accent-primary)',
                        boxShadow: 'var(--glow-red-subtle)',
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Theme Toggle */}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
