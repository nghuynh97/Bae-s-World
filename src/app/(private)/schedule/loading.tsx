import { Skeleton } from "@/components/ui/skeleton";

export default function ScheduleLoading() {
  return (
    <div className="space-y-6 p-4">
      {/* Stats header skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Skeleton className="h-20 w-full rounded-lg animate-pulse" />
        <Skeleton className="h-20 w-full rounded-lg animate-pulse" />
      </div>

      {/* Calendar header skeleton */}
      <div className="flex justify-center">
        <Skeleton className="h-8 w-48 rounded-md animate-pulse" />
      </div>

      {/* Calendar grid skeleton - 7x5 */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: 35 }).map((_, i) => (
          <Skeleton
            key={i}
            className="h-12 w-full rounded-sm animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
