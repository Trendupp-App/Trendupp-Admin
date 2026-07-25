import apiClient from "@/lib/apiClient";
import type {
  CommissionTier,
  CreateCommissionTierDto,
  UpdateCommissionTierDto,
  CreatorNiche,
  CreateNicheDto,
  UpdateNicheDto,
  FaqItem,
  CreateFaqDto,
  UpdateFaqDto,
  FaqQueryParams,
  NewsCategory,
  CreateNewsCategoryDto,
  UpdateNewsCategoryDto,
  ContactInfo,
  ExternalLinks,
  ChangePasswordDto,
} from "@/types/adminSettings";

export const adminSettingsApi = {
  // 1. Get Commission Tiers
  getCommissions: () =>
    apiClient.get<CommissionTier[] | { data: CommissionTier[] }>(
      "/admin/settings/commissions",
    ),

  // 2. Create Commission Tier
  createCommissionTier: (data: CreateCommissionTierDto) =>
    apiClient.post<CommissionTier>("/admin/settings/commissions", data),

  // 3. Update Commission Tier
  updateCommissionTier: (id: string, data: UpdateCommissionTierDto) =>
    apiClient.patch<CommissionTier>(`/admin/settings/commissions/${id}`, data),

  // 4. Delete Commission Tier
  deleteCommissionTier: (id: string) =>
    apiClient.delete<{ message?: string }>(`/admin/settings/commissions/${id}`),

  // 5. Get Creator Niches
  getNiches: () =>
    apiClient.get<CreatorNiche[] | { data: CreatorNiche[] }>(
      "/admin/settings/niches",
    ),

  // 6. Create Creator Niche
  createNiche: (data: CreateNicheDto) =>
    apiClient.post<CreatorNiche>("/admin/settings/niches", data),

  // 7. Update Creator Niche
  updateNiche: (id: string, data: UpdateNicheDto) =>
    apiClient.patch<CreatorNiche>(`/admin/settings/niches/${id}`, data),

  // 8. Delete Creator Niche
  deleteNiche: (id: string) =>
    apiClient.delete<{ message?: string }>(`/admin/settings/niches/${id}`),

  // 9. Get FAQs
  getFaqs: (params?: FaqQueryParams) =>
    apiClient.get<FaqItem[] | { data: FaqItem[] }>("/admin/settings/faqs", {
      params,
    }),

  // 10. Create FAQ
  createFaq: (data: CreateFaqDto) =>
    apiClient.post<FaqItem>("/admin/settings/faqs", data),

  // 11. Update FAQ
  updateFaq: (id: string, data: UpdateFaqDto) =>
    apiClient.patch<FaqItem>(`/admin/settings/faqs/${id}`, data),

  // 12. Delete FAQ
  deleteFaq: (id: string) =>
    apiClient.delete<{ message?: string }>(`/admin/settings/faqs/${id}`),

  // 13. News Categories
  getNewsCategories: () =>
    apiClient.get<NewsCategory[] | { data: NewsCategory[] }>(
      "/admin/settings/news-categories",
    ),
  createNewsCategory: (data: CreateNewsCategoryDto) =>
    apiClient.post<NewsCategory>("/admin/settings/news-categories", data),
  updateNewsCategory: (id: string, data: UpdateNewsCategoryDto) =>
    apiClient.patch<NewsCategory>(
      `/admin/settings/news-categories/${id}`,
      data,
    ),
  deleteNewsCategory: (id: string) =>
    apiClient.delete<{ message?: string }>(
      `/admin/settings/news-categories/${id}`,
    ),

  // 14. Contact Info
  getContactInfo: () =>
    apiClient.get<ContactInfo | { data: ContactInfo }>(
      "/admin/settings/contact-info",
    ),
  updateContactInfo: (data: ContactInfo) =>
    apiClient.put<ContactInfo>("/admin/settings/contact-info", data),

  // 15. External Links
  getExternalLinks: () =>
    apiClient.get<ExternalLinks | { data: ExternalLinks }>(
      "/admin/settings/external-links",
    ),
  updateExternalLinks: (data: ExternalLinks) =>
    apiClient.put<ExternalLinks>("/admin/settings/external-links", data),

  // 16. Change Password
  changePassword: (data: ChangePasswordDto) =>
    apiClient.post<{ message?: string }>(
      "/admin/settings/change-password",
      data,
    ),
};
