import {
  getJobsForMonth,
  getIncomeStats,
  getYearlyStats,
  getWeekJobCount,
} from '@/actions/schedule';
import { CalendarHeader } from '@/components/schedule/calendar-header';
import { CalendarGrid } from '@/components/schedule/calendar-grid';
import { ScheduleEmpty } from '@/components/schedule/schedule-empty';
import { StatsHeader } from '@/components/schedule/stats-header';
import { IncomeChart } from '@/components/schedule/income-chart';

interface SchedulePageProps {
  searchParams: Promise<{ month?: string; year?: string }>;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const MONTH_SHORT = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

function getWeekOfMonth(dateStr: string): number {
  const day = parseInt(dateStr.split('-')[2], 10);
  return Math.min(Math.ceil(day / 7), 5);
}

export default async function SchedulePage({
  searchParams,
}: SchedulePageProps) {
  const params = await searchParams;
  const now = new Date();
  const year = params.year ? parseInt(params.year, 10) : now.getFullYear();
  const month = params.month ? parseInt(params.month, 10) : now.getMonth() + 1;

  const [jobs, monthStats, yearlyStats, weekData] = await Promise.all([
    getJobsForMonth(year, month),
    getIncomeStats(year, month),
    getYearlyStats(year),
    getWeekJobCount(),
  ]);

  // Compute year totals from yearlyStats
  const yearTotalPaid = yearlyStats.reduce((s, m) => s + m.totalPaid, 0);
  const yearTotalPending = yearlyStats.reduce((s, m) => s + m.totalPending, 0);

  // Compute monthly chart data: group jobs by week
  const weekMap: Record<string, { paid: number; pending: number }> = {};
  for (let w = 1; w <= 5; w++) {
    weekMap[`W${w}`] = { paid: 0, pending: 0 };
  }
  for (const job of jobs) {
    const week = getWeekOfMonth(job.jobDate);
    const key = `W${week}`;
    if (job.status === 'paid') {
      weekMap[key].paid += job.payAmount;
    } else {
      weekMap[key].pending += job.payAmount;
    }
  }
  const monthlyChartData = Object.entries(weekMap).map(([label, data]) => ({
    label,
    ...data,
  }));

  // Compute yearly chart data from yearlyStats
  const yearlyChartData = yearlyStats.map((m) => ({
    label: MONTH_SHORT[m.month - 1],
    paid: m.totalPaid,
    pending: m.totalPending,
  }));

  const monthLabel = `${MONTH_NAMES[month - 1]} ${year}`;
  const yearLabel = String(year);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-4 font-display text-2xl font-bold text-primary">
        Schedule
      </h1>

      <StatsHeader
        monthStats={monthStats}
        yearStats={{
          totalPaid: yearTotalPaid,
          totalPending: yearTotalPending,
          total: yearTotalPaid + yearTotalPending,
        }}
        monthLabel={monthLabel}
        yearLabel={yearLabel}
        weekJobCount={weekData.count}
        weekRange={`${weekData.weekStart} - ${weekData.weekEnd}`}
      />


      <CalendarHeader year={year} month={month} />
      <CalendarGrid jobs={jobs} year={year} month={month} />

      {jobs.length === 0 && <ScheduleEmpty />}

      <div className="mb-12" />

      <IncomeChart
        monthlyData={monthlyChartData}
        yearlyData={yearlyChartData}
      />
    </div>
  );
}
