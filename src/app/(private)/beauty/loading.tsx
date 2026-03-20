import { Skeleton } from '@/components/ui/skeleton';

export default function BeautyLoading() {
  return (
    <div className="px-4 pt-16 md:px-8">
      <Skeleton className="mb-6 h-7 w-24" />
      {/* Tab bar skeleton */}
      <div className="mb-12 flex border-b border-border">
        <Skeleton className="h-10 flex-1" />
        <Skeleton className="h-10 flex-1" />
      </div>
      {/* Filter pills skeleton */}
      <div className="mb-4 flex gap-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-full" />
        ))}
      </div>
      {/* Grid skeleton */}
      <div className="grid grid-cols-3 gap-2 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-md" />
        ))}
      </div>
    </div>
  );
}
