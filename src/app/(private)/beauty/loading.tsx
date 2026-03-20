import { Skeleton } from "@/components/ui/skeleton";

export default function BeautyLoading() {
  return (
    <div className="px-4 md:px-8 pt-16">
      <Skeleton className="h-7 w-24 mb-6" />
      {/* Tab bar skeleton */}
      <div className="flex border-b border-border mb-12">
        <Skeleton className="flex-1 h-10" />
        <Skeleton className="flex-1 h-10" />
      </div>
      {/* Filter pills skeleton */}
      <div className="flex gap-2 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-full" />
        ))}
      </div>
      {/* Grid skeleton */}
      <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-md" />
        ))}
      </div>
    </div>
  );
}
