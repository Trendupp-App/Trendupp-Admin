export type CreatorOnboardingData = {
  // Step 1 - Profile
  photo?: string;
  username?: string;
  nationality?: string;
  country?: string;
  state?: string;
  bio?: string;

  // Step 2 - Niche
  niches?: string[];

  // Step 3 - Socials
  connected?: {
    platformId: string;
    username: string;
    followers: string;
  }[];

  // Step 4 - Payout
  bankName?: string;
  bankId?: string;
  accountNumber?: string;
  bankAccountName?: string;
};

export interface AdvertiserOnboardingData {
  // StepProfile
  avatarUrl?: string;
  brandName?: string;
  bio?: string;
  country?: string;
  state?: string;
  city?: string;
  website?: string;
  monthlyBudget?: string;
  industries?: string[];

  // StepRepresentative
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;

  // StepSocialsConnect (shared with creator)
  connected?: {
    platformId: string;
    username: string;
    followers: string;
  }[];

  // StepPayout (shared with creator)
  bankName?: string;
  bankId?: string;
  accountNumber?: string;
  bankAccountName?: string;
}

interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface Nationality extends BaseEntity {
  name: string;
  code: string;
}

export interface Country extends BaseEntity {
  name: string;
  code: string;
}

export interface State extends BaseEntity {
  name: string;
  nationalityId: string;
}

export interface CreatorProfilePayload {
  username: string;
  countryId: string;
  stateId: string;
  nationalityId?: string;
  bio?: string;
  avatar?: File;
}

export interface BrandProfilePayload {
  countryId: string;
  stateId: string;
  brandName?: string;
  city?: string;
  bio?: string;
  websiteUrl?: string;
  monthlyBudget?: string;
  avatar?: File;
}

export type UpdateProfilePayload = CreatorProfilePayload | BrandProfilePayload;

export interface CreatorOnboardingStepsCompleted {
  profile: boolean;
  niches: boolean;
  socials: boolean;
  payout: boolean;
}

export interface AdvertiserOnboardingStepsCompleted {
  profile: boolean;
  industries: boolean;
  representative: boolean;
  socials: boolean;
  payout?: boolean;
}

export type OnboardingStepsCompleted =
  CreatorOnboardingStepsCompleted | AdvertiserOnboardingStepsCompleted;

export interface UpdateProfileResponse {
  message: string;
  user: {
    username: string | null;
    onboardingPercentage: number;
    onboardingStepsCompleted: OnboardingStepsCompleted;
    socialsConnected: SocialsConnected;
    bio: string | null;
    avatarUrl: string | null;
    city?: string | null;
    websiteUrl?: string | null;
    monthlyBudget?: string | null;
  };
}

export interface Niche extends BaseEntity {
  name: string;
  order: number;
}

export interface UpdateNichesPayload {
  nicheIds: string[];
}

export interface UpdateNichesResponse {
  message: string;
  user: {
    niches: Niche[];
    onboardingPercentage: number;
    onboardingStepsCompleted: OnboardingStepsCompleted;
    socialsConnected: SocialsConnected;
    // [key: string]: unknown;
  };
}

export type SocialUsernameKey =
  | "instagramUsername"
  | "tiktokUsername"
  | "youtubeUsername"
  | "twitterUsername";

export type SocialFollowersKey =
  | "instagramFollowers"
  | "tiktokFollowers"
  | "youtubeFollowers"
  | "twitterFollowers";

export type UpdateSocialsPayload = Partial<Record<SocialUsernameKey, string>> &
  Partial<Record<SocialFollowersKey, number>>;

export interface SocialsConnected {
  instagram: boolean;
  tiktok: boolean;
  youtube: boolean;
  twitter: boolean;
}

export interface UpdateSocialsResponse {
  message: string;
  user: {
    assignedTier: string | null;
    instagramUsername: string | null;
    tiktokUsername: string | null;
    youtubeUsername: string | null;
    twitterUsername: string | null;
    instagramFollowers: number;
    tiktokFollowers: number;
    youtubeFollowers: number;
    twitterFollowers: number;
    onboardingPercentage: number;
    onboardingStepsCompleted: OnboardingStepsCompleted;
    socialsConnected: SocialsConnected;
    // [key: string]: unknown;
  };
}

export interface UpdatePayoutPayload {
  bankId: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

export interface UpdatePayoutResponse {
  message: string;
  user: {
    bank: {
      id: string;
      name: string;
      code: string;
      country: string;
      region: string;
    } | null;
    bankName: string | null;
    bankAccountNumber: string | null;
    bankAccountName: string | null;
    onboardingPercentage: number;
    onboardingStepsCompleted: OnboardingStepsCompleted;
    socialsConnected: SocialsConnected;
    // [key: string]: unknown;
  };
}
export interface Industry extends BaseEntity {
  name: string;
}

export interface UpdateIndustriesPayload {
  industryIds: string[];
}

export interface UpdateIndustriesResponse {
  message: string;
  user: {
    industries: Industry[];
    onboardingPercentage: number;
    onboardingStepsCompleted: OnboardingStepsCompleted;
    socialsConnected: SocialsConnected;
  };
}

export interface UpdateRepresentativePayload {
  repFirstName: string;
  repLastName: string;
  repEmail: string;
  repPhone: string;
}

export interface BrandRepresentative {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
}

export interface UpdateRepresentativeResponse {
  message: string;
  user: {
    brandRepresentative: BrandRepresentative;
    onboardingPercentage: number;
    onboardingStepsCompleted: OnboardingStepsCompleted;
    socialsConnected: SocialsConnected;
  };
}
