'use client';

import { formatVND } from '@/lib/schedule/format-vnd';

interface StatGroup {
  totalPaid: number;
  totalPending: number;
  total: number;
}

interface StatsHeaderProps {
  monthStats: StatGroup;
  yearStats: StatGroup;
  monthLabel: string;
  yearLabel: string;
  weekJobCount?: number;
  weekRange?: string;
}

function StatCard({
  title,
  subLabel,
  stats,
}: {
  title: string;
  subLabel: string;
  stats: StatGroup;
}) {
  return (
    <div className="w-full min-w-[260px] flex-shrink-0 snap-start rounded-lg bg-white p-4 shadow-sm ring-1 ring-black/5 motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md sm:min-w-0">
      <p className="font-body text-xs text-muted-foreground">{title}</p>
      <p className="font-body text-xs text-muted-foreground">{subLabel}</p>
      <p className="mt-2 font-display text-[28px] font-bold text-foreground">
        {formatVND(stats.total)}
      </p>
      <p className="mt-1 font-body text-xs">
        <span className="text-[var(--color-paid)]">
          Paid: {formatVND(stats.totalPaid)}
        </span>
        <span className="text-muted-foreground"> | </span>
        <span className="text-[var(--color-pending)]">
          Pending: {formatVND(stats.totalPending)}
        </span>
      </p>
    </div>
  );
}

function JobCountCard({ count, weekRange }: { count: number; weekRange: string }) {
  return (
    <div className="w-full min-w-[260px] flex-shrink-0 snap-start rounded-lg bg-white p-4 shadow-sm ring-1 ring-black/5 motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md sm:min-w-0">
      <p className="font-body text-xs text-muted-foreground">This Week</p>
      <p className="font-body text-xs text-muted-foreground">{weekRange}</p>
      <p className="mt-2 font-display text-[28px] font-semibold text-foreground">
        {count}
      </p>
      <p className="mt-1 font-body text-xs text-muted-foreground">
        {count} upcoming jobs
      </p>
    </div>
  );
}

export function StatsHeader({
  monthStats,
  yearStats,
  monthLabel,
  yearLabel,
  weekJobCount,
  weekRange,
}: StatsHeaderProps) {
  return (
    <div className="flex-wrap flex snap-x gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible">
      <StatCard title="This Month" subLabel={monthLabel} stats={monthStats} />
      <StatCard title="This Year" subLabel={yearLabel} stats={yearStats} />
      {weekJobCount !== undefined && (
        <JobCountCard count={weekJobCount} weekRange={weekRange || ''} />
      )}
    </div>
  );
}
