export interface BrandSummaryDto {
  totalBrands: number;
  profileCompleted: number;
  suspendedBrands: number;
  pendingProfileCompletion: number;
}

export interface BrandCompletionDistributionItemDto {
  percentageLabel: string;
  count: number;
}

export interface AdminBrandSummaryResponseDto {
  summary: BrandSummaryDto;
  profileCompletionDistribution: BrandCompletionDistributionItemDto[];
}

export interface BrandSignupGrowthDto {
  label: string;
  count: number;
}

export interface BrandActiveUsersDto {
  label: string;
  count: number;
}

export interface TopBrandDto {
  id: string;
  brandName: string;
  logoUrl?: string | null;
  website?: string | null;
  totalSpend: number;
  campaignsCount: number;
}

export interface IndustryBreakdownDto {
  industry: string;
  count: number;
  percentage: number;
}

export interface CountryBreakdownDto {
  country: string;
  count: number;
  percentage: number;
}

export interface AdminBrandListItem {
  id: string;
  brandId: string;
  brandName: string;
  logoUrl?: string | null;
  email: string;
  representativeName: string;
  representativeEmail: string;
  industry: string;
  location: string;
  city?: string;
  country: string;
  profileCompletion: number;
  status: "ACTIVE" | "SUSPENDED" | "PENDING" | string;
  totalSpend: number;
  campaignsCount: number;
  joinedAt: string;
}

export interface BrandListQueryParams {
  search?: string;
  status?: string;
  industry?: string;
  completion?: number | string;
  country?: string;
  period?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedBrandsResponse {
  data: AdminBrandListItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface BrandProfileDetailsDto {
  id: string;
  brandName: string;
  email: string;
  website?: string | null;
  bio?: string | null;
  countryOfResidence?: string | null;
  state?: string | null;
  city?: string | null;
  monthlyBudget?: number | null;
  representativeName?: string | null;
  representativeEmail?: string | null;
  representativePhone?: string | null;
  profileCompletion?: number;
  dateJoined?: string;
  accountStatus?: string;
  industry?: string;
}

export interface BrandProfileMetricsDto {
  totalCampaigns?: number;
  totalSpend?: number;
  activeCampaigns?: number;
  avgCreatorRating?: number;
}

export interface AdminBrandDetails {
  profileDetails: BrandProfileDetailsDto;
  metrics: BrandProfileMetricsDto;
}

export interface BrandCampaignHistoryItem {
  id: string;
  campaignTitle: string;
  status: string;
  budget: number;
  spentAmount?: number;
  creatorsJoinedCount?: number;
  startDate?: string;
  createdAt?: string;
}

export interface BrandNoteItem {
  id: string;
  brandId: string;
  adminId: string;
  adminName?: string;
  note: string;
  createdAt: string;
  updatedAt?: string;
}
