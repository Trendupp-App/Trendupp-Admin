import apiClient from "@/lib/apiClient";
import type {
  CampaignPlatform,
  CreatorCategory,
  Campaign,
  CreateCampaignPayload,
  CreateCampaignResponse,
  PatchCampaignPayload,
  PatchCampaignResponse,
  SubmitCampaignResponse,
  CampaignApplicationDto,
  ApplyCampaignPayload,
  ApplyCampaignResponse,
  SubmitContentDraftPayload,
  SubmitContentDraftResponse,
  SubmitLiveLinkPayload,
  SubmitLiveLinkResponse,
} from "@/types/campaign";
import { CampaignSubmission, VetDraftPayload } from "@/types/submissions";
import type { CreateDisputePayload } from "@/types/dispute";
import type { CreateReviewPayload } from "@/types/review";

function appendIfDefined(form: FormData, key: string, value: unknown) {
  if (value === undefined || value === null || value === "") return;
  form.append(key, value as string | Blob);
}

export const campaignApi = {
  getPlatforms: () => apiClient.get<CampaignPlatform[]>("/campaigns/platforms"),

  getCreatorCategories: () =>
    apiClient.get<CreatorCategory[]>("/campaigns/creator-categories"),

  createCampaign: (payload: CreateCampaignPayload) => {
    const fd = new FormData();
    appendIfDefined(fd, "title", payload.title);
    appendIfDefined(fd, "goal", payload.goal);
    appendIfDefined(fd, "totalBudget", String(payload.totalBudget));
    appendIfDefined(fd, "creatorCategoryId", payload.creatorCategoryId);
    payload.preferredPlatformIds.forEach((id) =>
      fd.append("preferredPlatformIds", id),
    );
    appendIfDefined(fd, "creatorNicheId", payload.creatorNicheId);
    appendIfDefined(fd, "timeline", payload.timeline);
    appendIfDefined(fd, "campaignBrief", payload.campaignBrief);
    if (payload.coverImage instanceof File) {
      fd.append("coverImage", payload.coverImage);
    }
    return apiClient.post<CreateCampaignResponse>("/campaigns", fd, {
      headers: { "Content-Type": undefined },
    });
  },

  patchCampaign: (id: string, payload: PatchCampaignPayload) => {
    const fd = new FormData();
    // Always send currentStep
    fd.append("currentStep", String(payload.currentStep));

    if (payload.currentStep === 1) {
      appendIfDefined(fd, "title", payload.title);
      appendIfDefined(fd, "goal", payload.goal);
      appendIfDefined(fd, "totalBudget", String(payload.totalBudget));
      appendIfDefined(fd, "creatorCategoryId", payload.creatorCategoryId);
      appendIfDefined(fd, "creatorNicheId", payload.creatorNicheId);
      payload.preferredPlatformIds.forEach((id) =>
        fd.append("preferredPlatformIds", id),
      );
      appendIfDefined(fd, "timeline", payload.timeline);
      if (payload.coverImage instanceof File) {
        fd.append("coverImage", payload.coverImage);
      }
    }

    if (payload.currentStep === 2) {
      appendIfDefined(fd, "campaignBrief", payload.campaignBrief);
      payload.deliverables.forEach((v) =>
        appendIfDefined(fd, "deliverables", v),
      );
      payload.contentDirection.forEach((v) =>
        appendIfDefined(fd, "contentDirection", v),
      );
      // contentGuidelines must be JSON-stringified inside form-data
      fd.append("contentGuidelines", JSON.stringify(payload.contentGuidelines));
    }

    if (payload.currentStep === 3) {
      appendIfDefined(fd, "usageRights", payload.usageRights);
      appendIfDefined(fd, "successLooksLike", payload.successLooksLike);
    }

    return apiClient.patch<PatchCampaignResponse>(`/campaigns/${id}`, fd, {
      headers: { "Content-Type": undefined },
    });
  },
  applyCampaign: (id: string, payload: ApplyCampaignPayload) =>
    apiClient.post<ApplyCampaignResponse>(
      `/campaigns/${id}/applications`,
      payload,
    ),

  getMyCampaigns: (
    status?: "draft" | "submitted" | "live" | "active" | "completed",
  ) =>
    apiClient.get<Campaign[]>("/campaigns/my", {
      params: status ? { status } : undefined,
    }),

  getCampaigns: (params?: {
    status?: "draft" | "live" | "active" | "completed" | "submitted";
    sortBy?: "newest" | "highest_budget" | "closing_soon";
    platforms?: string[];
    niches?: string[];
    nicheIds?: string[];
    goal?: string;
  }) => apiClient.get<{ data: Campaign[] }>("/campaigns", { params }),

  getCampaign: (id: string) => apiClient.get<Campaign>(`/campaigns/${id}`),

  submitCampaign: (id: string) =>
    apiClient.post<SubmitCampaignResponse>(`/campaigns/${id}/submit`),

  getApplication: (id: string) =>
    apiClient.get<{ application: CampaignApplicationDto }>(
      `/campaigns/applications/${id}`,
    ),

  getMyApplications: () =>
    apiClient.get<CampaignApplicationDto[]>("/campaigns/applications/my"),

  reviewApplication: (
    campaignId: string,
    appId: string,
    status: "accepted" | "rejected",
  ) =>
    apiClient.patch<{
      message: string;
      application: { id: string; status: "accepted" | "rejected" };
    }>(`/campaigns/${campaignId}/applications/${appId}`, { status }),

  getSubmissions: (campaignId: string) =>
    apiClient.get<{ submissions: CampaignSubmission[] }>(
      `/campaigns/${campaignId}/submissions`,
    ),

  vetDraft: (
    campaignId: string,
    submissionId: string,
    payload: VetDraftPayload,
  ) =>
    apiClient.patch<{ message: string; submission: CampaignSubmission }>(
      `/campaigns/${campaignId}/submissions/${submissionId}/vet`,
      payload,
    ),

  raiseDispute: (payload: CreateDisputePayload) =>
    apiClient.post<{ message: string; dispute: { id: string } }>(
      "/disputes",
      payload,
    ),

  approveLivePost: (campaignId: string, submissionId: string) =>
    apiClient.patch<{ message: string; submission: CampaignSubmission }>(
      `/campaigns/${campaignId}/submissions/${submissionId}/approve-live`,
    ),

  createReview: (payload: CreateReviewPayload) =>
    apiClient.post<{ message: string }>("/campaigns/reviews", payload),

  submitContentDraft: (
    id: string,
    appId: string,
    payload: SubmitContentDraftPayload,
  ) =>
    apiClient.post<SubmitContentDraftResponse>(
      `/campaigns/${id}/applications/${appId}/draft`,
      payload,
    ),

  submitProofOfPosting: (
    id: string,
    submissionId: string,
    payload: SubmitLiveLinkPayload,
  ) =>
    apiClient.post<SubmitLiveLinkResponse>(
      `/campaigns/${id}/submissions/${submissionId}/live`,
      payload,
    ),

  getCreatorReviews: (creatorId: string) =>
    apiClient.get<{ reviews: BackendReview[] }>(
      `/campaigns/reviews/creator/${creatorId}`,
    ),

  deleteDraftCampaign: (id: string) =>
    apiClient.delete<{ message: string }>(`/campaigns/${id}`),
};

export interface BackendReview {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
  campaign?: {
    id: string;
    title: string;
    brand?: {
      id: string;
      firstName: string;
      lastName: string;
      companyName?: string | null;
      avatarUrl?: string | null;
    };
  };
}
