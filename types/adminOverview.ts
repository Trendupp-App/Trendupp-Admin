export interface TopMetricsDto {
  totalCreators: number;
  totalBrands: number;
  totalCampaigns: number;
  openDisputes: number;
  newBrandsThisWeek?: number;
  newCampaignsThisWeek?: number;
  newDisputesThisWeek?: number;
}

export interface ActionsRequiredDto {
  unresolvedDisputes: number;
  resolvedDisputes: number;
  creatorsAwaitingPayment: number;
  failedPayouts: number;
}

export interface CampaignOverviewDto {
  total: number;
  draft: number;
  live: number;
  active: number;
  postPending: number;
  completed: number;
}

export interface TierMetricDto {
  name: string;
  count: number;
  percentage: number;
}

export interface CreatorTiersDto {
  totalRegistered: number;
  pendingVerification: number;
  newThisWeek: number;
  tiers: TierMetricDto[];
}

export interface RecentCampaignDto {
  id: string;
  title: string;
  brandName: string;
  brandAvatar?: string | null;
  status: string;
  budget: number;
  applicationsCount: number;
}

export interface TopCreatorDto {
  id: string;
  name: string;
  handle: string;
  avatarUrl?: string | null;
  tier: string;
  completedCampaigns?: number;
  campaignsCount?: number;
  totalEarnings: number;
}

export interface AdminOverviewResponseDto {
  topMetrics: TopMetricsDto;
  actionsRequired: ActionsRequiredDto;
  campaignOverview: CampaignOverviewDto;
  creatorTiers: CreatorTiersDto;
  recentCampaignActivity: RecentCampaignDto[];
  topCreators: TopCreatorDto[];
}
