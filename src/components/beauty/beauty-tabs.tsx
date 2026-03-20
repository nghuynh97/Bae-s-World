'use client';

import { useState, type ReactNode } from 'react';

interface BeautyTabsProps {
  productsContent: ReactNode;
  routinesContent: ReactNode;
}

export function BeautyTabs({
  productsContent,
  routinesContent,
}: BeautyTabsProps) {
  const [activeTab, setActiveTab] = useState<'products' | 'routines'>(
    'products',
  );

  return (
    <div>
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab('products')}
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
          onClick={() => setActiveTab('routines')}
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
