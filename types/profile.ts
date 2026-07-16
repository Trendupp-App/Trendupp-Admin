import type { OnboardingStepsCompleted } from "@/types/Onboarding";

export interface SocialsConnected {
  instagram: boolean;
  tiktok: boolean;
  youtube: boolean;
  twitter: boolean;
}

export interface UpdatePersonalInfoPayload {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  bio?: string;
  nationalityId?: string;
  countryId?: string;
  stateId?: string;
  avatar?: File;
  websiteUrl?: string;
  monthlyBudget?: string;
  city?: string;
}

export interface UpdatePersonalInfoResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string | null;
  bio: string | null;
  avatarUrl: string | null;
  onboardingPercentage: number;
  onboardingStepsCompleted: OnboardingStepsCompleted;
}

export interface UpdateProfileSocialsPayload {
  instagramUsername?: string | null;
  instagramFollowers?: number;
  tiktokUsername?: string | null;
  tiktokFollowers?: number;
  youtubeUsername?: string | null;
  youtubeFollowers?: number;
  twitterUsername?: string | null;
  twitterFollowers?: number;
}

export interface UpdateProfileSocialsResponse {
  message: string;
  user: {
    socialsConnected: SocialsConnected;
    assignedTier: string | null;
  };
}

export interface NotificationSettings {
  newCampaigns: boolean;
  applicationUpdates: boolean;
  paymentAlerts: boolean;
  brandMessages: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  weeklySummary: boolean;
  marketingOffers: boolean;
}

export type NotificationSettingsResponse = NotificationSettings;

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricLoginEnabled: boolean;
  loginAlertsEnabled: boolean;
}

export type SecuritySettingsResponse = SecuritySettings;

export interface ChangePasswordPayload {
  currentPassword?: string;
  newPassword: string;
}

export interface DeactivateAccountPayload {
  password?: string;
}

export interface SupportTicketCategory {
  id: string;
  name: string;
}

export interface CreateSupportTicketPayload {
  issueCategoryId: string;
  subject: string;
  description: string;
  attachment?: File;
}

export interface SupportTicket {
  id: string;
  subject: string;
  description: string;
  status: string;
  createdAt: string;
}

export interface SupportTicketResponse {
  message: string;
  ticket: SupportTicket;
}

export interface UpdateProfilePayoutPayload {
  bankId: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

export interface UpdateProfilePayoutResponse {
  message: string;
  user: {
    bankName: string | null;
    bankAccountNumber: string | null;
    bankAccountName: string | null;
  };
}

// types/campaign.ts (or a new types/creatorProfile.ts)
export interface CreatorProfileDto {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  city: string | null;
  state: { id: string; name: string } | null;
  country: { id: string; name: string } | null;
  role: "creator" | "brand";
  platforms: Partial<
    Record<
      "instagram" | "tiktok" | "youtube" | "twitter",
      {
        username: string;
        followers: number;
        totalLikes?: number;
        totalViews?: number;
      }
    >
  >;
  niches: Array<{ id: string; name: string }>;
  assignedTier: string | null;
  avgRating: number | null;
  totalReviews: number;
  reviews: Array<{
    id: string;
    brandName: string;
    rating: number;
    text: string;
    date: string;
  }>;
  portfolio?: Array<{ id: string; imageUrl: string; brandName?: string }>;
}

export interface RawIndustry {
  id: string;
  name: string;
}

export interface RawUserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "creator" | "brand";
  isEmailVerified: boolean;
  onboardingPercentage: number;
  onboardingStepsCompleted: OnboardingStepsCompleted;
  username: string | null;
  niches: Array<{ id: string; name: string; order: number }>;
  industries: RawIndustry[];
  assignedTier: string | null;
  bio: string | null;
  avatarUrl: string | null;
  bankName: string | null;
  bankAccountNumber: string | null;
  bankAccountName: string | null;
  socialsConnected: SocialsConnected;
  brandRepresentative: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
  } | null;
}

export interface BrandProfileDto {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  bio: string | null;
  city: string | null;
  websiteUrl: string | null;
  monthlyBudget: string | null;
  country: { id: string; name: string } | null;
  state: { id: string; name: string } | null;
  industries: { id: string; name: string }[];
  totalCampaigns: number;
  followersCount: number;
  platforms: Partial<
    Record<
      "instagram" | "tiktok" | "youtube" | "twitter",
      { username: string; followers: number }
    >
  >;
  campaigns: BrandCampaignSummary[];
  twitterUsername?: string | null;
  twitterFollowers?: number;
  instagramUsername?: string | null;
  instagramFollowers?: number;
  tiktokUsername?: string | null;
  tiktokFollowers?: number;
  youtubeUsername?: string | null;
  youtubeFollowers?: number;
}

export interface BrandCampaignSummary {
  id: string;
  title: string;
  goal: string;
  totalBudget: number;
  coverImage: string | null;
  status: "draft" | "submitted" | "live" | "active" | "completed" | string;
  timeline: string;
}
