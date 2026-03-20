'use client';

import dynamic from 'next/dynamic';

const IncomeChart = dynamic(() => import('./income-chart-inner'), {
  ssr: false,
  loading: () => (
    <div className="h-[280px] animate-pulse rounded-lg bg-surface p-6 shadow-sm" />
  ),
});

export { IncomeChart };
