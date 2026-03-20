import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

const dashboardCards = [
  {
    title: 'Portfolio',
    subtitle: 'Your public gallery',
    href: '/',
  },
  {
    title: 'Beauty Tracker',
    subtitle: 'Products and routines',
    href: '/beauty',
  },
  {
    title: 'Photo Journal',
    subtitle: 'Daily memories',
    href: '/journal',
  },
];

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const displayName = (user?.user_metadata?.display_name as string) || 'User';

  return (
    <div className="py-8 md:py-12">
      <h1 className="mb-6 font-display text-2xl font-bold text-text-primary md:mb-8">
        Welcome back, {displayName}
      </h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {dashboardCards.map((card) => (
          <Link key={card.href} href={card.href}>
            <Card className="rounded-[16px] bg-surface shadow-sm motion-safe:transition-all motion-safe:duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md">
              <CardContent className="p-6">
                <div className="mb-4 flex h-32 items-center justify-center rounded-[16px] border-2 border-dashed border-accent">
                  <span className="text-sm text-text-secondary">
                    Nothing here yet
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-normal text-text-primary">
                      {card.title}
                    </p>
                    <p className="text-sm font-normal text-text-secondary">
                      {card.subtitle}
                    </p>
                  </div>
                  <ChevronRight className="text-accent" size={20} />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
