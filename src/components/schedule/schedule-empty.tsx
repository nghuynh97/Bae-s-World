import { CalendarDays } from "lucide-react";

export function ScheduleEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <CalendarDays className="h-12 w-12 text-accent" />
      <h3 className="font-display text-xl font-bold text-primary">
        No jobs yet
      </h3>
      <p className="text-sm font-body text-secondary">
        Tap a date to add your first job.
      </p>
    </div>
  );
}
