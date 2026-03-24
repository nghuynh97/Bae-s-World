'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { resetAndSeed } from '@/actions/seed';
import { toast } from 'sonner';

export function SeedButton({ show }: { show: boolean }) {
  const [loading, setLoading] = useState(false);

  if (!show) return null;

  async function handleClick() {
    const confirmed = window.confirm(
      'This will delete all portfolio items, beauty products, routines, and schedule jobs, then insert sample data. This cannot be undone.',
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const result = await resetAndSeed();
      if (result.success) {
        toast.success('Data reset and seeded successfully');
      } else {
        toast.error(result.message || 'Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mb-4">
      <Button
        variant="destructive"
        disabled={loading}
        onClick={handleClick}
      >
        {loading ? 'Seeding...' : 'Reset & Seed Data'}
      </Button>
    </div>
  );
}
