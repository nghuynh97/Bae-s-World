import { Skeleton } from "@/components/ui/skeleton";

export default function PortfolioLoading() {
  return (
    <div>
      {/* Heading skeleton */}
      <Skeleton className="h-8 w-48 mb-6 mt-8" />
      {/* Filter pills row */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-20 rounded-full" />
        ))}
      </div>
      {/* Masonry-like grid: 2 cols mobile, 3 cols desktop */}
      <div className="flex gap-4 mt-4">
        <div className="flex-1 flex flex-col gap-4">
          {[200, 280, 240].map((h, i) => (
            <Skeleton key={i} className="rounded-lg" style={{ height: `${h}px` }} />
          ))}
        </div>
        <div className="flex-1 flex flex-col gap-4">
          {[260, 220, 300].map((h, i) => (
            <Skeleton key={i} className="rounded-lg" style={{ height: `${h}px` }} />
          ))}
        </div>
        <div className="hidden md:flex flex-1 flex-col gap-4">
          {[240, 290, 230].map((h, i) => (
            <Skeleton key={i} className="rounded-lg" style={{ height: `${h}px` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
