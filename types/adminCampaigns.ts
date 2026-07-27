export interface AdminCampaignBrandDto {
  id: string;
  name: string;
  logoUrl?: string | null;
}

export type AdminCampaignStatus =
  | "DRAFT"
  | "LIVE"
  | "ACTIVE"
  | "COMPLETED"
  | "CANCELLED";

export interface AdminCampaignListItemDto {
  id: string;
  displayId: string;
  title: string;
  brand: AdminCampaignBrandDto;
  budget: number;
  creatorTier: string;
  postingPlatform: string;
  applicationsCount: number;
  status: AdminCampaignStatus | string;
  escrowStatus: string;
  endDate: string | null;
  createdAt: string;
}

export interface PaginationMetaDto {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedCampaignsResponse {
  data: AdminCampaignListItemDto[];
  meta: PaginationMetaDto;
}

export interface AdminCampaignSummaryResponseDto {
  totalCampaigns: number;
  draft: number;
  live: number;
  active: number;
  completed: number;
  cancelled: number;
}

export interface AdminCampaignActionResponse {
  message: string;
}

export interface CampaignListQueryParams {
  q?: string;
  tab?: "all" | "draft" | "live" | "active" | "completed" | "cancelled";
  escrowStatus?: string;
  creatorTier?: string;
  platform?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface AdminCampaignSummaryDto {
  totalCampaigns: number;
  avgApplicantsPerCampaign: number;
  creatorsSelectedRate: number;
  totalCompleted: number;
  campaignCompletionRate: number;
}

export interface CampaignTierParticipationDto {
  tier: string;
  count: number;
  percentage: number;
}

export interface CampaignTypeDistributionDto {
  type: string;
  count: number;
  percentage: number;
}

export interface CampaignVolumeDto {
  label: string;
  draft: number;
  live: number;
  completed: number;
}

export interface IndustryBudgetDto {
  industry: string;
  budget: number;
  percentage: number;
}

export interface TrendItemDto {
  label: string;
  rate: number;
}

export interface AdminCampaignsSummaryResponseDto {
  summary: AdminCampaignSummaryDto;
  participationByTier?: CampaignTierParticipationDto[];
  campaignTypes?: CampaignTypeDistributionDto[];
  volume?: CampaignVolumeDto[];
  budgetByIndustry?: IndustryBudgetDto[];
  slaBreachTrend?: TrendItemDto[];
  revisionRateTrend?: TrendItemDto[];
  completionRateTrend?: TrendItemDto[];
}
