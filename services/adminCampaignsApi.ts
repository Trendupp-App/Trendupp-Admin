import apiClient from "@/lib/apiClient";
import type {
  AdminCampaignActionResponse,
  AdminCampaignSummaryResponseDto,
  CampaignListQueryParams,
  PaginatedCampaignsResponse,
  AdminCampaignsSummaryResponseDto,
  CampaignTierParticipationDto,
  CampaignTypeDistributionDto,
  CampaignVolumeDto,
  IndustryBudgetDto,
  TrendItemDto,
} from "@/types/adminCampaigns";

export const adminCampaignsApi = {
  // Campaign Management
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

  resumeCampaign: (id: string, reason?: string) =>
    apiClient.patch<AdminCampaignActionResponse>(
      `/admin/campaigns/${id}/resume`,
      reason ? { reason } : undefined,
    ),

  cancelCampaign: (id: string, reason?: string) =>
    apiClient.patch<AdminCampaignActionResponse>(
      `/admin/campaigns/${id}/cancel`,
      reason ? { reason } : undefined,
    ),

  // Analytics Endpoints
  getAnalyticsSummary: () =>
    apiClient.get<AdminCampaignsSummaryResponseDto>(
      "/admin/campaigns/analytics/summary",
    ),

  getParticipationByTier: (params?: { startDate?: string; endDate?: string }) =>
    apiClient.get<CampaignTierParticipationDto[]>(
      "/admin/campaigns/analytics/participation-by-tier",
      { params },
    ),

  getCampaignTypes: (params?: { startDate?: string; endDate?: string }) =>
    apiClient.get<CampaignTypeDistributionDto[]>(
      "/admin/campaigns/analytics/campaign-types",
      { params },
    ),

  getVolume: (params?: { year?: number }) =>
    apiClient.get<CampaignVolumeDto[]>("/admin/campaigns/analytics/volume", {
      params,
    }),

  getBudgetByIndustry: (params?: { startDate?: string; endDate?: string }) =>
    apiClient.get<IndustryBudgetDto[]>(
      "/admin/campaigns/analytics/budget-by-industry",
      { params },
    ),

  getSlaBreachTrend: () =>
    apiClient.get<TrendItemDto[]>(
      "/admin/campaigns/analytics/sla-breach-trend",
    ),

  getRevisionRateTrend: () =>
    apiClient.get<TrendItemDto[]>(
      "/admin/campaigns/analytics/revision-rate-trend",
    ),

  getCompletionRateTrend: () =>
    apiClient.get<TrendItemDto[]>(
      "/admin/campaigns/analytics/completion-rate-trend",
    ),
};
