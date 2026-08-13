import { useQuery } from "@tanstack/react-query";

import { getDashboardSummary } from "@/services/file";

export function useDashboardSummary() {
  return useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: getDashboardSummary,
    staleTime: 15_000,
  });
}
