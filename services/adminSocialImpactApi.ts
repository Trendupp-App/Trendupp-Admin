import apiClient from "@/lib/apiClient";
import type {
  SocialImpactSummaryDto,
  SocialImpactCampaign,
  PaginatedSocialImpactResponse,
  CreateSocialImpactCampaignDto,
  UpdateSocialImpactCampaignDto,
  SocialImpactParticipant,
  PaginatedParticipantsResponse,
  PauseCampaignDto,
  CancelCampaignDto,
  ExtendDeadlineDto,
  CloseApplicationsDto,
  RejectParticipantDto,
} from "@/types/adminSocialImpact";

export interface SocialImpactListQueryParams {
  status?: string;
  q?: string;
  page?: number;
  limit?: number;
}

function appendIfDefined(form: FormData, key: string, value: unknown) {
  if (value === undefined || value === null || value === "") return;
  form.append(key, value as string | Blob);
}

// POST/PATCH /admin/social-impact take multipart/form-data so coverImage can
// be uploaded as a real file instead of inlined as a data URL.
function buildSocialImpactFormData(
  data: CreateSocialImpactCampaignDto | UpdateSocialImpactCampaignDto,
): FormData {
  const formData = new FormData();

  appendIfDefined(formData, "title", data.title);
  appendIfDefined(formData, "goal", data.goal);
  appendIfDefined(formData, "brandId", data.brandId);
  appendIfDefined(formData, "campaignBrief", data.campaignBrief);
  if (data.currentStep !== undefined) {
    formData.append("currentStep", String(data.currentStep));
  }
  if ("isDraft" in data && data.isDraft !== undefined) {
    formData.append("isDraft", String(data.isDraft));
  }
  (data.creatorTiers || []).forEach((v) => formData.append("creatorTiers", v));
  (data.deliverables || []).forEach((v) => formData.append("deliverables", v));
  (data.contentDirection || []).forEach((v) =>
    formData.append("contentDirection", v),
  );
  (data.dos || []).forEach((v) => formData.append("dos", v));
  (data.donts || []).forEach((v) => formData.append("donts", v));

  if (data.coverImage instanceof File) {
    formData.append("coverImage", data.coverImage);
  } else {
    appendIfDefined(formData, "coverImageUrl", data.coverImageUrl);
  }

  return formData;
}

export const adminSocialImpactApi = {
  // 1. Get Summary Metrics
  getSummary: () =>
    apiClient.get<SocialImpactSummaryDto | { data: SocialImpactSummaryDto }>(
      "/admin/social-impact/summary",
    ),

  // 2. Get Campaigns List
  getCampaigns: (params?: SocialImpactListQueryParams) =>
    apiClient.get<SocialImpactCampaign[] | PaginatedSocialImpactResponse>(
      "/admin/social-impact",
      { params },
    ),

  // 3. Create Campaign (Draft or Initial Step)
  createCampaign: (payload: CreateSocialImpactCampaignDto) =>
    apiClient.post<SocialImpactCampaign>(
      "/admin/social-impact",
      buildSocialImpactFormData(payload),
      { headers: { "Content-Type": undefined } },
    ),

  // 4. Get Campaign Details by ID
  getCampaignById: (id: string) =>
    apiClient.get<SocialImpactCampaign>(`/admin/social-impact/${id}`),

  // 5. Update Campaign (PATCH)
  updateCampaign: (id: string, payload: UpdateSocialImpactCampaignDto) =>
    apiClient.patch<SocialImpactCampaign>(
      `/admin/social-impact/${id}`,
      buildSocialImpactFormData(payload),
      { headers: { "Content-Type": undefined } },
    ),

  // 6. Delete Campaign
  deleteCampaign: (id: string) =>
    apiClient.delete<{ message?: string }>(`/admin/social-impact/${id}`),

  // 7. Publish Campaign
  publishCampaign: (id: string) =>
    apiClient.post<SocialImpactCampaign>(`/admin/social-impact/${id}/publish`),

  // 8. Get Participants for a Campaign
  getParticipants: (
    campaignId: string,
    params?: { page?: number; limit?: number },
  ) =>
    apiClient.get<SocialImpactParticipant[] | PaginatedParticipantsResponse>(
      `/admin/social-impact/${campaignId}/participants`,
      { params },
    ),

  // 9. Approve Participant
  approveParticipant: (campaignId: string, participantId: string) =>
    apiClient.post<SocialImpactParticipant>(
      `/admin/social-impact/${campaignId}/participants/${participantId}/approve`,
    ),

  // 10. Reject Participant
  rejectParticipant: (
    campaignId: string,
    participantId: string,
    payload: RejectParticipantDto,
  ) =>
    apiClient.post<SocialImpactParticipant>(
      `/admin/social-impact/${campaignId}/participants/${participantId}/reject`,
      payload,
    ),

  // 11. Pause Campaign
  pauseCampaign: async (id: string, payload: PauseCampaignDto) => {
    try {
      return await apiClient.patch<SocialImpactCampaign>(
        `/admin/social-impact/${id}/pause`,
        payload,
      );
    } catch {
      try {
        return await apiClient.post<SocialImpactCampaign>(
          `/admin/social-impact/${id}/pause`,
          payload,
        );
      } catch {
        try {
          return await apiClient.patch<SocialImpactCampaign>(
            `/admin/campaigns/${id}/pause`,
            payload,
          );
        } catch {
          return await apiClient.post<SocialImpactCampaign>(
            `/admin/campaigns/${id}/pause`,
            payload,
          );
        }
      }
    }
  },

  // 12. Cancel Campaign
  cancelCampaign: async (id: string, payload: CancelCampaignDto) => {
    try {
      return await apiClient.patch<SocialImpactCampaign>(
        `/admin/social-impact/${id}/cancel`,
        payload,
      );
    } catch {
      try {
        return await apiClient.post<SocialImpactCampaign>(
          `/admin/social-impact/${id}/cancel`,
          payload,
        );
      } catch {
        try {
          return await apiClient.patch<SocialImpactCampaign>(
            `/admin/campaigns/${id}/cancel`,
            payload,
          );
        } catch {
          return await apiClient.post<SocialImpactCampaign>(
            `/admin/campaigns/${id}/cancel`,
            payload,
          );
        }
      }
    }
  },

  // 13. Extend Deadline
  extendDeadline: async (id: string, payload: ExtendDeadlineDto) => {
    try {
      return await apiClient.patch<SocialImpactCampaign>(
        `/admin/social-impact/${id}/extend-deadline`,
        payload,
      );
    } catch {
      try {
        return await apiClient.post<SocialImpactCampaign>(
          `/admin/social-impact/${id}/extend-deadline`,
          payload,
        );
      } catch {
        return await apiClient.put<SocialImpactCampaign>(
          `/admin/social-impact/${id}/extend-deadline`,
          payload,
        );
      }
    }
  },

  // 14. Close Applications
  closeApplications: async (id: string, payload: CloseApplicationsDto) => {
    try {
      return await apiClient.patch<SocialImpactCampaign>(
        `/admin/social-impact/${id}/close-applications`,
        payload,
      );
    } catch {
      try {
        return await apiClient.post<SocialImpactCampaign>(
          `/admin/social-impact/${id}/close-applications`,
          payload,
        );
      } catch {
        return await apiClient.put<SocialImpactCampaign>(
          `/admin/social-impact/${id}/close-applications`,
          payload,
        );
      }
    }
  },
};
