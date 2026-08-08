import { useQuery } from "@tanstack/react-query";

import { getStorage } from "@/services/user";

export function useStorage() {
  return useQuery({
    queryKey: ["storage"],
    queryFn: getStorage,
    staleTime: 30_000,
  });
}
