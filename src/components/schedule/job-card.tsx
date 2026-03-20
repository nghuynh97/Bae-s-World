"use client";

import { cn } from "@/lib/utils";
import { formatVND } from "@/lib/schedule/format-vnd";
import { MapPin } from "lucide-react";

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

interface JobCardProps {
  job: Job;
  onEdit: (jobId: string) => void;
}

export function JobCard({ job, onEdit }: JobCardProps) {
  const isPaid = job.status === "paid";

  return (
    <button
      type="button"
      onClick={() => onEdit(job.id)}
      className="w-full flex bg-surface rounded-[10px] shadow-sm p-4 hover:bg-hover transition-colors text-left"
    >
      {/* Left color stripe */}
      <div
        className={cn(
          "w-1 min-h-full rounded-full mr-3 flex-shrink-0",
          isPaid
            ? "bg-[var(--color-paid)]"
            : "bg-[var(--color-pending)]"
        )}
      />

      {/* Time range */}
      <div className="w-20 flex-shrink-0 text-sm font-body text-secondary">
        {job.startTime} - {job.endTime}
      </div>

      {/* Main info */}
      <div className="flex-1 min-w-0 mr-3">
        <div className="text-sm font-bold font-body text-primary truncate">
          {job.clientName}
        </div>
        <div className="flex items-center gap-1 text-xs font-body text-secondary">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{job.location}</span>
        </div>
      </div>

      {/* Pay + status */}
      <div className="flex flex-col items-end flex-shrink-0">
        <span className="text-sm font-bold font-body text-primary">
          {formatVND(job.payAmount)}
        </span>
        <span
          className={cn(
            "text-[10px] font-body px-2 py-0.5 rounded-full mt-1",
            isPaid
              ? "bg-[var(--color-paid)]/15 text-[var(--color-paid)]"
              : "bg-[var(--color-pending)]/15 text-[var(--color-pending)]"
          )}
        >
          {isPaid ? "Paid" : "Pending"}
        </span>
      </div>
    </button>
  );
}
