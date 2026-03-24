'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';

interface AdminTabsProps {
  portfolioContent: ReactNode;
  profileContent: ReactNode;
}

export function AdminTabs({
  portfolioContent,
  profileContent,
}: AdminTabsProps) {
  const pathname = usePathname();
  const activeTab = pathname.startsWith('/admin/profile')
    ? 'profile'
    : 'portfolio';

  return (
    <div>
      <div className="flex border-b border-border">
        <Link
          href="/admin"
          className={`flex-1 py-3 text-center font-body text-base transition-colors ${
            activeTab === 'portfolio'
              ? 'border-b-2 border-accent font-bold text-primary'
              : 'text-text-secondary hover:text-primary'
          }`}
          role="tab"
          aria-selected={activeTab === 'portfolio'}
        >
          Portfolio
        </Link>
        <Link
          href="/admin/profile"
          className={`flex-1 py-3 text-center font-body text-base transition-colors ${
            activeTab === 'profile'
              ? 'border-b-2 border-accent font-bold text-primary'
              : 'text-text-secondary hover:text-primary'
          }`}
          role="tab"
          aria-selected={activeTab === 'profile'}
        >
          Profile
        </Link>
      </div>
      <div className="pt-6">
        {activeTab === 'portfolio' ? portfolioContent : profileContent}
      </div>
    </div>
  );
}
