'use client';

import { type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';

interface BeautyTabsProps {
  productsContent: ReactNode;
  routinesContent: ReactNode;
}

export function BeautyTabs({
  productsContent,
  routinesContent,
}: BeautyTabsProps) {
  const pathname = usePathname();
  const router = useRouter();

  const activeTab = pathname === '/beauty/routines' ? 'routines' : 'products';

  const switchTab = (tab: 'products' | 'routines') => {
    const href = tab === 'routines' ? '/beauty/routines' : '/beauty/products';
    router.push(href, { scroll: false });
  };

  return (
    <div>
      <div className="flex border-b border-border">
        <button
          onClick={() => switchTab('products')}
          className={`flex-1 py-3 text-center font-body text-base transition-colors ${
            activeTab === 'products'
              ? 'border-b-2 border-accent font-bold text-primary'
              : 'text-text-secondary hover:text-primary'
          }`}
          role="tab"
          aria-selected={activeTab === 'products'}
        >
          Products
        </button>
        <button
          onClick={() => switchTab('routines')}
          className={`flex-1 py-3 text-center font-body text-base transition-colors ${
            activeTab === 'routines'
              ? 'border-b-2 border-accent font-bold text-primary'
              : 'text-text-secondary hover:text-primary'
          }`}
          role="tab"
          aria-selected={activeTab === 'routines'}
        >
          Routines
        </button>
      </div>
      <div className="pt-12">
        {activeTab === 'products' ? productsContent : routinesContent}
      </div>
    </div>
  );
}
