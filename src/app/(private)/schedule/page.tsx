import { getJobsForMonth } from "@/actions/schedule";
import { CalendarHeader } from "@/components/schedule/calendar-header";
import { CalendarGrid } from "@/components/schedule/calendar-grid";
import { ScheduleEmpty } from "@/components/schedule/schedule-empty";

interface SchedulePageProps {
  searchParams: Promise<{ month?: string; year?: string }>;
}

export default async function SchedulePage({ searchParams }: SchedulePageProps) {
  const params = await searchParams;
  const now = new Date();
  const year = params.year ? parseInt(params.year, 10) : now.getFullYear();
  const month = params.month ? parseInt(params.month, 10) : now.getMonth() + 1;

  const jobs = await getJobsForMonth(year, month);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="font-display text-2xl font-bold text-primary mb-4">
        Schedule
      </h1>

      {/* Stats header placeholder (Plan 03) */}
      <div />

      <CalendarHeader year={year} month={month} />
      <CalendarGrid jobs={jobs} year={year} month={month} />

      {jobs.length === 0 && <ScheduleEmpty />}
    </div>
  );
}
