import apiClient from "@/lib/apiClient";
import type {
  AdSummaryDto,
  BannerAdItem,
  CreateAdDto,
  UpdateAdDto,
  AdListQueryParams,
  PaginatedAdsResponse,
} from "@/types/adminAds";

// The API exposes POST /admin/ads and PATCH /admin/ads/:id as both
// multipart/form-data and application/json. We only pay the multipart cost
// when there is an actual file to send; otherwise plain JSON keeps arrays
// typed correctly on the wire.
function buildAdFormData(data: CreateAdDto | UpdateAdDto): FormData {
  const formData = new FormData();

  if (data.title !== undefined && data.title !== "") {
    formData.append("title", data.title);
  }
  if (data.adType !== undefined && data.adType !== "") {
    formData.append("adType", data.adType);
  }
  // Arrays go over the wire as repeated keys, matching the other multipart
  // admin endpoints (news, social impact).
  (data.targetAudience || []).forEach((v) =>
    formData.append("targetAudience", v),
  );
  (data.placement || []).forEach((v) => formData.append("placement", v));

  if (data.adImage instanceof File) {
    formData.append("adImage", data.adImage);
  } else if (data.adImageUrl !== undefined && data.adImageUrl !== "") {
    formData.append("adImageUrl", data.adImageUrl);
  }

  if (data.linkUrl !== undefined && data.linkUrl !== "") {
    formData.append("linkUrl", data.linkUrl);
  }
  if (data.startDate !== undefined && data.startDate !== "") {
    formData.append("startDate", data.startDate);
  }
  if (data.endDate !== undefined && data.endDate !== "") {
    formData.append("endDate", data.endDate);
  }
  if (data.status !== undefined && data.status !== "") {
    formData.append("status", data.status);
  }

  return formData;
}

function hasFile(data: CreateAdDto | UpdateAdDto): boolean {
  return data.adImage instanceof File;
}

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

  // 4. Create Ad (multipart when an image file is attached, JSON otherwise)
  createAd: (data: CreateAdDto) => {
    if (hasFile(data)) {
      return apiClient.post<BannerAdItem>("/admin/ads", buildAdFormData(data), {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }
    return apiClient.post<BannerAdItem>("/admin/ads", data);
  },

  // 5. Update Ad (multipart when an image file is attached, JSON otherwise)
  updateAd: (id: string, data: UpdateAdDto) => {
    if (hasFile(data)) {
      return apiClient.patch<BannerAdItem>(
        `/admin/ads/${id}`,
        buildAdFormData(data),
        { headers: { "Content-Type": "multipart/form-data" } },
      );
    }
    return apiClient.patch<BannerAdItem>(`/admin/ads/${id}`, data);
  },

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
