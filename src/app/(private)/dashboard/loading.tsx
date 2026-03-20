import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoading() {
  return (
    <div className="py-8 md:py-12">
      <Skeleton className="mb-6 h-8 w-64 md:mb-8" />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-52 rounded-[16px]" />
        ))}
      </div>
    </div>
  );
}
