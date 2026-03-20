'use client';

import { cn } from '@/lib/utils';
import { formatVNDCompact } from '@/lib/schedule/format-vnd';

interface Job {
  id: string;
  jobDate: string;
  clientName: string;
  location: string;
  startTime: string;
  endTime: string;
  payAmount: number;
  status: string;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

interface DayCellProps {
  date: Date;
  jobs: Job[];
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  onSelect: (date: Date) => void;
}

export function DayCell({
  date,
  jobs,
  isCurrentMonth,
  isToday,
  isSelected,
  onSelect,
}: DayCellProps) {
  const totalIncome = jobs.reduce((sum, job) => sum + job.payAmount, 0);
  const dots = jobs.slice(0, 3);

  return (
    <button
      type="button"
      onClick={() => {
        if (isCurrentMonth) onSelect(date);
      }}
      className={cn(
        'flex min-h-[80px] flex-col items-start border border-border/30 bg-surface p-1.5 transition-colors',
        isCurrentMonth
          ? 'hover:bg-hover cursor-pointer'
          : 'cursor-default bg-muted/30',
        isSelected && 'border-accent bg-accent/10',
        isToday && 'bg-accent/20 ring-2 ring-accent',
      )}
    >
      <span
        className={cn(
          'font-body text-sm font-medium',
          isCurrentMonth ? 'text-foreground' : 'text-muted-foreground/40',
          isToday && 'font-bold',
        )}
      >
        {date.getDate()}
      </span>

      {jobs.length > 0 && (
        <>
          <div className="mt-auto flex gap-1">
            {dots.map((job) => (
              <span
                key={job.id}
                className={cn(
                  'h-2 w-2 rounded-full',
                  job.status === 'paid'
                    ? 'bg-[var(--color-paid)]'
                    : 'bg-[var(--color-pending)]',
                )}
              />
            ))}
          </div>
          <span className="font-body text-xs font-medium text-accent">
            {formatVNDCompact(totalIncome)}
          </span>
        </>
      )}
    </button>
  );
}
