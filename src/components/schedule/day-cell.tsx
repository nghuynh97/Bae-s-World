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
        "min-h-[80px] flex flex-col items-start p-1.5 bg-surface border border-border/30 transition-colors",
        isCurrentMonth ? "cursor-pointer hover:bg-hover" : "cursor-default bg-muted/30",
        isSelected && "bg-accent/10 border-accent",
        isToday && "bg-accent/20 ring-2 ring-accent"
      )}
    >
      <span
        className={cn(
          "text-sm font-medium font-body",
          isCurrentMonth ? "text-foreground" : "text-muted-foreground/40",
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
                  "w-2 h-2 rounded-full",
                  job.status === "paid"
                    ? "bg-[var(--color-paid)]"
                    : "bg-[var(--color-pending)]"
                )}
              />
            ))}
          </div>
          <span className="text-xs font-medium font-body text-accent">
            {formatVNDCompact(totalIncome)}
          </span>
        </>
      )}
    </button>
  );
}
