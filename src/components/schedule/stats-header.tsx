"use client";

import { formatVND } from "@/lib/schedule/format-vnd";

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
    <div className="bg-surface rounded-lg shadow-sm p-6 min-w-[260px] snap-start flex-shrink-0 sm:min-w-0 motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:shadow-md motion-safe:hover:-translate-y-0.5">
      <p className="text-xs font-body text-text-secondary">{title}</p>
      <p className="text-xs font-body text-text-secondary">{subLabel}</p>
      <p className="font-display text-[28px] font-bold text-primary mt-2">
        {formatVND(stats.total)}
      </p>
      <p className="text-xs font-body mt-1">
        <span className="text-[var(--color-paid)]">
          Paid: {formatVND(stats.totalPaid)}
        </span>
        <span className="text-text-secondary"> | </span>
        <span className="text-[var(--color-pending)]">
          Pending: {formatVND(stats.totalPending)}
        </span>
      </p>
    </div>
  );
}

export function StatsHeader({
  monthStats,
  yearStats,
  monthLabel,
  yearLabel,
}: StatsHeaderProps) {
  return (
    <div className="flex overflow-x-auto snap-x gap-4 sm:grid sm:grid-cols-2 sm:overflow-visible pb-2">
      <StatCard title="This Month" subLabel={monthLabel} stats={monthStats} />
      <StatCard title="This Year" subLabel={yearLabel} stats={yearStats} />
    </div>
  );
}
