import apiClient from "@/lib/apiClient";
import type { AuthUser } from "@/store/authStore";

export interface UpdatePersonalInfoResponse extends Partial<AuthUser> {
  message?: string;
  user?: Partial<AuthUser>;
}

export interface UpdateProfileNichesPayload {
  nicheIds: string[];
}

export interface UpdateProfileNichesResponse extends Partial<AuthUser> {
  message?: string;
  user?: Partial<AuthUser>;
}

export const profileApi = {
  getUserDetail: (id: string) => apiClient.get<AuthUser>(`/users/${id}`),

  updatePersonalInfo: (payload: FormData) =>
    apiClient.patch<UpdatePersonalInfoResponse>(
      "/profile/personal-info",
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    ),

  updateNiches: (payload: UpdateProfileNichesPayload) =>
    apiClient.put<UpdateProfileNichesResponse>("/profile/niches", payload),

  updateSocials: (payload: UpdateProfileSocialsPayload) =>
    apiClient.patch<UpdateProfileSocialsResponse>("/profile/socials", payload),

  updatePayout: (payload: UpdateProfilePayoutPayload) =>
    apiClient.patch<UpdateProfilePayoutResponse>("/profile/payout", payload),

  getNotificationSettings: () =>
    apiClient.get<GetNotificationSettingsResponse>("/profile/notifications"),

  updateNotificationSettings: (payload: Partial<NotificationSettings>) =>
    apiClient.patch("/profile/notifications", payload),

  getSecuritySettings: () =>
    apiClient.get<GetSecuritySettingsResponse>("/profile/security"),

  updateSecuritySettings: (payload: Partial<SecuritySettings>) =>
    apiClient.patch("/profile/security", payload),

  changePassword: (payload: ChangePasswordPayload) =>
    apiClient.patch<ChangePasswordResponse>("/profile/password", payload),

  deactivateAccount: (payload: DeactivateAccountPayload) =>
    apiClient.post<{ message: string }>("/profile/deactivate", payload),

  getSupportTicketCategories: () =>
    apiClient.get<GetSupportTicketCategoriesResponse>(
      "/profile/support-ticket/categories",
    ),

  getSupportTickets: (id?: string) =>
    apiClient.get<GetSupportTicketsResponse>("/profile/support-ticket", {
      params: id ? { id } : undefined,
    }),

  submitSupportTicket: (payload: FormData) =>
    apiClient.post<SubmitSupportTicketResponse>(
      "/profile/support-ticket",
      payload,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    ),
};

export interface SubmitSupportTicketResponse {
  message: string;
  ticket?: SupportTicket;
}

export interface SupportTicket {
  id: string;
  category: string;
  subject: string;
  description: string;
  status: "open" | "in_progress" | "resolved" | "closed" | string;
  createdAt: string;
  updatedAt?: string;
}

export interface GetSupportTicketsResponse {
  message: string;
  tickets?: SupportTicket[];
  ticket?: SupportTicket;
}

export interface GetSupportTicketCategoriesResponse {
  message: string;
  categories: Array<string | { id: string; name: string }>;
}

export interface DeactivateAccountPayload {
  password?: string;
}

export interface ChangePasswordPayload {
  currentPassword?: string;
  newPassword?: string;
}

export interface ChangePasswordResponse {
  message: string;
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  biometricLoginEnabled: boolean;
  loginAlertsEnabled: boolean;
}

export interface GetSecuritySettingsResponse {
  message: string;
  settings: SecuritySettings;
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

export interface GetNotificationSettingsResponse {
  message: string;
  settings: NotificationSettings;
}

export interface UpdateProfilePayoutPayload {
  bankId: string;
  bankAccountNumber: string;
  bankAccountName: string;
}

export interface UpdateProfilePayoutResponse extends Partial<AuthUser> {
  message?: string;
  user?: Partial<AuthUser>;
}

export interface UpdateProfileSocialsPayload {
  instagramUsername?: string | null;
  instagramFollowers?: number | null;
  tiktokUsername?: string | null;
  tiktokFollowers?: number | null;
  youtubeUsername?: string | null;
  youtubeFollowers?: number | null;
  twitterUsername?: string | null;
  twitterFollowers?: number | null;
}

export interface UpdateProfileSocialsResponse extends Partial<AuthUser> {
  message?: string;
  user?: Partial<AuthUser>;
}
