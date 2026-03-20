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

interface JobFormProps {
  date: Date;
  job?: Job;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function JobForm({ date, job, open, onOpenChange }: JobFormProps) {
  // Stub - will be fully implemented in Task 2
  return null;
}
