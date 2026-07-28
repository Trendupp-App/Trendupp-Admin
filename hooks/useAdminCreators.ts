import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminCreatorsApi } from "@/services/adminCreatorsApi";
import type { CreatorListQueryParams } from "@/types/adminCreators";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export function useCreatorSummary(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-creator-summary"],
    queryFn: () => adminCreatorsApi.getSummary().then((r) => r.data),
    staleTime: 1000 * 60 * 2,
    enabled,
  });
}

export function useTopCreators(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-top-creators"],
    queryFn: () => adminCreatorsApi.getTopCreators().then((r) => r.data),
    staleTime: 1000 * 60 * 2,
    enabled,
  });
}

export function useCreatorSignupGrowth(
  period?: string,
  year?: number,
  month?: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-creator-signup-growth", period, year, month],
    queryFn: () =>
      adminCreatorsApi
        .getSignupGrowth({ period, year, month })
        .then((r) => r.data),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}

export function useCreatorActiveUsers(
  period?: string,
  year?: number,
  month?: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-creator-active-users", period, year, month],
    queryFn: () =>
      adminCreatorsApi
        .getActiveUsers({ period, year, month })
        .then((r) => r.data),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}

export function useCreatorTierDistribution(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-creator-tier-distribution"],
    queryFn: () => adminCreatorsApi.getTierDistribution().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}

export function useCreatorGenderDistribution(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-creator-gender-distribution"],
    queryFn: () => adminCreatorsApi.getGenderDistribution().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}

export function useCreatorNicheBreakdown(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-creator-niche-breakdown"],
    queryFn: () => adminCreatorsApi.getNicheBreakdown().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}

export function useCreatorCountryBreakdown(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-creator-country-breakdown"],
    queryFn: () => adminCreatorsApi.getCountryBreakdown().then((r) => r.data),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}

export function useAdminCreatorsList(
  params?: CreatorListQueryParams,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-creators-list", params],
    queryFn: () => adminCreatorsApi.getCreators(params).then((r) => r.data),
    staleTime: 1000 * 30,
    enabled,
  });
}

export function useCreatorDetails(id: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-creator-details", id],
    queryFn: () => {
      if (!id) return null;
      return adminCreatorsApi.getCreatorDetails(id).then((r) => r.data);
    },
    staleTime: 1000 * 60,
    enabled: enabled && !!id,
  });
}

export function useCreatorCampaignHistory(
  id: string | null,
  page: number = 1,
  limit: number = 10,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-creator-campaign-history", id, page, limit],
    queryFn: () => {
      if (!id) return null;
      return adminCreatorsApi
        .getCreatorCampaignHistory(id, { page, limit })
        .then((r) => r.data);
    },
    staleTime: 1000 * 30,
    enabled: enabled && !!id,
  });
}

export function useCreatorReviews(id: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-creator-reviews", id],
    queryFn: () => {
      if (!id) return null;
      return adminCreatorsApi.getCreatorReviews(id).then((r) => r.data);
    },
    staleTime: 1000 * 30,
    enabled: enabled && !!id,
  });
}

export function useCreatorNotes(id: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-creator-notes", id],
    queryFn: () => {
      if (!id) return [];
      return adminCreatorsApi.getCreatorNotes(id).then((r) => r.data);
    },
    staleTime: 1000 * 10,
    enabled: enabled && !!id,
  });
}

export function useAddCreatorNote(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      adminCreatorsApi.addCreatorNote(id, { note }),
    onSuccess: (_, variables) => {
      toast.success("Admin note added successfully");
      queryClient.invalidateQueries({
        queryKey: ["admin-creator-notes", variables.id],
      });
      if (onSuccess) onSuccess();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ?? "Could not add note, please try again",
      );
    },
  });
}

export function useUpdateCreatorNote(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      noteId,
      note,
    }: {
      id: string;
      noteId: string;
      note: string;
    }) => adminCreatorsApi.updateCreatorNote(id, noteId, { note }),
    onSuccess: (_, variables) => {
      toast.success("Admin note updated");
      queryClient.invalidateQueries({
        queryKey: ["admin-creator-notes", variables.id],
      });
      if (onSuccess) onSuccess();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ??
          "Could not update note, please try again",
      );
    },
  });
}

export function useDeleteCreatorNote(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, noteId }: { id: string; noteId: string }) =>
      adminCreatorsApi.deleteCreatorNote(id, noteId),
    onSuccess: (_, variables) => {
      toast.success("Admin note deleted");
      queryClient.invalidateQueries({
        queryKey: ["admin-creator-notes", variables.id],
      });
      if (onSuccess) onSuccess();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ??
          "Could not delete note, please try again",
      );
    },
  });
}

/* Actions Mutations */

export function useSuspendCreatorAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminCreatorsApi.suspendCreatorAccount(id, { reason }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-creators-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-creator-summary"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-creator-details", variables.id],
      });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ?? "Failed to suspend creator account",
      );
    },
  });
}

export function useSuspendCreatorCampaignAccess() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminCreatorsApi.suspendCreatorCampaignAccess(id, { reason }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-creators-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-creator-summary"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-creator-details", variables.id],
      });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ??
          "Failed to suspend creator campaign access",
      );
    },
  });
}

export function useReactivateCreatorAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminCreatorsApi.reactivateCreatorAccount(id, { reason }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-creators-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-creator-summary"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-creator-details", variables.id],
      });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ?? "Failed to reactivate creator account",
      );
    },
  });
}

export function useChangeCreatorTier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, tier }: { id: string; tier: string }) =>
      adminCreatorsApi.changeCreatorTier(id, { tier }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-creators-list"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-creator-tier-distribution"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin-creator-details", variables.id],
      });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ?? "Failed to change creator tier",
      );
    },
  });
}

export function useDeleteCreatorAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      adminCreatorsApi.deleteCreatorAccount(id, { reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-creators-list"] });
      queryClient.invalidateQueries({ queryKey: ["admin-creator-summary"] });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ?? "Failed to delete creator account",
      );
    },
  });
}
