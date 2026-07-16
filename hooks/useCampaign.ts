import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";
import { campaignApi } from "@/services/campaignApi";
import type {
  ApplyCampaignPayload,
  CampaignApplicationDto,
  CreateCampaignPayload,
  PatchCampaignPayload,
  PaymentBreakdown,
  SubmitContentDraftPayload,
  SubmitLiveLinkPayload,
} from "@/types/campaign";
import type { VetDraftPayload } from "@/types/submissions";
import type { CreateDisputePayload } from "@/types/dispute";
import type { CreateReviewPayload } from "@/types/review";

export function useCampaignPlatforms() {
  return useQuery({
    queryKey: ["campaign-platforms"],
    queryFn: () => campaignApi.getPlatforms().then((r) => r.data),
    staleTime: 1000 * 60 * 60,
  });
}

export function useCreatorCategories() {
  return useQuery({
    queryKey: ["creator-categories"],
    queryFn: () => campaignApi.getCreatorCategories().then((r) => r.data),
    staleTime: 1000 * 60 * 60,
  });
}

export function useCreateCampaign(onSuccess: (campaignId: string) => void) {
  return useMutation({
    mutationFn: (payload: CreateCampaignPayload) =>
      campaignApi.createCampaign(payload),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? "Campaign draft created", {
        duration: 1200,
      });
      onSuccess(data.campaign.id);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? "Could not create campaign");
    },
  });
}

export function usePatchCampaign(onSuccess?: () => void) {
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: PatchCampaignPayload;
    }) => campaignApi.patchCampaign(id, payload),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? "Campaign updated", { duration: 900 });
      onSuccess?.();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ?? "Could not save campaign details",
      );
    },
  });
}

export function useSubmitCampaign(
  onSuccess: (breakdown: PaymentBreakdown, paymentUrl: string) => void,
) {
  return useMutation({
    mutationFn: (id: string) => campaignApi.submitCampaign(id),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? "Campaign submitted", { duration: 900 });
      const bd = data.campaign.paymentBreakdown;
      onSuccess(
        {
          campaignBudget: bd.campaignBudget,
          trenduppFee: bd.trenduppFee,
          vat: bd.vat,
          totalToPay: bd.totalToPay,
        },
        data.payment.paymentUrl,
      );
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? "Could not submit campaign");
    },
  });
}

export function useCampaign(id: string | null) {
  return useQuery({
    queryKey: ["campaign", id],
    queryFn: () => campaignApi.getCampaign(id!).then((r) => r.data),
    enabled: !!id,
    staleTime: 0,
  });
}

export function useApplyCampaign(onSuccess: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ApplyCampaignPayload;
    }) => campaignApi.applyCampaign(id, payload),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? "Application submitted successfully! 🚀", {
        duration: 1500,
      });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
      queryClient.invalidateQueries({ queryKey: ["campaign"] });
      queryClient.invalidateQueries({ queryKey: ["my-applications"] });
      onSuccess();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ??
          "Could not submit application, please try again",
      );
    },
  });
}

export function useMyApplications(enabled: boolean = true) {
  return useQuery<CampaignApplicationDto[]>({
    queryKey: ["my-applications"],
    queryFn: () =>
      campaignApi.getMyApplications().then((r) => {
        const data = r.data as
          | { applications?: CampaignApplicationDto[] }
          | CampaignApplicationDto[]
          | undefined;
        return data &&
          "applications" in data &&
          Array.isArray(data.applications)
          ? data.applications
          : Array.isArray(data)
            ? data
            : [];
      }),
    staleTime: 0,
    enabled,
  });
}

export function useMyCampaigns(
  status?: "draft" | "live" | "active" | "completed" | "submitted",
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["my-campaigns", status],
    queryFn: () => campaignApi.getMyCampaigns(status).then((r) => r.data),
    staleTime: 1000 * 30,
    enabled,
  });
}

export function useApplication(id: string | null) {
  return useQuery({
    queryKey: ["application", id],
    queryFn: () =>
      campaignApi.getApplication(id!).then((r) => r.data.application),
    enabled: !!id,
    staleTime: 0,
  });
}

export function useReviewApplication(
  campaignId: string,
  onSuccess: (appId: string, status: "accepted" | "rejected") => void,
) {
  return useMutation({
    mutationFn: ({
      appId,
      status,
    }: {
      appId: string;
      status: "accepted" | "rejected";
    }) => campaignApi.reviewApplication(campaignId, appId, status),
    onSuccess: ({ data }, variables) => {
      toast.success(data.message, { duration: 900 });
      onSuccess(variables.appId, variables.status);
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ?? "Could not update application",
      );
    },
  });
}

export function useSubmissions(
  campaignId: string | null,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["campaign-submissions", campaignId],
    queryFn: () =>
      campaignApi.getSubmissions(campaignId!).then((r) => r.data.submissions),
    enabled: !!campaignId && enabled,
    staleTime: 0,
    refetchOnMount: "always",
  });
}

export function useVetDraft(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      ...payload
    }: VetDraftPayload & { submissionId: string }) =>
      campaignApi.vetDraft(campaignId, submissionId, payload),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? "Draft reviewed", { duration: 900 });
      queryClient.invalidateQueries({
        queryKey: ["campaign-submissions", campaignId],
      });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? "Could not review draft");
    },
  });
}

export function useRaiseDispute(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (payload: CreateDisputePayload) =>
      campaignApi.raiseDispute(payload),
    onSuccess: ({ data }) => {
      toast.success(
        data.message ?? "Dispute raised — our team will review this.",
        {
          duration: 1500,
        },
      );
      onSuccess?.();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? "Could not raise dispute");
    },
  });
}

export function useApproveLivePost(campaignId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (submissionId: string) =>
      campaignApi.approveLivePost(campaignId, submissionId),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? "Live post approved", { duration: 900 });
      queryClient.invalidateQueries({
        queryKey: ["campaign-submissions", campaignId],
      });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ?? "Could not approve live post",
      );
    },
  });
}

export function useCreateReview(onSuccess?: () => void) {
  return useMutation({
    mutationFn: (payload: CreateReviewPayload) =>
      campaignApi.createReview(payload),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? "Review submitted", { duration: 1200 });
      onSuccess?.();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? "Could not submit review");
    },
  });
}

export function useSubmitContentDraft(onSuccess: () => void) {
  return useMutation({
    mutationFn: ({
      id,
      appId,
      payload,
    }: {
      id: string;
      appId: string;
      payload: SubmitContentDraftPayload;
    }) => campaignApi.submitContentDraft(id, appId, payload),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? "Content draft link submitted! 🚀", {
        duration: 1500,
      });
      onSuccess();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ??
          "Could not submit draft, please try again",
      );
    },
  });
}

export function useSubmitProofOfPosting(onSuccess: () => void) {
  return useMutation({
    mutationFn: ({
      id,
      submissionId,
      payload,
    }: {
      id: string;
      submissionId: string;
      payload: SubmitLiveLinkPayload;
    }) => campaignApi.submitProofOfPosting(id, submissionId, payload),
    onSuccess: ({ data }) => {
      toast.success(
        data.message ?? "Proof of posting submitted successfully! 🎉",
        {
          duration: 1500,
        },
      );
      onSuccess();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ??
          "Could not submit proof, please try again",
      );
    },
  });
}

export function useCreatorReviews(creatorId: string | null) {
  return useQuery({
    queryKey: ["creatorReviews", creatorId],
    queryFn: () =>
      campaignApi.getCreatorReviews(creatorId!).then((r) => r.data.reviews),
    enabled: !!creatorId,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCampaigns(
  params?: {
    status?: "draft" | "live" | "active" | "completed" | "submitted";
    sortBy?: "newest" | "highest_budget" | "closing_soon";
    platforms?: string[];
    niches?: string[];
    nicheIds?: string[];
    goal?: string;
  },
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["campaigns", params],
    queryFn: () => campaignApi.getCampaigns(params).then((r) => r.data.data),
    staleTime: 1000 * 30,
    enabled,
  });
}

export function useDeleteDraftCampaign(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => campaignApi.deleteDraftCampaign(id),
    onSuccess: ({ data }) => {
      toast.success(data.message ?? "Draft campaign deleted", {
        duration: 900,
      });
      queryClient.invalidateQueries({ queryKey: ["my-campaigns"] });
      onSuccess?.();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ??
          "Could not delete draft. It may no longer be in draft status.",
      );
    },
  });
}
