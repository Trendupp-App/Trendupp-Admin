export type RoleName = "creator" | "brand";

export interface Role {
  id: string;
  name: RoleName;
  displayName: string;
}

export interface OnboardingStepsCompleted {
  profile: boolean;
  niches: boolean;
  socials: boolean;
  payout: boolean;
}

export interface SocialsConnected {
  instagram: boolean;
  tiktok: boolean;
  youtube: boolean;
  twitter: boolean;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: RoleName;
  isEmailVerified: boolean;
  onboardingPercentage: number;
  onboardingStepsCompleted: OnboardingStepsCompleted;
  socialsConnected: SocialsConnected;
  username?: string | null;
  niches: string[];
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
  message: string;
}

export interface MessageResponse {
  message: string;
}

export interface SignupResponse extends MessageResponse {
  user: AuthUser;
}
