import { AppCard } from "@/components/app";
import { Skeleton } from "@/components/ui/skeleton";

export function FolderCardSkeleton() {
  return (
    <AppCard hover={false} className="p-5">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-6 w-6 rounded-md" />
      </div>

      <Skeleton className="mt-3 h-4 w-1/2" />
    </AppCard>
  );
}

interface FolderGridSkeletonProps {
  count?: number;
}

export function FolderGridSkeleton({ count = 6 }: FolderGridSkeletonProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <FolderCardSkeleton key={i} />
      ))}
    </div>
  );
}
