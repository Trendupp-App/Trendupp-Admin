import apiClient from "@/lib/apiClient";
import { TopPerformerCreator } from "@/types/creator";
import type { CreatorProfileDto, BrandProfileDto } from "@/types/profile";

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string | null;
  role: string;
  isEmailVerified: boolean;
  avatarUrl?: string | null;
  createdAt: string;
}

export interface AdminInviteDto {
  firstName: string;
  lastName: string;
  email: string;
  role: "super_admin" | "finance_admin" | "moderator" | "support_agent";
  phoneNumber?: string;
}

export interface AdminInviteResponse {
  /** OTP/token the backend may include so the frontend can construct the invite link */
  otp?: string;
  /** Full invite link if the backend constructs it server-side */
  inviteLink?: string;
  message?: string;
}

export const usersApi = {
  getExploreProfile: (id: string) =>
    apiClient.get<CreatorProfileDto>(`/users/explore/profile/${id}`),
  getExploreBrandProfile: (id: string) =>
    apiClient.get<BrandProfileDto>(`/users/explore/profile/${id}`),
  getAllUsers: () => apiClient.get<AdminUser[]>("/users"),
  getTopPerformers: () =>
    apiClient.get<TopPerformerCreator[]>("/users/creators/top-performers"),
  inviteAdmin: (data: AdminInviteDto) =>
    apiClient.post<AdminInviteResponse>("/admin/users/invite", data),
};
