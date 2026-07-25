export interface AdminCampaignBrandDto {
  id: string;
  name: string;
  logoUrl?: string | null;
}

export type AdminCampaignStatus =
  "DRAFT" | "LIVE" | "ACTIVE" | "COMPLETED" | "CANCELLED";

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
