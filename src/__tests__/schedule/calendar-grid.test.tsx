import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
  useSearchParams: () => new URLSearchParams(),
}));

// Mock server actions
vi.mock('@/actions/schedule', () => ({
  createJob: vi.fn(),
  updateJob: vi.fn(),
  deleteJob: vi.fn(),
  getJobsForMonth: vi.fn(),
}));

import { CalendarGrid } from '@/components/schedule/calendar-grid';

const mockJobs = [
  {
    id: '1',
    jobDate: new Date().toISOString().split('T')[0],
    clientName: 'Client A',
    location: 'Studio',
    startTime: '09:00',
    endTime: '12:00',
    payAmount: 5000000,
    status: 'paid',
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    jobDate: new Date().toISOString().split('T')[0],
    clientName: 'Client B',
    location: 'On-site',
    startTime: '14:00',
    endTime: '17:00',
    payAmount: 3000000,
    status: 'pending',
    notes: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

describe('CalendarGrid', () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  it('renders 7-column grid', () => {
    const { container } = render(
      <CalendarGrid jobs={[]} year={year} month={month} />,
    );
    const grid = container.querySelector('.grid-cols-7');
    expect(grid).toBeTruthy();
  });

  it('shows Monday-start weekday headers', () => {
    render(<CalendarGrid jobs={[]} year={year} month={month} />);
    const headers = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (const header of headers) {
      expect(screen.getAllByText(header).length).toBeGreaterThanOrEqual(1);
    }
  });

  it('highlights today with accent ring', () => {
    const { container } = render(
      <CalendarGrid jobs={[]} year={year} month={month} />,
    );
    const todayCell = container.querySelector('.ring-accent');
    expect(todayCell).toBeTruthy();
  });

  it('shows colored dots for jobs', () => {
    const { container } = render(
      <CalendarGrid jobs={mockJobs} year={year} month={month} />,
    );
    const paidDot = container.querySelector('[class*="color-paid"]');
    const pendingDot = container.querySelector('[class*="color-pending"]');
    expect(paidDot).toBeTruthy();
    expect(pendingDot).toBeTruthy();
  });
});
