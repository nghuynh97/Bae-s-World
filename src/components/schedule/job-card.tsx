'use client';

import { cn } from '@/lib/utils';
import { formatVND } from '@/lib/schedule/format-vnd';
import { MapPin } from 'lucide-react';

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
  const isPaid = job.status === 'paid';

  return (
    <button
      type="button"
      onClick={() => onEdit(job.id)}
      className="hover:bg-hover flex w-full rounded-[10px] bg-white p-4 text-left shadow-sm ring-1 ring-black/5 transition-colors active:scale-[0.97] motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md"
    >
      {/* Left color stripe */}
      <div
        className={cn(
          'mr-3 min-h-full w-1 flex-shrink-0 rounded-full',
          isPaid ? 'bg-[var(--color-paid)]' : 'bg-[var(--color-pending)]',
        )}
      />

      {/* Time range */}
      <div className="w-20 flex-shrink-0 font-body text-sm text-muted-foreground">
        {job.startTime} - {job.endTime}
      </div>

      {/* Main info */}
      <div className="mr-3 min-w-0 flex-1">
        <div className="truncate font-body text-sm font-bold text-foreground">
          {job.clientName}
        </div>
        <div className="flex items-center gap-1 font-body text-xs text-muted-foreground">
          <MapPin className="h-3 w-3 flex-shrink-0" />
          <span className="truncate">{job.location}</span>
        </div>
      </div>

      {/* Pay + status */}
      <div className="flex flex-shrink-0 flex-col items-end">
        <span className="font-body text-sm font-bold text-foreground">
          {formatVND(job.payAmount)}
        </span>
        <span
          className={cn(
            'mt-1 rounded-full px-2 py-0.5 font-body text-[10px]',
            isPaid
              ? 'bg-[var(--color-paid)]/15 text-[var(--color-paid)]'
              : 'bg-[var(--color-pending)]/15 text-[var(--color-pending)]',
          )}
        >
          {isPaid ? 'Paid' : 'Pending'}
        </span>
      </div>
    </button>
  );
}
