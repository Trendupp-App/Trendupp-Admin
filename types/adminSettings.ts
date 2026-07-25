export interface CommissionTierBrand {
  id: string;
  brandName?: string;
  name?: string;
  logoUrl?: string | null;
  currentRate?: number;
}

export interface CommissionTier {
  id: string;
  name: string;
  ratePercentage: number;
  isDefault: boolean;
  reason?: string;
  brandIds?: string[];
  brands?: CommissionTierBrand[];
  appliedBrandsCount?: number;
  appliedCount?: number;
  lastUpdatedBy?: string;
  lastUpdatedDate?: string;
  updatedAt?: string;
  createdAt?: string;
}

export interface CreateCommissionTierDto {
  name: string;
  ratePercentage: number;
  isDefault?: boolean;
  reason?: string;
  brandIds?: string[];
}

export interface UpdateCommissionTierDto {
  name?: string;
  ratePercentage?: number;
  isDefault?: boolean;
  reason?: string;
  brandIds?: string[];
}

export interface CreatorNiche {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNicheDto {
  name: string;
}

export interface UpdateNicheDto {
  name: string;
}

export type FaqStatus = "published" | "draft" | (string & {});

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
  status: FaqStatus;
  sortOrder?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateFaqDto {
  question: string;
  answer: string;
  category: string;
  status?: FaqStatus;
  sortOrder?: number;
}

export interface UpdateFaqDto {
  question?: string;
  answer?: string;
  category?: string;
  status?: string;
  sortOrder?: number;
}

export interface FaqQueryParams {
  category?: string;
  status?: string;
  search?: string;
}

export interface NewsCategory {
  id: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateNewsCategoryDto {
  name: string;
}

export interface UpdateNewsCategoryDto {
  name: string;
}

export interface ContactInfo {
  businessAddress: string;
  supportEmail: string;
  supportPhone: string;
}

export interface ExternalLinks {
  websiteUrl: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export type SettingsTab =
  | "commission"
  | "creator-niches"
  | "brand-industries"
  | "faq-management"
  | "ticket-categories"
  | "news-categories"
  | "contact-info"
  | "external-links"
  | "change-login";
