import { useQuery } from "@tanstack/react-query";
import { campaignApi } from "@/services/campaignApi";

export function useCampaign(id: string | null) {
  return useQuery({
    queryKey: ["campaign", id],
    queryFn: () => campaignApi.getCampaign(id!).then((r) => r.data),
    enabled: !!id,
    staleTime: 0,
  });
}

export function useActivityTimeline(
  campaignId: string | null,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["campaign-activity-timeline", campaignId],
    queryFn: () =>
      campaignApi.getActivityTimeline(campaignId!).then((r) => r.data),
    enabled: !!campaignId && enabled,
    staleTime: 1000 * 30,
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
