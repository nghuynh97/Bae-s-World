import { Skeleton } from '@/components/ui/skeleton';

export default function ScheduleLoading() {
  return (
    <div className="space-y-6 p-4">
      {/* Stats header skeletons */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Skeleton className="h-20 w-full animate-pulse rounded-lg" />
        <Skeleton className="h-20 w-full animate-pulse rounded-lg" />
      </div>

      {/* Calendar header skeleton */}
      <div className="flex justify-center">
        <Skeleton className="h-8 w-48 animate-pulse rounded-md" />
      </div>

      {/* Calendar grid skeleton - 7x5 */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton key={i} className="h-12 w-full animate-pulse rounded-sm" />
        ))}
      </div>
    </div>
  );
}
