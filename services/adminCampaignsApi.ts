import apiClient from "@/lib/apiClient";
import type {
  AdminCampaignSummaryResponseDto,
  CampaignListQueryParams,
  PaginatedCampaignsResponse,
} from "@/types/adminCampaigns";

export const adminCampaignsApi = {
  getSummary: () =>
    apiClient.get<AdminCampaignSummaryResponseDto>("/admin/campaigns/summary"),

  getCampaigns: (params?: CampaignListQueryParams) =>
    apiClient.get<PaginatedCampaignsResponse>("/admin/campaigns", { params }),
};
