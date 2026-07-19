import apiClient from "@/lib/apiClient";
import type { AuthUser } from "@/store/authStore";
import { MessageResponse } from "@/types/auth";
import { RawUserProfile } from "@/types/profile";

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
  admin: AuthUser;
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

export interface UsernameCheckResponse {
  username: string;
  isAvailable: boolean;
}

export const authApi = {
  getRoles: () =>
    apiClient.get<Role[]>("/users/onboarding/roles", {
      params: { publicOnly: true },
    }),

  verifyOtp: (data: OtpVerifyPayload) =>
    apiClient.post<AuthResponse>("/auth/otp/verify", data),

  login: (data: LoginPayload) =>
    apiClient.post<AuthResponse>("/admin/auth/login", data),

  resendOtp: (email: string) => apiClient.post("/auth/otp/send", { email }),

  forgotPassword: (email: string) =>
    apiClient.post<MessageResponse>("/admin/auth/forgot-password", { email }),

  resetPassword: (data: { email: string; code: string; newPassword: string }) =>
    apiClient.post<MessageResponse>("/admin/auth/reset-password", data),

  getUserProfile: (userId: string) =>
    apiClient.get<RawUserProfile>(`/users/${userId}`),

  checkUsername: (username: string) =>
    apiClient.get<UsernameCheckResponse>("/auth/username/check", {
      params: { username },
    }),
};
