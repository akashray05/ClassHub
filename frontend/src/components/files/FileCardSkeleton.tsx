import { AppCard } from "@/components/app";
import { Skeleton } from "@/components/ui/skeleton";

export function FileCardSkeleton() {
  return (
    <AppCard hover={false} className="flex items-center gap-3 p-4">
      <Skeleton className="h-10 w-10 shrink-0 rounded-lg" />

      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
      </div>

      <Skeleton className="h-8 w-8 shrink-0 rounded-md" />
    </AppCard>
  );
}

interface FileGridSkeletonProps {
  count?: number;
}

export function FileGridSkeleton({ count = 6 }: FileGridSkeletonProps) {
  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <FileCardSkeleton key={i} />
      ))}
    </div>
  );
}
