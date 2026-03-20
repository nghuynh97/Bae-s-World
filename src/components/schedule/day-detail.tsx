'use client';

import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { JobCard } from './job-card';

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

interface DayDetailProps {
  date: Date;
  jobs: Job[];
  onAddJob: () => void;
  onEditJob: (jobId: string) => void;
}

export function DayDetail({ date, jobs, onAddJob, onEditJob }: DayDetailProps) {
  const jobCount = jobs.length;
  const jobLabel = jobCount === 1 ? '1 job' : `${jobCount} jobs`;

  return (
    <div className="mt-4 animate-in p-4 duration-200 slide-in-from-top-2">
      {/* Header */}
      <div className="mb-4 flex items-center gap-2">
        <h3 className="font-body text-sm font-bold text-primary">
          {format(date, 'EEEE, MMMM d, yyyy')}
        </h3>
        <span className="rounded-full bg-muted px-2 py-0.5 font-body text-xs text-secondary">
          {jobLabel}
        </span>
      </div>

      {/* Job list */}
      {jobs.length > 0 ? (
        <div className="flex flex-col gap-2">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} onEdit={onEditJob} />
          ))}
        </div>
      ) : (
        <p className="py-4 text-center font-body text-sm text-secondary">
          No jobs on this day. Tap + to add one.
        </p>
      )}

      {/* Add Job button */}
      <Button
        onClick={onAddJob}
        className="mt-4 w-full bg-accent text-white hover:bg-accent-hover"
      >
        Add Job
      </Button>
    </div>
  );
}
