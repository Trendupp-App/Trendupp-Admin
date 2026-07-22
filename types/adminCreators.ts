export interface CreatorSummaryDto {
  totalCreators: number;
  profileCompleted: number;
  suspendedCreators: number;
  pendingProfileCompletion: number;
}

export interface CompletionDistributionItemDto {
  percentageLabel: string;
  count: number;
}

export interface AdminCreatorSummaryResponseDto {
  summary: CreatorSummaryDto;
  profileCompletionDistribution: CompletionDistributionItemDto[];
}

export interface SignupGrowthItemDto {
  label: string;
  count: number;
}

export interface ActiveUsersItemDto {
  label: string;
  count: number;
}

export interface TopCreatorDto {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string | null;
  tier: string;
  completedCampaigns: number;
  totalEarnings: number;
}

export interface TierDistributionItemDto {
  tier: string;
  count: number;
  percentage: number;
}

export interface GenderDistributionItemDto {
  gender: string;
  count: number;
  percentage: number;
}

export interface NicheBreakdownItemDto {
  niche: string;
  count: number;
  percentage: number;
}

export interface CountryBreakdownItemDto {
  country: string;
  count: number;
  percentage: number;
}

export interface CreatorListQueryParams {
  status?: string;
  tier?: string;
  niche?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export interface AdminCreatorListItem {
  id: string;
  name: string;
  handle: string;
  email: string;
  avatarUrl?: string | null;
  tier: string;
  niche?: string | null;
  status: string;
  completedCampaigns: number;
  totalEarnings: number;
  joinedAt: string;
}

export interface PaginatedCreatorsResponse {
  data: AdminCreatorListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface AdminCreatorDetails {
  id: string;
  firstName: string;
  lastName: string;
  name: string;
  handle: string;
  email: string;
  phoneNumber?: string | null;
  avatarUrl?: string | null;
  coverImageUrl?: string | null;
  bio?: string | null;
  tier: string;
  niche?: string | null;
  status: string;
  gender?: string | null;
  location?: string | null;
  country?: string | null;
  socials?: {
    instagram?: string | null;
    tiktok?: string | null;
    youtube?: string | null;
    twitter?: string | null;
  } | null;
  stats?: {
    completedCampaigns: number;
    activeCampaigns: number;
    totalEarnings: number;
    rating: number;
    reviewCount: number;
  } | null;
  createdAt: string;
}

export interface CreatorCampaignHistoryItem {
  id: string;
  title: string;
  brandName: string;
  brandAvatar?: string | null;
  status: string;
  payout: number;
  submittedAt: string;
}

export interface CreatorReviewItem {
  id: string;
  brandName: string;
  brandAvatar?: string | null;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface CreatorNoteItem {
  id: string;
  creatorId: string;
  note: string;
  createdBy?: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}
