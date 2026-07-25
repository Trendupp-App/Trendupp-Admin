import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
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

function invalidateCampaignCaches(
  queryClient: ReturnType<typeof useQueryClient>,
  campaignId: string,
) {
  queryClient.invalidateQueries({ queryKey: ["campaign", campaignId] });
  queryClient.invalidateQueries({
    queryKey: ["campaign-activity-timeline", campaignId],
  });
  queryClient.invalidateQueries({ queryKey: ["admin-campaigns-list"] });
  queryClient.invalidateQueries({ queryKey: ["admin-campaigns-summary"] });
}

export function useApproveCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminCampaignsApi.approveCampaign(id),
    onSuccess: (res, id) => {
      invalidateCampaignCaches(queryClient, id);
      toast.success(res.data?.message || "Campaign approved");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to approve campaign");
    },
  });
}

export function usePauseCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminCampaignsApi.pauseCampaign(id, reason),
    onSuccess: (res, variables) => {
      invalidateCampaignCaches(queryClient, variables.id);
      toast.success(res.data?.message || "Campaign paused");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to pause campaign");
    },
  });
}

export function useResumeCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminCampaignsApi.resumeCampaign(id),
    onSuccess: (res, id) => {
      invalidateCampaignCaches(queryClient, id);
      toast.success(res.data?.message || "Campaign resumed");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to resume campaign");
    },
  });
}

export function useCancelCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminCampaignsApi.cancelCampaign(id, reason),
    onSuccess: (res, variables) => {
      invalidateCampaignCaches(queryClient, variables.id);
      toast.success(res.data?.message || "Campaign cancelled");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to cancel campaign");
    },
  });
}
