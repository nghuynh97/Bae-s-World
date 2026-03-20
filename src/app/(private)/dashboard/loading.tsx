import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="py-8 md:py-12">
      <Skeleton className="h-8 w-64 mb-6 md:mb-8" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-52 rounded-[16px]" />
        ))}
      </div>
    </div>
  );
}
