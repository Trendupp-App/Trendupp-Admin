import apiClient from "@/lib/apiClient";
import type {
  UpdatePersonalInfoPayload,
  UpdatePersonalInfoResponse,
  UpdateProfileSocialsPayload,
  UpdateProfileSocialsResponse,
  NotificationSettings,
  NotificationSettingsResponse,
  SecuritySettings,
  SecuritySettingsResponse,
  ChangePasswordPayload,
  DeactivateAccountPayload,
  SupportTicketCategory,
  CreateSupportTicketPayload,
  UpdateProfilePayoutPayload,
  UpdateProfilePayoutResponse,
} from "@/types/profile";
import type {
  UpdateIndustriesPayload,
  UpdateIndustriesResponse,
  UpdateRepresentativePayload,
  UpdateRepresentativeResponse,
} from "@/types/Onboarding";

export const BrandProfileApi = {
  updatePersonalInfo: (payload: UpdatePersonalInfoPayload) => {
    const fd = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value === undefined || value === null || value === "") return;
      fd.append(key, value as string | Blob);
    });
    return apiClient.patch<UpdatePersonalInfoResponse>(
      "/profile/personal-info",
      fd,
      {
        headers: { "Content-Type": undefined },
      },
    );
  },

  updateSocials: (payload: UpdateProfileSocialsPayload) =>
    apiClient.patch<UpdateProfileSocialsResponse>("/profile/socials", payload),

  updatePayout: (payload: UpdateProfilePayoutPayload) =>
    apiClient.patch<UpdateProfilePayoutResponse>("/profile/payout", payload),

  // Industries and representative still use onboarding endpoints —
  // no dedicated profile endpoints exist in the API for these
  updateIndustries: (payload: UpdateIndustriesPayload) =>
    apiClient.post<UpdateIndustriesResponse>(
      "/users/onboarding/industries",
      payload,
    ),

  updateRepresentative: (payload: UpdateRepresentativePayload) =>
    apiClient.patch<UpdateRepresentativeResponse>(
      "/users/onboarding/representative",
      payload,
    ),

  getNotifications: () =>
    apiClient.get<NotificationSettingsResponse>("/profile/notifications"),

  updateNotifications: (payload: Partial<NotificationSettings>) =>
    apiClient.patch<NotificationSettingsResponse>(
      "/profile/notifications",
      payload,
    ),

  getSecurity: () =>
    apiClient.get<SecuritySettingsResponse>("/profile/security"),

  updateSecurity: (payload: Partial<SecuritySettings>) =>
    apiClient.patch<SecuritySettingsResponse>("/profile/security", payload),

  changePassword: (payload: ChangePasswordPayload) =>
    apiClient.patch("/profile/password", payload),

  deactivateAccount: (payload: DeactivateAccountPayload) =>
    apiClient.post("/profile/deactivate", payload),

  getTicketCategories: () =>
    apiClient.get<SupportTicketCategory[]>(
      "/profile/support-ticket/categories",
    ),

  createTicket: (payload: CreateSupportTicketPayload) => {
    const fd = new FormData();
    fd.append("issueCategoryId", payload.issueCategoryId);
    fd.append("subject", payload.subject);
    fd.append("description", payload.description);
    if (payload.attachment instanceof File) {
      fd.append("attachment", payload.attachment);
    }
    return apiClient.post("/profile/support-ticket", fd, {
      headers: { "Content-Type": undefined },
    });
  },
};
