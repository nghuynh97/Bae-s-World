'use client';

import { useState, type ReactNode } from 'react';

interface AdminTabsProps {
  portfolioContent: ReactNode;
  profileContent: ReactNode;
}

export function AdminTabs({
  portfolioContent,
  profileContent,
}: AdminTabsProps) {
  const [activeTab, setActiveTab] = useState<'portfolio' | 'profile'>(
    'portfolio',
  );

  return (
    <div>
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('portfolio')}
          className={`flex-1 py-3 text-center font-body text-base transition-colors ${
            activeTab === 'portfolio'
              ? 'border-b-2 border-accent font-bold text-primary'
              : 'text-text-secondary hover:text-primary'
          }`}
          role="tab"
          aria-selected={activeTab === 'portfolio'}
        >
          Portfolio
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-3 text-center font-body text-base transition-colors ${
            activeTab === 'profile'
              ? 'border-b-2 border-accent font-bold text-primary'
              : 'text-text-secondary hover:text-primary'
          }`}
          role="tab"
          aria-selected={activeTab === 'profile'}
        >
          Profile
        </button>
      </div>
      <div className="pt-6">
        {activeTab === 'portfolio' ? portfolioContent : profileContent}
      </div>
    </div>
  );
}
