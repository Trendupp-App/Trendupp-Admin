import apiClient from "@/lib/apiClient";
import type {
  AdminBrandSummaryResponseDto,
  BrandSignupGrowthDto,
  BrandActiveUsersDto,
  TopBrandDto,
  IndustryBreakdownDto,
  CountryBreakdownDto,
  BrandListQueryParams,
  PaginatedBrandsResponse,
  AdminBrandDetails,
  BrandCampaignHistoryItem,
  BrandNoteItem,
} from "@/types/adminBrands";

export const adminBrandsApi = {
  // 1. Summary & Profile Completion Stage Distribution
  getSummary: () =>
    apiClient.get<AdminBrandSummaryResponseDto>("/admin/brands/summary"),

  // 2. Signup Growth
  getSignupGrowth: (params?: {
    period?: string;
    year?: number;
    month?: number;
  }) =>
    apiClient.get<BrandSignupGrowthDto[]>("/admin/brands/signup-growth", {
      params,
    }),

  // 3. Active Users
  getActiveUsers: (params?: {
    period?: string;
    year?: number;
    month?: number;
  }) =>
    apiClient.get<BrandActiveUsersDto[]>("/admin/brands/active-users", {
      params,
    }),

  // 4. Top Brands
  getTopBrands: () => apiClient.get<TopBrandDto[]>("/admin/brands/top-brands"),

  // 5. Industry Breakdown
  getIndustryBreakdown: () =>
    apiClient.get<IndustryBreakdownDto[]>("/admin/brands/industry-breakdown"),

  // 6. Country Breakdown
  getCountryBreakdown: () =>
    apiClient.get<CountryBreakdownDto[]>("/admin/brands/country-breakdown"),

  // 7. Analytics Combined Summary
  getAnalytics: () =>
    apiClient.get<Record<string, unknown>>("/admin/brands/analytics"),

  // 8. Brand Directory List with Filters & Pagination
  getBrands: (params?: BrandListQueryParams) =>
    apiClient.get<PaginatedBrandsResponse>("/admin/brands", { params }),

  // 9. Single Brand Profile Details & Metrics
  getBrandById: (id: string) =>
    apiClient.get<AdminBrandDetails>(`/admin/brands/${id}`),

  // 10. Brand Campaign History
  getBrandCampaignHistory: (id: string, page = 1, limit = 10) =>
    apiClient.get<{
      data: BrandCampaignHistoryItem[];
      meta?: { total: number };
    }>(`/admin/brands/${id}/campaign-history`, {
      params: { page, limit },
    }),

  // 11. Notes - Fetch
  getNotes: (id: string) =>
    apiClient.get<BrandNoteItem[]>(`/admin/brands/${id}/notes`),

  // 12. Notes - Add
  addNote: (id: string, note: string) =>
    apiClient.post<BrandNoteItem>(`/admin/brands/${id}/notes`, { note }),

  // 13. Notes - Update
  updateNote: (id: string, noteId: string, note: string) =>
    apiClient.patch<BrandNoteItem>(`/admin/brands/${id}/notes/${noteId}`, {
      note,
    }),

  // 14. Notes - Delete
  deleteNote: (id: string, noteId: string) =>
    apiClient.delete(`/admin/brands/${id}/notes/${noteId}`),
};
