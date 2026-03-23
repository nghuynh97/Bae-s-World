'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Image,
  LogIn,
  Sparkles,
  CalendarDays,
  Settings,
  LogOut,
} from 'lucide-react';
import { logout } from '@/actions/auth';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ButtonSpinner } from '@/components/ui/button-spinner';

interface BottomTabBarProps {
  isAuthenticated?: boolean;
  userName?: string;
}

interface Tab {
  href: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

export function BottomTabBar({
  isAuthenticated = false,
  userName,
}: BottomTabBarProps) {
  const pathname = usePathname();
  const [showLogout, setShowLogout] = useState(false);
  const [isPending, startTransition] = useTransition();

  const publicTabs: Tab[] = [
    { href: '/', label: 'Portfolio', icon: Image },
    { href: '/login', label: 'Sign In', icon: LogIn },
  ];

  const mainTabs: Tab[] = [
    { href: '/', label: 'Portfolio', icon: Image },
    { href: '/beauty', label: 'Beauty', icon: Sparkles },
    { href: '/schedule', label: 'Schedule', icon: CalendarDays },
    { href: '/admin', label: 'Manage', icon: Settings },
  ];

  const tabs = isAuthenticated ? mainTabs : publicTabs;

  function handleLogout() {
    startTransition(async () => {
      await logout();
    });
  }

  function TabLink({ tab }: { tab: Tab }) {
    const isActive =
      tab.href === '/'
        ? pathname === '/'
        : pathname.startsWith(tab.href);
    const Icon = tab.icon;
    return (
      <Link
        href={tab.href}
        className="flex flex-col items-center justify-center gap-0.5"
        aria-label={tab.label}
      >
        <div className="relative flex flex-col items-center">
          <Icon
            size={22}
            className={isActive ? 'text-accent' : 'text-text-secondary'}
          />
          {isActive && (
            <span className="absolute -bottom-1 h-1 w-1 rounded-full bg-accent" />
          )}
        </div>
        <span
          className={`text-[11px] font-normal ${
            isActive ? 'text-accent' : 'text-text-secondary'
          }`}
        >
          {tab.label}
        </span>
      </Link>
    );
  }

  return (
    <>
      <nav
        className="fixed right-0 bottom-0 left-0 z-50 h-14 bg-surface shadow-[0_-8px_24px_rgba(232,180,184,0.16)] md:hidden"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex h-full items-center justify-around">
          {tabs.map((tab) => (
            <TabLink key={tab.href} tab={tab} />
          ))}

          {isAuthenticated && (
            <button
              onClick={() => setShowLogout(true)}
              className="flex flex-col items-center justify-center gap-0.5"
              aria-label="Sign out"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-text-primary">
                {userName?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span className="text-[11px] font-normal text-text-secondary">
                Account
              </span>
            </button>
          )}
        </div>
      </nav>

      <Dialog open={showLogout} onOpenChange={setShowLogout}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Sign Out</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLogout(false)}>
              Stay Signed In
            </Button>
            <Button
              onClick={handleLogout}
              disabled={isPending}
              className="active:scale-[0.97]"
            >
              <span className="inline-flex items-center gap-2">
                {isPending && <ButtonSpinner />}
                {isPending ? 'Signing out...' : 'Sign Out'}
              </span>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
