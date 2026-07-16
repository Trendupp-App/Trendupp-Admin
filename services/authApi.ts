import apiClient from "@/lib/apiClient";
import type { AuthUser } from "@/store/authStore";
import { MessageResponse } from "@/types/auth";
import { RawUserProfile } from "@/types/profile";

export interface SignupPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  brandName?: string;
  username?: string;
  phoneNumber?: string;
  role: string;
  acceptedTerms: boolean;
  acceptedPromotions?: boolean;
}

export interface SignupResponse {
  message: string;
  user: AuthUser & { isEmailVerified: false };
}

export interface OtpVerifyPayload {
  email: string;
  code: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface Role {
  id: string;
  name: string;
  displayName: string;
}

export interface GoogleAuthPayload {
  idToken: string;
  role: string;
  acceptedTerms: boolean;
  acceptedPromotions: boolean;
}

export interface TiktokAuthPayload {
  code: string;
  redirectUri: string;
  role: string;
  codeVerifier: string;
  acceptedTerms: boolean;
  acceptedPromotions: boolean;
}

export interface InstagramAuthPayload {
  code: string;
  redirectUri: string;
  role: string;
  acceptedTerms: boolean;
  acceptedPromotions: boolean;
}
export interface UsernameCheckResponse {
  username: string;
  isAvailable: boolean;
}

export const authApi = {
  getRoles: () =>
    apiClient.get<Role[]>("/users/onboarding/roles", {
      params: { publicOnly: true },
    }),

  signup: (data: SignupPayload) =>
    apiClient.post<SignupResponse>("/auth/signup", data),

  verifyOtp: (data: OtpVerifyPayload) =>
    apiClient.post<AuthResponse>("/auth/otp/verify", data),

  login: (data: LoginPayload) =>
    apiClient.post<AuthResponse>("/auth/login", data),

  resendOtp: (email: string) => apiClient.post("/auth/otp/send", { email }),
  forgotPassword: (email: string) =>
    apiClient.post<MessageResponse>("/auth/password/forgot", { email }),

  resetPassword: (data: { email: string; code: string; newPassword: string }) =>
    apiClient.post<MessageResponse>("/auth/password/reset", data),

  googleAuth: (data: GoogleAuthPayload) =>
    apiClient.post<AuthResponse>("/auth/google", data),

  tiktokAuth: (data: TiktokAuthPayload) =>
    apiClient.post<AuthResponse>("/auth/tiktok", data),

  instagramAuth: (data: InstagramAuthPayload) =>
    apiClient.post<AuthResponse>("/auth/instagram", data),

  getUserProfile: (userId: string) =>
    apiClient.get<RawUserProfile>(`/users/${userId}`),

  checkUsername: (username: string) =>
    apiClient.get<UsernameCheckResponse>("/auth/username/check", {
      params: { username },
    }),
};
