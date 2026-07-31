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
  getTopBrands: (params?: {
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

    return apiClient.get<TopBrandDto[]>("/admin/brands/top-brands", {
      params: queryParams,
    });
  },

  // 5. Industry Breakdown
  getIndustryBreakdown: (params?: {
    period?: string;
    year?: number;
    month?: number;
    startDate?: string;
    endDate?: string;
  }) =>
    apiClient.get<IndustryBreakdownDto[]>("/admin/brands/industry-breakdown", {
      params,
    }),

  // 6. Country Breakdown
  getCountryBreakdown: (params?: {
    period?: string;
    year?: number;
    month?: number;
    startDate?: string;
    endDate?: string;
  }) =>
    apiClient.get<CountryBreakdownDto[]>("/admin/brands/country-breakdown", {
      params,
    }),

  // 7. Analytics Combined Summary
  getAnalytics: () =>
    apiClient.get<Record<string, unknown>>("/admin/brands/analytics"),

  // 8. Brand Directory List with Filters & Pagination
  getBrands: (params?: BrandListQueryParams) => {
    const cleanParams: Record<string, unknown> = {};
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          cleanParams[key] = value;
        }
      });
    }
    return apiClient.get<PaginatedBrandsResponse>("/admin/brands", {
      params: cleanParams,
    });
  },

  // 9. Single Brand Profile Details & Metrics
  getBrandById: (id: string) =>
    apiClient.get<AdminBrandDetails>(`/admin/brands/${id}`),

  // 9b. Suspend & Reactivate Brand Account
  suspendBrand: (id: string) =>
    apiClient.patch<{ message: string }>(`/admin/users/${id}/suspend`),
  reactivateBrand: (id: string) =>
    apiClient.patch<{ message: string }>(`/admin/users/${id}/reactivate`),

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
