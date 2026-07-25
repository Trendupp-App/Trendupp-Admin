import { useQuery } from "@tanstack/react-query";
import { adminCampaignsApi } from "@/services/adminCampaignsApi";
import type { CampaignListQueryParams } from "@/types/adminCampaigns";

export function useAdminCampaignsSummary(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-campaigns-summary"],
    queryFn: () => adminCampaignsApi.getSummary().then((r) => r.data),
    staleTime: 1000 * 60 * 2,
    enabled,
  });
}

export function useAdminCampaignsList(
  params?: CampaignListQueryParams,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-campaigns-list", params],
    queryFn: () => adminCampaignsApi.getCampaigns(params).then((r) => r.data),
    staleTime: 1000 * 30,
    enabled,
  });
}
