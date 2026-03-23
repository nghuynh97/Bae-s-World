'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoText } from './logo-text';

interface TopNavProps {
  isAuthenticated?: boolean;
  userName?: string;
  userMenu?: React.ReactNode;
}

export function TopNav({
  isAuthenticated = false,
  userName,
  userMenu,
}: TopNavProps) {
  const pathname = usePathname();

  const publicLinks = [
    { href: '/', label: 'Portfolio' },
  ];

  const mainLinks = [
    { href: '/', label: 'Portfolio' },
    { href: '/beauty', label: 'Beauty' },
    { href: '/schedule', label: 'Schedule' },
  ];

  const adminLinks = [
    { href: '/admin', label: 'Manage' },
  ];

  const links = isAuthenticated ? mainLinks : publicLinks;

  function NavLink({ href, label }: { href: string; label: string }) {
    const isActive = pathname === href;
    return (
      <Link
        href={href}
        className={`relative pb-1 text-sm font-normal transition-colors ${
          isActive
            ? 'border-b-2 border-accent text-text-primary'
            : 'text-text-secondary hover:text-text-primary'
        }`}
      >
        {label}
      </Link>
    );
  }

  return (
    <nav className="hidden h-16 w-full bg-surface shadow-sm md:flex">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-8">
        <Link href="/">
          <LogoText size="sm" />
        </Link>

        <div className="flex items-center gap-6">
          {links.map((link) => (
            <NavLink key={link.href} {...link} />
          ))}

          {isAuthenticated && (
            <>
              <div className="h-5 w-px bg-border" />
              {adminLinks.map((link) => (
                <NavLink key={link.href} {...link} />
              ))}
            </>
          )}

          {!isAuthenticated ? (
            <Link
              href="/login"
              className="rounded-[10px] bg-accent px-4 py-2 text-sm font-bold tracking-wider text-text-primary uppercase transition-colors hover:bg-accent-hover"
            >
              Sign In
            </Link>
          ) : userMenu ? (
            userMenu
          ) : (
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-text-primary">
              {userName?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
