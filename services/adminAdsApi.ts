import apiClient from "@/lib/apiClient";
import type {
  AdSummaryDto,
  BannerAdItem,
  CreateAdDto,
  UpdateAdDto,
  AdListQueryParams,
  PaginatedAdsResponse,
} from "@/types/adminAds";

export const adminAdsApi = {
  // 1. Get Summary Metrics
  getSummary: () => apiClient.get<AdSummaryDto>("/admin/ads/summary"),

  // 2. Get Ads List (Paginated & Filtered)
  getAds: (params?: AdListQueryParams) =>
    apiClient.get<BannerAdItem[] | PaginatedAdsResponse>("/admin/ads", {
      params,
    }),

  // 3. Get Single Ad Details
  getAdById: (id: string) => apiClient.get<BannerAdItem>(`/admin/ads/${id}`),

  // 4. Create Ad
  createAd: (data: CreateAdDto) =>
    apiClient.post<BannerAdItem>("/admin/ads", data),

  // 5. Update Ad
  updateAd: (id: string, data: UpdateAdDto) =>
    apiClient.patch<BannerAdItem>(`/admin/ads/${id}`, data),

  // 6. Archive Ad (removes it from the active list, keeps the record)
  archiveAd: (id: string) =>
    apiClient.patch<BannerAdItem>(`/admin/ads/${id}/archive`),

  // 7. Unarchive Ad (restores to draft status)
  unarchiveAd: (id: string) =>
    apiClient.patch<BannerAdItem>(`/admin/ads/${id}/unarchive`),

  // 8. Delete Ad
  deleteAd: (id: string) =>
    apiClient.delete<{ message?: string }>(`/admin/ads/${id}`),
};
