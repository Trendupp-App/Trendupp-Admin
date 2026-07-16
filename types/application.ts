export type ApplicationStatus = "applied" | "accepted" | "rejected";

export interface CreatorSummary {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  rating: number;
  badge?: string;
  location: string;
  followers: string;
  engagement: string;
  tier: string;
}

export interface CampaignApplication {
  id: string;
  creator: CreatorSummary;
  status: ApplicationStatus;
  feeRequest: number;
  contentIdea: string;
  platforms: string[];
  portfolioUrl: string;
  comment?: string;
  brandReply?: string;
}
