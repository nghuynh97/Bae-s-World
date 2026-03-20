import { describe, it, expect } from 'vitest';
import { getCalendarDays } from '@/lib/schedule/date-utils';

describe('getCalendarDays', () => {
  it('returns array starting Monday for March 2026', () => {
    const days = getCalendarDays(new Date(2026, 2, 1)); // March 2026
    // March 1, 2026 is a Sunday. Monday-start week means grid starts Mon Feb 23.
    expect(days[0].getFullYear()).toBe(2026);
    expect(days[0].getMonth()).toBe(1); // February
    expect(days[0].getDate()).toBe(23);
    // Day of week: 0=Sun, 1=Mon
    expect(days[0].getDay()).toBe(1); // Monday
  });

  it('ends on a Sunday for March 2026', () => {
    const days = getCalendarDays(new Date(2026, 2, 1));
    const lastDay = days[days.length - 1];
    expect(lastDay.getDay()).toBe(0); // Sunday
  });

  it('returns length divisible by 7', () => {
    const days = getCalendarDays(new Date(2026, 2, 1));
    expect(days.length % 7).toBe(0);
  });

  it('returns length divisible by 7 for any month', () => {
    // Test several months
    for (let m = 0; m < 12; m++) {
      const days = getCalendarDays(new Date(2026, m, 1));
      expect(days.length % 7).toBe(0);
    }
  });

  it('always starts on Monday', () => {
    for (let m = 0; m < 12; m++) {
      const days = getCalendarDays(new Date(2026, m, 1));
      expect(days[0].getDay()).toBe(1); // Monday
    }
  });

  it('includes all days of the target month', () => {
    const days = getCalendarDays(new Date(2026, 1, 1)); // February 2026
    // February 2026 has 28 days
    const febDays = days.filter(
      (d) => d.getMonth() === 1 && d.getFullYear() === 2026,
    );
    expect(febDays.length).toBe(28);
  });
});
