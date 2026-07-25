import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { AxiosError } from "axios";
import { adminBroadcastsApi } from "@/services/adminBroadcastsApi";
import type {
  BroadcastListQueryParams,
  CreateBroadcastPayload,
  UpdateBroadcastPayload,
} from "@/types/adminBroadcasts";

export function useAdminBroadcastsList(
  params?: BroadcastListQueryParams,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-broadcasts-list", params],
    queryFn: () => adminBroadcastsApi.getBroadcasts(params).then((r) => r.data),
    staleTime: 1000 * 30,
    enabled,
  });
}

export function useAdminBroadcastDetails(
  id: string | null,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-broadcast-details", id],
    queryFn: () =>
      adminBroadcastsApi.getBroadcastById(id!).then((r) => r.data.broadcast),
    enabled: !!id && enabled,
    staleTime: 1000 * 30,
  });
}

export function useCreateBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBroadcastPayload) =>
      adminBroadcastsApi.createBroadcast(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin-broadcasts-list"] });
      toast.success(res.data?.message || "Broadcast created successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to create broadcast");
    },
  });
}

export function useUpdateBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateBroadcastPayload;
    }) => adminBroadcastsApi.updateBroadcast(id, payload),
    onSuccess: (res, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-broadcasts-list"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-broadcast-details", variables.id],
      });
      toast.success(res.data?.message || "Broadcast updated successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to update broadcast");
    },
  });
}

export function useDeleteBroadcast() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminBroadcastsApi.deleteBroadcast(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin-broadcasts-list"] });
      toast.success(res.data?.message || "Broadcast deleted successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to delete broadcast");
    },
  });
}
