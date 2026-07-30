export interface BrandSummaryDto {
  totalAdvertisers?: number;
  totalBrands?: number;
  profileCompleted: number;
  suspendedAdvertisers?: number;
  suspendedBrands?: number;
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
  displayId?: string;
  brandId?: string;
  brandName?: string;
  logoUrl?: string | null;
  email?: string;
  advertiser?: {
    brandName?: string;
    logoUrl?: string | null;
  };
  representative?: {
    name?: string;
    email?: string;
  };
  representativeName?: string;
  representativeEmail?: string;
  industry?: string;
  location?:
    | string
    | { city?: string | null; country?: string | null; state?: string | null }
    | null;
  city?: string | null;
  country?: string | null;
  profileCompletion?: number;
  status: "ACTIVE" | "SUSPENDED" | "PENDING" | string;
  totalSpend?: number;
  campaignsCount?: number;
  joinedAt?: string;
  joinDate?: string;
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

export interface BrandHeaderDto {
  brandName?: string | null;
  websiteUrl?: string | null;
  logoUrl?: string | null;
  industry?: string | null;
  status?: string | null;
}

export interface BrandDetailsSectionDto {
  brandName?: string | null;
  email?: string | null;
  website?: string | null;
  bio?: string | null;
  country?: string | null;
  stateCity?: string | null;
  monthlyBudget?: number | null;
  accountStatus?: string | null;
  status?: string | null;
}

export interface BrandRepresentativeDto {
  fullName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  profileCompletion?: number | null;
  dateJoined?: string | null;
  accountStatus?: string | null;
}

export interface BrandMetricsDto {
  totalCampaigns?: number | null;
  totalSpend?: number | null;
  activeCampaigns?: number | null;
  avgCreatorRating?: number | string | null;
}

export interface BrandRefundAccountDto {
  accountNumber?: string | null;
  bankName?: string | null;
  accountName?: string | null;
  isVerified?: boolean | null;
  status?: string | null;
}

export interface AdminBrandDetails {
  header?: BrandHeaderDto;
  brandDetails?: BrandDetailsSectionDto;
  brandRepresentative?: BrandRepresentativeDto;
  refundAccount?: BrandRefundAccountDto;
  bankDetails?: BrandRefundAccountDto;
  metrics?: BrandMetricsDto;

  profileDetails?: {
    brandName?: string | null;
    email?: string | null;
    website?: string | null;
    bio?: string | null;
    countryOfResidence?: string | null;
    state?: string | null;
    city?: string | null;
    monthlyBudget?: number | null;
    representativeName?: string | null;
    representativeEmail?: string | null;
    representativePhone?: string | null;
    profileCompletion?: number | null;
    dateJoined?: string | null;
    accountStatus?: string | null;
    industry?: string | null;
    accountNumber?: string | null;
    bankName?: string | null;
    accountName?: string | null;
  };
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
