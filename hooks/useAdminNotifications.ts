import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminNotificationsApi } from "@/services/adminNotificationsApi";
import type {
  AdminBroadcastItem,
  CreateBroadcastPayload,
  UpdateBroadcastPayload,
  AdminBroadcastQueryParams,
} from "@/types/adminNotifications";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export function useAdminBroadcasts(
  params?: AdminBroadcastQueryParams,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-broadcasts-list", params],
    queryFn: async () => {
      const res = await adminNotificationsApi.getBroadcasts(params);
      const data = res.data;

      if (Array.isArray(data)) {
        return { data, total: data.length, page: 1, limit: 10, totalPages: 1 };
      }

      if (
        data &&
        typeof data === "object" &&
        "data" in data &&
        Array.isArray((data as { data: AdminBroadcastItem[] }).data)
      ) {
        const listData = (data as { data: AdminBroadcastItem[] }).data;
        const total = (data as { total?: number }).total ?? listData.length;
        const page = (data as { page?: number }).page ?? 1;
        const limit = (data as { limit?: number }).limit ?? 10;
        const totalPages =
          (data as { totalPages?: number }).totalPages ??
          Math.ceil(total / limit);
        return { data: listData, total, page, limit, totalPages };
      }

      return {
        data: [] as AdminBroadcastItem[],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 1,
      };
    },
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
    queryFn: async () => {
      if (!id) return null;
      const res = await adminNotificationsApi.getBroadcastById(id);
      const data = res.data;
      if (data && typeof data === "object" && "broadcast" in data) {
        return (data as { broadcast: AdminBroadcastItem }).broadcast;
      }
      if (data && typeof data === "object" && "data" in data) {
        return (data as { data: AdminBroadcastItem }).data;
      }
      return data as AdminBroadcastItem;
    },
    staleTime: 1000 * 60,
    enabled: enabled && !!id,
  });
}

export function useCreateAdminBroadcast(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateBroadcastPayload) =>
      adminNotificationsApi.createBroadcast(payload),
    onSuccess: ({ data }) => {
      toast.success(data?.message ?? "Broadcast created successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-broadcasts-list"] });
      if (onSuccess) onSuccess();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? "Failed to create broadcast");
    },
  });
}

export function useUpdateAdminBroadcast(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateBroadcastPayload;
    }) => adminNotificationsApi.updateBroadcast(id, payload),
    onSuccess: ({ data }, variables) => {
      toast.success(data?.message ?? "Broadcast updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-broadcasts-list"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-broadcast-details", variables.id],
      });
      if (onSuccess) onSuccess();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? "Failed to update broadcast");
    },
  });
}

export function useDeleteAdminBroadcast(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminNotificationsApi.deleteBroadcast(id),
    onSuccess: ({ data }) => {
      toast.success(data?.message ?? "Broadcast deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-broadcasts-list"] });
      if (onSuccess) onSuccess();
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err?.response?.data?.message ?? "Failed to delete broadcast");
    },
  });
}
