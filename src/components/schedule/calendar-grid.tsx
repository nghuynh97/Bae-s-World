"use client";

import { useState } from "react";
import { isSameDay, isSameMonth } from "date-fns";
import { getCalendarDays } from "@/lib/schedule/date-utils";
import { DayCell } from "./day-cell";
import { DayDetail } from "./day-detail";
import { JobForm } from "./job-form";

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

interface CalendarGridProps {
  jobs: Job[];
  year: number;
  month: number;
}

export function CalendarGrid({ jobs, year, month }: CalendarGridProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  const currentMonth = new Date(year, month - 1);
  const days = getCalendarDays(currentMonth);
  const today = new Date();

  // Group jobs by date for O(1) lookup
  const jobsByDate: Record<string, Job[]> = {};
  for (const job of jobs) {
    if (!jobsByDate[job.jobDate]) jobsByDate[job.jobDate] = [];
    jobsByDate[job.jobDate].push(job);
  }

  const formatDateKey = (date: Date): string => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const handleSelectDate = (date: Date) => {
    if (selectedDate && isSameDay(selectedDate, date)) {
      // Toggle off
      setSelectedDate(null);
      return;
    }

    setSelectedDate(date);
    const dateKey = formatDateKey(date);
    const dayJobs = jobsByDate[dateKey] || [];

    if (dayJobs.length === 0) {
      // Empty day - open add form
      setEditingJobId(null);
      setFormOpen(true);
    }
  };

  const handleAddJob = () => {
    setEditingJobId(null);
    setFormOpen(true);
  };

  const handleEditJob = (jobId: string) => {
    setEditingJobId(jobId);
    setFormOpen(true);
  };

  const selectedDateKey = selectedDate ? formatDateKey(selectedDate) : null;
  const selectedDayJobs = selectedDateKey ? jobsByDate[selectedDateKey] || [] : [];
  const editingJob = editingJobId
    ? jobs.find((j) => j.id === editingJobId) ?? undefined
    : undefined;

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="bg-white shadow-sm rounded-xl p-3">
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-1">
        {weekdays.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium font-body text-muted-foreground uppercase tracking-wider py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-[1px]">
        {days.map((date) => {
          const dateKey = formatDateKey(date);
          const dayJobs = jobsByDate[dateKey] || [];

          return (
            <DayCell
              key={dateKey}
              date={date}
              jobs={dayJobs}
              isCurrentMonth={isSameMonth(date, currentMonth)}
              isToday={isSameDay(date, today)}
              isSelected={selectedDate ? isSameDay(date, selectedDate) : false}
              onSelect={handleSelectDate}
            />
          );
        })}
      </div>

      {/* Day detail panel */}
      {selectedDate && selectedDayJobs.length > 0 && (
        <DayDetail
          date={selectedDate}
          jobs={selectedDayJobs}
          onAddJob={handleAddJob}
          onEditJob={handleEditJob}
        />
      )}

      {/* Job form sheet */}
      {selectedDate && (
        <JobForm
          key={selectedDate.toISOString()}
          date={selectedDate}
          job={editingJob}
          open={formOpen}
          onOpenChange={setFormOpen}
        />
      )}
    </div>
  );
}
