import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";

/**
 * Get all calendar days for a month grid, padded to full weeks starting Monday.
 * Returns an array of Date objects where length is always divisible by 7.
 */
export function getCalendarDays(currentMonth: Date): Date[] {
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
}
