"use client";

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
  // Stub - will be fully implemented in Task 2
  return <div data-testid="day-detail" />;
}
