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

export interface ConnectedSocialsDto {
  instagram?: number;
  tiktok?: number;
  youtube?: number;
  twitter?: number;
  facebook?: number;
}

export interface ConnectedSocialsCountsDto {
  instagram: number;
  tiktok: number;
  youtube: number;
  twitter: number;
  facebook: number;
}

export interface AdminCreatorSummaryResponseDto {
  summary: CreatorSummaryDto;
  connectedSocials?: ConnectedSocialsDto | ConnectedSocialsCountsDto;
  profileCompletionDistribution?: CompletionDistributionItemDto[];
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
  gender?: string;
  country?: string;
  q?: string;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
  fromDate?: string;
  toDate?: string;
}

export interface AdminCreatorListItem {
  id: string;
  name?: string;
  handle?: string;
  email?: string;
  avatarUrl?: string | null;
  tier?: string;
  niche?: string | null;
  gender?: string | null;
  country?: string | null;
  state?: string | null;
  location?: string | { country?: string; state?: string } | null;
  status?: string;
  completedCampaigns?: number;
  campaignsCount?: number;
  totalEarnings?: number;
  earningsStatus?: string;
  profileCompletion?: number | string;
  platformsConnected?: string[] | Record<string, unknown>;
  platforms?: string[] | Record<string, unknown>;
  connectedSocials?: ConnectedSocialsDto | ConnectedSocialsCountsDto;
  socialAccounts?: CreatorSocialAccountDto[];
  revisionCount?: number;
  revisionsCount?: number;
  revisions?: number;
  joinedAt?: string;
  createdAt?: string;
  dateJoined?: string;
}

export interface PaginatedCreatorsResponse {
  data: AdminCreatorListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreatorProfileMetricsDto {
  completedCampaigns: number;
  totalEarnings: number;
  onTimeSubmissionRate: number;
  totalFollowers: number;
  totalTokens: number;
}

export interface CreatorBankDetailsDto {
  accountName?: string | null;
  accountNumber?: string | null;
  bankId?: string | null;
  bankName?: string | null;
}

export interface CreatorProfileDetailsDto {
  id: string;
  fullName: string;
  username: string;
  email: string;
  countryOfResidence: string;
  state: string;
  nationality: string;
  bio?: string | null;
  gender?: string | null;
  dateOfBirth?: string | null;
  dob?: string | null;
  profileCompletion?: string | null;
  accountNumber?: string | null;
  bankAccountNumber?: string | null;
  bankName?: string | null;
  accountName?: string | null;
  bankAccountName?: string | null;
  bankAccountStatus?: string | null;
  bankDetails?: CreatorBankDetailsDto | null;
  dateJoined?: string | null;
  accountStatus?: string | null;
  tier?: string | null;
  phoneNumber?: string | null;
}

export interface CreatorSocialAccountDto {
  platform: string;
  handle: string;
  followersCount?: number | null;
  url?: string | null;
}

export interface AdminCreatorProfileResponseDto {
  metrics: CreatorProfileMetricsDto;
  profileDetails: CreatorProfileDetailsDto;
  bankDetails?: CreatorBankDetailsDto | null;
  socialAccounts?: CreatorSocialAccountDto[];
}

// Backwards compatibility alias
export type AdminCreatorDetails = AdminCreatorProfileResponseDto;

export interface CreatorCampaignHistoryItem {
  id: string;
  campaignTitle: string;
  brandName: string;
  status: string;
  fee: number;
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
