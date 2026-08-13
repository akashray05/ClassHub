import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsCardSkeleton() {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="mt-3 h-8 w-1/2" />
        <Skeleton className="mt-3 h-3 w-1/3" />
      </CardContent>
    </Card>
  );
}
