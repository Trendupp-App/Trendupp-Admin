export interface AdSummaryDto {
  totalAdsActive?: number;
  totalActiveAds?: number;
  activeAds?: number;
  totalImpressions?: number | string;
  clickThroughRate?: number | string;
  adsExpiringSoon?: number;
  expiringSoon?: number;
}

export interface BannerAdItem {
  id: string;
  title: string;
  adType: "Banner" | "Sponsored" | "Announcement" | string;
  targetAudience: string[];
  placement: string[];
  adImageUrl: string;
  linkUrl?: string;
  startDate: string;
  endDate: string;
  status: "active" | "scheduled" | "paused" | "draft" | string;
  impressions?: number;
  clicks?: number;
  ctr?: number | string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateAdDto {
  title: string;
  adType: string;
  targetAudience: string[];
  placement: string[];
  adImageUrl: string;
  linkUrl?: string;
  startDate: string;
  endDate: string;
  status?: string;
}

export interface UpdateAdDto {
  title?: string;
  adType?: string;
  targetAudience?: string[];
  placement?: string[];
  adImageUrl?: string;
  linkUrl?: string;
  startDate?: string;
  endDate?: string;
  status?: string;
}

export interface AdListQueryParams {
  status?: string;
  placement?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedAdsResponse {
  data: BannerAdItem[];
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
