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

export const usersApi = {
  getExploreProfile: (id: string) =>
    apiClient.get<CreatorProfileDto>(`/users/explore/profile/${id}`),
  getExploreBrandProfile: (id: string) =>
    apiClient.get<BrandProfileDto>(`/users/explore/profile/${id}`),
  getAllUsers: () => apiClient.get<AdminUser[]>("/users"),
  getTopPerformers: () =>
    apiClient.get<TopPerformerCreator[]>("/users/creators/top-performers"),
};
