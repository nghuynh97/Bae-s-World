"use client";

import { cn } from "@/lib/utils";
import { formatVNDCompact } from "@/lib/schedule/format-vnd";

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
        "min-h-[44px] flex flex-col items-start p-1 bg-surface transition-colors",
        isCurrentMonth ? "cursor-pointer hover:bg-hover" : "cursor-default",
        isSelected && "bg-accent/10 border border-accent",
        isToday && "ring-2 ring-accent"
      )}
    >
      <span
        className={cn(
          "text-xs font-body",
          isCurrentMonth ? "text-primary" : "text-secondary/40",
          isToday && "font-bold"
        )}
      >
        {date.getDate()}
      </span>

      {jobs.length > 0 && (
        <>
          <div className="flex gap-1 mt-auto">
            {dots.map((job) => (
              <span
                key={job.id}
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  job.status === "paid"
                    ? "bg-[var(--color-paid)]"
                    : "bg-[var(--color-pending)]"
                )}
              />
            ))}
          </div>
          <span className="text-[10px] font-body text-secondary">
            {formatVNDCompact(totalIncome)}
          </span>
        </>
      )}
    </button>
  );
}
