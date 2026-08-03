import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { disputeApi } from "@/services/disputeApi";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import type {
  RaiseDisputePayload,
  RejectDisputePayload,
  ResolveDisputePayload,
} from "@/types/dispute";

export function useDisputes(enabled: boolean = true) {
  return useQuery({
    queryKey: ["disputes"],
    queryFn: () => disputeApi.getDisputes().then((r) => r.data),
    staleTime: 1000 * 30,
    enabled,
  });
}

export function useDisputeDetails(id: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ["dispute-details", id],
    queryFn: () => {
      if (!id) return null;
      return disputeApi.getDisputeDetails(id).then((r) => r.data);
    },
    staleTime: 1000 * 30,
    enabled: enabled && !!id,
  });
}

export function useRaiseDispute(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: RaiseDisputePayload) =>
      disputeApi.raiseDispute(payload),
    onSuccess: () => {
      toast.success("Dispute raised successfully");
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
      if (onSuccess) onSuccess();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ??
          "Could not raise dispute, please try again",
      );
    },
  });
}

export function useStreamToken(enabled: boolean = true) {
  return useQuery({
    queryKey: ["stream-token"],
    queryFn: () => disputeApi.getStreamToken().then((r) => r.data),
    staleTime: 1000 * 60 * 10, // Cache Stream token for 10 minutes
    enabled,
  });
}

export function useActivateDispute(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      financeAdminId,
    }: {
      id: string;
      financeAdminId?: string;
    }) => disputeApi.activateDispute(id, { financeAdminId }),
    onSuccess: (_, variables) => {
      toast.success("Dispute activated and chat channel opened");
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
      queryClient.invalidateQueries({
        queryKey: ["dispute-details", variables.id],
      });
      if (onSuccess) onSuccess();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ??
          "Could not activate dispute, please try again",
      );
    },
  });
}

export function useResolveDispute(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ResolveDisputePayload;
    }) => disputeApi.resolveDispute(id, payload),
    onSuccess: (_, variables) => {
      toast.success("Dispute resolved successfully");
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
      queryClient.invalidateQueries({
        queryKey: ["dispute-details", variables.id],
      });
      if (onSuccess) onSuccess();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ??
          "Could not resolve dispute, please try again",
      );
    },
  });
}

export function useRejectDispute(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: RejectDisputePayload;
    }) => disputeApi.rejectDispute(id, payload),
    onSuccess: (_, variables) => {
      toast.success("Dispute declined");
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
      queryClient.invalidateQueries({
        queryKey: ["dispute-details", variables.id],
      });
      if (onSuccess) onSuccess();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ??
          "Could not decline dispute, please try again",
      );
    },
  });
}

export function useUpdateDisputeNotes(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, notes }: { id: string; notes: string }) =>
      disputeApi.updateDisputeNotes(id, notes),
    onSuccess: (_, variables) => {
      toast.success("Admin note saved successfully");
      queryClient.invalidateQueries({
        queryKey: ["dispute-details", variables.id],
      });
      if (onSuccess) onSuccess();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ??
          "Could not save admin note, please try again",
      );
    },
  });
}

export function useDeclineDispute(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) =>
      disputeApi.declineDispute(id, reason),
    onSuccess: (_, variables) => {
      toast.success("Dispute request declined");
      queryClient.invalidateQueries({ queryKey: ["disputes"] });
      queryClient.invalidateQueries({
        queryKey: ["dispute-details", variables.id],
      });
      if (onSuccess) onSuccess();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ??
          "Could not decline dispute, please try again",
      );
    },
  });
}
