'use client';

import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CalendarHeaderProps {
  year: number;
  month: number;
}

export function CalendarHeader({ year, month }: CalendarHeaderProps) {
  const router = useRouter();
  const now = new Date();
  const isCurrentMonth =
    year === now.getFullYear() && month === now.getMonth() + 1;

  const displayDate = new Date(year, month - 1);

  const navigate = (newYear: number, newMonth: number) => {
    if (newMonth < 1) {
      newMonth = 12;
      newYear -= 1;
    } else if (newMonth > 12) {
      newMonth = 1;
      newYear += 1;
    }
    router.push(`/schedule?month=${newMonth}&year=${newYear}`);
  };

  const goToToday = () => {
    const today = new Date();
    router.push(
      `/schedule?month=${today.getMonth() + 1}&year=${today.getFullYear()}`,
    );
  };

  return (
    <div className="flex items-center justify-between py-4">
      <Button
        variant="ghost"
        size="icon"
        className="h-11 w-11"
        onClick={() => navigate(year, month - 1)}
      >
        <ChevronLeft className="h-6 w-6" />
      </Button>

      <div className="text-center">
        <h2 className="font-display text-xl font-bold text-primary">
          {format(displayDate, 'MMMM yyyy')}
        </h2>
        {!isCurrentMonth && (
          <button
            type="button"
            onClick={goToToday}
            className="mt-1 font-body text-xs text-accent hover:text-accent-hover"
          >
            Today
          </button>
        )}
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-11 w-11"
        onClick={() => navigate(year, month + 1)}
      >
        <ChevronRight className="h-6 w-6" />
      </Button>
    </div>
  );
}
