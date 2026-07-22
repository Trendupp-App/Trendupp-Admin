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
  getActiveUsers: (params?: { period?: string }) =>
    apiClient.get<ActiveUsersItemDto[]>("/admin/creators/active-users", {
      params,
    }),

  // 4. Top Creators
  getTopCreators: () =>
    apiClient.get<TopCreatorDto[]>("/admin/creators/top-creators"),

  // 5. Tier Distribution
  getTierDistribution: () =>
    apiClient.get<TierDistributionItemDto[]>(
      "/admin/creators/tier-distribution",
    ),

  // 6. Gender Distribution
  getGenderDistribution: () =>
    apiClient.get<GenderDistributionItemDto[]>(
      "/admin/creators/gender-distribution",
    ),

  // 7. Niche Breakdown
  getNicheBreakdown: () =>
    apiClient.get<NicheBreakdownItemDto[]>("/admin/creators/niche-breakdown"),

  // 8. Country Breakdown
  getCountryBreakdown: () =>
    apiClient.get<CountryBreakdownItemDto[]>(
      "/admin/creators/country-breakdown",
    ),

  // 9. Analytics
  getAnalytics: () => apiClient.get("/admin/creators/analytics"),

  // 10. Paginated Creators Directory
  getCreators: (params?: CreatorListQueryParams) =>
    apiClient.get<PaginatedCreatorsResponse>("/admin/creators", { params }),

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
};
