"use client";

import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { JobCard } from "./job-card";

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
  const jobLabel = jobCount === 1 ? "1 job" : `${jobCount} jobs`;

  return (
    <div className="mt-4 p-4 animate-in slide-in-from-top-2 duration-200">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <h3 className="text-sm font-bold font-body text-primary">
          {format(date, "EEEE, MMMM d, yyyy")}
        </h3>
        <span className="bg-muted rounded-full px-2 py-0.5 text-xs font-body text-secondary">
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
        <p className="text-sm font-body text-secondary text-center py-4">
          No jobs on this day. Tap + to add one.
        </p>
      )}

      {/* Add Job button */}
      <Button
        onClick={onAddJob}
        className="w-full mt-4 bg-accent text-white hover:bg-accent-hover"
      >
        Add Job
      </Button>
    </div>
  );
}
