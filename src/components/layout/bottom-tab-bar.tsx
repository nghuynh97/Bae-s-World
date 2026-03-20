'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Image,
  Info,
  LogIn,
  Sparkles,
  CalendarDays,
  User,
  Settings,
} from 'lucide-react';

interface BottomTabBarProps {
  isAuthenticated?: boolean;
}

interface Tab {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export function BottomTabBar({ isAuthenticated = false }: BottomTabBarProps) {
  const pathname = usePathname();

  const publicTabs: Tab[] = [
    { href: '/', label: 'Portfolio', icon: Image },
    { href: '/about', label: 'About', icon: Info },
    { href: '/login', label: 'Sign In', icon: LogIn },
  ];

  const authTabs: Tab[] = [
    { href: '/dashboard', label: 'Dashboard', icon: User },
    { href: '/', label: 'Portfolio', icon: Image },
    { href: '/beauty', label: 'Beauty', icon: Sparkles },
    { href: '/schedule', label: 'Schedule', icon: CalendarDays },
    { href: '/admin/portfolio', label: 'Manage', icon: Settings },
  ];

  const tabs = isAuthenticated ? authTabs : publicTabs;

  return (
    <nav
      className="fixed right-0 bottom-0 left-0 z-50 h-14 bg-surface shadow-[0_-8px_24px_rgba(232,180,184,0.16)] md:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="flex h-full items-center justify-around">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href;
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center justify-center gap-0.5"
              aria-label={tab.label}
            >
              <div className="relative flex flex-col items-center">
                <Icon
                  size={24}
                  className={isActive ? 'text-accent' : 'text-text-secondary'}
                />
                {isActive && (
                  <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-accent" />
                )}
              </div>
              <span
                className={`text-sm font-normal ${
                  isActive ? 'text-accent' : 'text-text-secondary'
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
