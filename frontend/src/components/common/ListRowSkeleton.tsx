import { AppCard } from "@/components/app";
import { Skeleton } from "@/components/ui/skeleton";

export function ListRowSkeleton() {
  return (
    <AppCard hover={false} className="flex items-center gap-4 p-4">
      <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />

      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-2/5" />
        <Skeleton className="h-3 w-1/4" />
      </div>

      <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
    </AppCard>
  );
}

interface ListSkeletonProps {
  count?: number;
}

export function ListSkeleton({ count = 6 }: ListSkeletonProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <ListRowSkeleton key={i} />
      ))}
    </div>
  );
}
