import { useQuery } from "@tanstack/react-query";
import { adminOverviewApi } from "@/services/adminOverviewApi";

export function useAdminOverview(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-overview"],
    queryFn: () => adminOverviewApi.getOverview().then((res) => res.data),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
    enabled,
  });
}
