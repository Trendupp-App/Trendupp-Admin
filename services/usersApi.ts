import apiClient from "@/lib/apiClient";

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
  code?: string;
  message?: string;
  admin?: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    isActive: boolean;
  };
}

export interface GetSubAdminsParams {
  q?: string;
  role?: string;
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface UpdateAdminProfileDto {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: "super_admin" | "finance_admin" | "moderator" | "support_agent";
}

export const usersApi = {
  getAllUsers: () => apiClient.get<AdminUser[]>("/users"),
  inviteAdmin: (data: AdminInviteDto) =>
    apiClient.post<AdminInviteResponse>("/admin/users/invite", data),
  getSubAdmins: (params?: GetSubAdminsParams) =>
    apiClient.get<AdminUser[]>("/admin/users", { params }),
  updateAdmin: (id: string, data: UpdateAdminProfileDto) =>
    apiClient.patch<void>(`/admin/users/${id}`, data),
  deleteAdmin: (id: string) => apiClient.delete<void>(`/admin/users/${id}`),
};
