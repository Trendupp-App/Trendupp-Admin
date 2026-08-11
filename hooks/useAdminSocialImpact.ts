import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  adminSocialImpactApi,
  type SocialImpactListQueryParams,
} from "@/services/adminSocialImpactApi";
import type {
  SocialImpactSummaryDto,
  SocialImpactCampaign,
  CreateSocialImpactCampaignDto,
  UpdateSocialImpactCampaignDto,
  UpdateSocialImpactStatusDto,
  CancelCampaignDto,
  ExtendDeadlineDto,
  CloseApplicationsDto,
  RejectParticipantDto,
} from "@/types/adminSocialImpact";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export function useAdminSocialImpactSummary(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-social-impact-summary"],
    queryFn: async () => {
      const res = await adminSocialImpactApi.getSummary();
      const data = res.data;
      if (data && typeof data === "object" && "data" in data) {
        return (data as { data: SocialImpactSummaryDto }).data;
      }
      return data as SocialImpactSummaryDto;
    },
    staleTime: 1000 * 60 * 2,
    enabled,
  });
}

export function useAdminSocialImpactList(
  params?: SocialImpactListQueryParams,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-social-impact-list", params],
    queryFn: async () => {
      const res = await adminSocialImpactApi.getCampaigns(params);
      const data = res.data;
      if (Array.isArray(data)) {
        return { data, total: data.length, page: 1, limit: 20, totalPages: 1 };
      }
      return data;
    },
    staleTime: 1000 * 60 * 2,
    enabled,
  });
}

export function useAdminSocialImpactDetails(
  id: string,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-social-impact-details", id],
    queryFn: async () => {
      const res = await adminSocialImpactApi.getCampaignById(id);
      const data = res.data as
        SocialImpactCampaign | { data: SocialImpactCampaign };
      if (
        data &&
        typeof data === "object" &&
        "data" in data &&
        !("id" in data)
      ) {
        return (data as { data: SocialImpactCampaign }).data;
      }
      return data as SocialImpactCampaign;
    },
    enabled: Boolean(id) && enabled,
  });
}

export function useAdminSocialImpactParticipants(
  campaignId: string,
  params?: { page?: number; limit?: number },
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-social-impact-participants", campaignId, params],
    queryFn: async () => {
      const res = await adminSocialImpactApi.getParticipants(
        campaignId,
        params,
      );
      const data = res.data;
      if (Array.isArray(data)) {
        return { data, total: data.length, page: 1, limit: 20, totalPages: 1 };
      }
      return data;
    },
    enabled: Boolean(campaignId) && enabled,
  });
}

export function useCreateSocialImpactCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateSocialImpactCampaignDto) =>
      adminSocialImpactApi.createCampaign(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-summary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-list"],
      });
      toast.success("Social Impact campaign created successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to create campaign");
    },
  });
}

export function useUpdateSocialImpactCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSocialImpactCampaignDto;
    }) => adminSocialImpactApi.updateCampaign(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-summary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-list"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-details", id],
      });
      toast.success("Campaign updated successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to update campaign");
    },
  });
}

export function useDeleteSocialImpactCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminSocialImpactApi.deleteCampaign(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-summary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-list"],
      });
      toast.success("Campaign deleted successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to delete campaign");
    },
  });
}

export function usePublishSocialImpactCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminSocialImpactApi.publishCampaign(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-summary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-list"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-details", id],
      });
      toast.success("Campaign published successfully!");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to publish campaign");
    },
  });
}

export function useApproveParticipant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      campaignId,
      participantId,
    }: {
      campaignId: string;
      participantId: string;
    }) => adminSocialImpactApi.approveParticipant(campaignId, participantId),
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-participants", campaignId],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-summary"],
      });
      toast.success("Participant submission approved!");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data?.message || "Failed to approve participant",
      );
    },
  });
}

export function useRejectParticipant() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      campaignId,
      participantId,
      payload,
    }: {
      campaignId: string;
      participantId: string;
      payload: RejectParticipantDto;
    }) =>
      adminSocialImpactApi.rejectParticipant(
        campaignId,
        participantId,
        payload,
      ),
    onSuccess: (_, { campaignId }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-participants", campaignId],
      });
      toast.success("Participant submission rejected");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data?.message || "Failed to reject participant",
      );
    },
  });
}

export function useUpdateSocialImpactStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateSocialImpactStatusDto;
    }) => adminSocialImpactApi.updateStatus(id, payload),
    onSuccess: (res, { id, payload }) => {
      const nextStatus = payload.action === "resume" ? "Live" : "Paused";
      const body = res.data as
        SocialImpactCampaign | { data: SocialImpactCampaign } | undefined;
      const updated =
        body && typeof body === "object" && "data" in body && !("id" in body)
          ? (body as { data: SocialImpactCampaign }).data
          : (body as SocialImpactCampaign | undefined);

      queryClient.setQueryData(
        ["admin-social-impact-details", id],
        (prev: SocialImpactCampaign | undefined) => {
          if (!prev) return updated;
          return {
            ...prev,
            ...(updated || {}),
            status: updated?.status || nextStatus,
          };
        },
      );
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-summary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-list"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-details", id],
      });
      toast.success(
        payload.action === "resume"
          ? "Campaign resumed successfully"
          : "Campaign paused successfully",
      );
    },
    onError: (err: AxiosError<{ message?: string }>, { payload }) => {
      toast.error(
        err.response?.data?.message ||
          (payload.action === "resume"
            ? "Failed to resume campaign"
            : "Failed to pause campaign"),
      );
    },
  });
}

export function useCancelSocialImpactCampaign() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: CancelCampaignDto }) =>
      adminSocialImpactApi.cancelCampaign(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-summary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-list"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-details", id],
      });
      toast.success("Campaign cancelled");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to cancel campaign");
    },
  });
}

export function useExtendSocialImpactDeadline() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: ExtendDeadlineDto }) =>
      adminSocialImpactApi.extendDeadline(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-summary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-list"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-details", id],
      });
      toast.success("Deadline extended successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to extend deadline");
    },
  });
}

export function useCloseSocialImpactApplications() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: CloseApplicationsDto;
    }) => adminSocialImpactApi.closeApplications(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-summary"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-list"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-social-impact-details", id],
      });
      toast.success("Applications closed successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data?.message || "Failed to close applications",
      );
    },
  });
}
