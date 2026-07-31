import apiClient from "@/lib/apiClient";
import type {
  AdminCreatorSummaryResponseDto,
  SignupGrowthItemDto,
  ActiveUsersItemDto,
  TopCreatorDto,
  TierDistributionItemDto,
  GenderDistributionItemDto,
  NicheBreakdownItemDto,
  CountryBreakdownItemDto,
  CreatorListQueryParams,
  PaginatedCreatorsResponse,
  AdminCreatorDetails,
  CreatorCampaignHistoryItem,
  CreatorReviewItem,
  CreatorNoteItem,
} from "@/types/adminCreators";

export const adminCreatorsApi = {
  // 1. Summary & Completion Distribution
  getSummary: () =>
    apiClient.get<AdminCreatorSummaryResponseDto>("/admin/creators/summary"),

  // 2. Signup Growth
  getSignupGrowth: (params?: {
    period?: string;
    year?: number;
    month?: number;
  }) =>
    apiClient.get<SignupGrowthItemDto[]>("/admin/creators/signup-growth", {
      params,
    }),

  // 3. Active Users
  getActiveUsers: (params?: {
    period?: string;
    year?: number;
    month?: number;
  }) =>
    apiClient.get<ActiveUsersItemDto[]>("/admin/creators/active-users", {
      params,
    }),

  // 4. Top Creators
  getTopCreators: (params?: {
    startDate?: string;
    endDate?: string;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    period?: string;
    year?: number;
  }) => {
    const startDate = params?.startDate || params?.fromDate;
    const endDate = params?.endDate || params?.toDate;
    const queryParams: Record<string, unknown> = {};
    if (params?.limit) queryParams.limit = params.limit;
    if (params?.period) queryParams.period = params.period;
    if (params?.year) queryParams.year = params.year;
    if (startDate && startDate.trim() !== "") queryParams.startDate = startDate;
    if (endDate && endDate.trim() !== "") queryParams.endDate = endDate;

    return apiClient.get<TopCreatorDto[]>("/admin/creators/top-creators", {
      params: queryParams,
    });
  },

  // 5. Tier Distribution
  getTierDistribution: (params?: {
    period?: string;
    year?: number;
    month?: number;
    startDate?: string;
    endDate?: string;
  }) =>
    apiClient.get<TierDistributionItemDto[]>(
      "/admin/creators/tier-distribution",
      { params },
    ),

  // 6. Gender Distribution
  getGenderDistribution: (params?: {
    period?: string;
    year?: number;
    month?: number;
    startDate?: string;
    endDate?: string;
  }) =>
    apiClient.get<GenderDistributionItemDto[]>(
      "/admin/creators/gender-distribution",
      { params },
    ),

  // 7. Niche Breakdown
  getNicheBreakdown: (params?: {
    period?: string;
    year?: number;
    month?: number;
    startDate?: string;
    endDate?: string;
  }) =>
    apiClient.get<NicheBreakdownItemDto[]>("/admin/creators/niche-breakdown", {
      params,
    }),

  // 8. Country Breakdown
  getCountryBreakdown: () =>
    apiClient.get<CountryBreakdownItemDto[]>(
      "/admin/creators/country-breakdown",
    ),

  // 9. Analytics
  getAnalytics: () => apiClient.get("/admin/creators/analytics"),

  // 10. Paginated Creators Directory
  getCreators: (params?: CreatorListQueryParams) => {
    const cleanParams: Record<string, unknown> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          cleanParams[key] = value;
        }
      });
    }
    return apiClient.get<PaginatedCreatorsResponse>("/admin/creators", {
      params: cleanParams,
    });
  },

  // 11. Single Creator Details
  getCreatorDetails: (id: string) =>
    apiClient.get<AdminCreatorDetails>(`/admin/creators/${id}`),

  // 12. Campaign History
  getCreatorCampaignHistory: (
    id: string,
    params?: { page?: number; limit?: number },
  ) =>
    apiClient.get<{ data: CreatorCampaignHistoryItem[]; total: number }>(
      `/admin/creators/${id}/campaign-history`,
      { params },
    ),

  // 13. Reviews
  getCreatorReviews: (id: string) =>
    apiClient.get<CreatorReviewItem[]>(`/admin/creators/${id}/reviews`),

  // 14. Admin Notes List
  getCreatorNotes: (id: string) =>
    apiClient.get<CreatorNoteItem[]>(`/admin/creators/${id}/notes`),

  // 15. Create Note
  addCreatorNote: (id: string, payload: { note: string }) =>
    apiClient.post<CreatorNoteItem>(`/admin/creators/${id}/notes`, payload),

  // 16. Update Note
  updateCreatorNote: (id: string, noteId: string, payload: { note: string }) =>
    apiClient.patch<CreatorNoteItem>(
      `/admin/creators/${id}/notes/${noteId}`,
      payload,
    ),

  // 17. Delete Note
  deleteCreatorNote: (id: string, noteId: string) =>
    apiClient.delete(`/admin/creators/${id}/notes/${noteId}`),

  // 18. Suspend Account
  suspendCreatorAccount: (id: string, payload: { reason: string }) =>
    apiClient.patch<{ message?: string }>(
      `/admin/users/${id}/suspend`,
      payload,
    ),

  // 19. Suspend Campaign Access
  suspendCreatorCampaignAccess: (id: string, payload: { reason: string }) =>
    apiClient.patch<{ message?: string }>(`/admin/users/${id}/suspend`, {
      ...payload,
      scope: "campaign",
    }),

  // 20. Reactivate Account
  reactivateCreatorAccount: (id: string, payload: { reason: string }) =>
    apiClient.patch<{ message?: string }>(
      `/admin/users/${id}/reactivate`,
      payload,
    ),

  // 21. Change Creator Tier
  changeCreatorTier: (id: string, payload: { tier: string }) =>
    apiClient.patch<{ message?: string }>(`/admin/users/${id}`, payload),

  // 22. Delete Creator Account
  deleteCreatorAccount: (id: string, payload?: { reason?: string }) =>
    apiClient.delete<{ message?: string }>(`/admin/users/${id}`, {
      data: payload,
    }),
};
