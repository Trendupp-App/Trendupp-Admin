import apiClient from "@/lib/apiClient";
import type {
  SocialImpactSummaryDto,
  SocialImpactCampaign,
  PaginatedSocialImpactResponse,
  CreateSocialImpactCampaignDto,
  UpdateSocialImpactCampaignDto,
  SocialImpactParticipant,
  PaginatedParticipantsResponse,
  UpdateSocialImpactStatusDto,
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
    apiClient.post<SocialImpactCampaign>("/admin/social-impact", payload),

  // 4. Get Campaign Details by ID
  getCampaignById: (id: string) =>
    apiClient.get<SocialImpactCampaign>(`/admin/social-impact/${id}`),

  // 5. Update Campaign (PATCH)
  updateCampaign: (id: string, payload: UpdateSocialImpactCampaignDto) =>
    apiClient.patch<SocialImpactCampaign>(
      `/admin/social-impact/${id}`,
      payload,
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

  // 11. Pause / Resume Campaign
  updateStatus: (id: string, payload: UpdateSocialImpactStatusDto) =>
    apiClient.post<SocialImpactCampaign>(
      `/admin/social-impact/${id}/status`,
      payload,
    ),

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
