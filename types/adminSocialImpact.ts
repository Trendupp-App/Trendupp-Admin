export interface SocialImpactSummaryDto {
  activeSocialCampaigns: number;
  totalParticipations: number;
  tokensDistributed: number;
  campaignsCompleted: number;
}

export interface SocialImpactCampaign {
  id: string;
  title: string;
  goal: string;
  brandId: string;
  brandName?: string | null;
  brandLogo?: string | null;
  creatorTiers: string[];
  coverImageUrl?: string | null;
  campaignBrief?: string | null;
  deliverables?: string[];
  contentDirection?: string[];
  dos?: string[];
  donts?: string[];
  currentStep?: number;
  isDraft?: boolean;
  status: "Draft" | "Live" | "Active" | "Completed" | "Paused" | "Cancelled";
  niche?: string | null;
  category?: string | null;
  tokensReward?: number | null;
  tokenReward?: number | null;
  tokens?: number | null;
  participantsCount?: number;
  applicationsCount?: number;
  appliedCount?: number;
  deadline?: string | null;
  lastEditedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
}

export interface PaginatedSocialImpactResponse {
  data: SocialImpactCampaign[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  summary?: SocialImpactSummaryDto;
}

export interface CreateSocialImpactCampaignDto {
  title: string;
  goal: string;
  brandId: string;
  creatorTiers: string[];
  coverImage?: File;
  coverImageUrl?: string;
  campaignBrief?: string;
  deliverables?: string[];
  contentDirection?: string[];
  dos?: string[];
  donts?: string[];
  contentLink?: string;
  platforms?: string;
  deadline?: string;
  tokensReward?: number;
  currentStep?: number;
  isDraft?: boolean;
}

export interface UpdateSocialImpactCampaignDto {
  title?: string;
  goal?: string;
  brandId?: string;
  creatorTiers?: string[];
  coverImage?: File;
  coverImageUrl?: string;
  campaignBrief?: string;
  deliverables?: string[];
  contentDirection?: string[];
  dos?: string[];
  donts?: string[];
  contentLink?: string;
  platforms?: string;
  deadline?: string;
  tokensReward?: number;
  currentStep?: number;
  isDraft?: boolean;
}

export interface SocialImpactParticipant {
  id: string;
  campaignId: string;
  creatorId: string;
  creatorName: string;
  creatorHandle: string;
  creatorAvatar?: string | null;
  creatorTier?: string | null;
  status: "Pending" | "Approved" | "Rejected" | "No Submission";
  submissionUrl?: string | null;
  submissionNotes?: string | null;
  tokensEarned?: number | null;
  submittedAt?: string | null;
  rejectionReason?: string | null;
}

export interface PaginatedParticipantsResponse {
  data: SocialImpactParticipant[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PauseCampaignDto {
  reason: string;
}

export interface CancelCampaignDto {
  reason: string;
}

export interface ExtendDeadlineDto {
  newDeadline: string;
  reason?: string;
}

export interface CloseApplicationsDto {
  reason: string;
}

export interface RejectParticipantDto {
  reason: string;
}
