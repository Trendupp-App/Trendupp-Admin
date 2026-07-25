import apiClient from "@/lib/apiClient";
import type {
  AdminCampaignActionResponse,
  AdminCampaignSummaryResponseDto,
  CampaignListQueryParams,
  PaginatedCampaignsResponse,
} from "@/types/adminCampaigns";

export const adminCampaignsApi = {
  getSummary: () =>
    apiClient.get<AdminCampaignSummaryResponseDto>("/admin/campaigns/summary"),

  getCampaigns: (params?: CampaignListQueryParams) =>
    apiClient.get<PaginatedCampaignsResponse>("/admin/campaigns", { params }),

  approveCampaign: (id: string) =>
    apiClient.patch<AdminCampaignActionResponse>(
      `/admin/campaigns/${id}/approve`,
    ),

  pauseCampaign: (id: string, reason?: string) =>
    apiClient.patch<AdminCampaignActionResponse>(
      `/admin/campaigns/${id}/pause`,
      reason ? { reason } : undefined,
    ),

  resumeCampaign: (id: string) =>
    apiClient.patch<AdminCampaignActionResponse>(
      `/admin/campaigns/${id}/resume`,
    ),

  cancelCampaign: (id: string, reason?: string) =>
    apiClient.patch<AdminCampaignActionResponse>(
      `/admin/campaigns/${id}/cancel`,
      reason ? { reason } : undefined,
    ),
};
