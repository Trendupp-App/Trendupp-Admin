import { useQuery } from "@tanstack/react-query";
import { campaignApi } from "@/services/campaignApi";

export function useCampaign(id: string | null) {
  return useQuery({
    queryKey: ["campaign", id],
    queryFn: () => campaignApi.getCampaign(id!).then((r) => r.data),
    enabled: !!id,
    staleTime: 0,
  });
}
