import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminSettingsApi } from "@/services/adminSettingsApi";
import type {
  CommissionTier,
  CreateCommissionTierDto,
  UpdateCommissionTierDto,
} from "@/types/adminSettings";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export function useCommissionTiers(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-commissions"],
    queryFn: async () => {
      const res = await adminSettingsApi.getCommissions();
      const data = res.data;
      if (Array.isArray(data)) {
        return data;
      }
      if (
        data &&
        typeof data === "object" &&
        "data" in data &&
        Array.isArray((data as { data: CommissionTier[] }).data)
      ) {
        return (data as { data: CommissionTier[] }).data;
      }
      return [] as CommissionTier[];
    },
    staleTime: 1000 * 60 * 2,
    enabled,
  });
}

export function useCreateCommissionTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCommissionTierDto) =>
      adminSettingsApi.createCommissionTier(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-commissions"] });
      toast.success("Commission tier created successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data?.message || "Failed to create commission tier",
      );
    },
  });
}

export function useUpdateCommissionTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateCommissionTierDto }) =>
      adminSettingsApi.updateCommissionTier(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-commissions"] });
      toast.success("Commission rate updated successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data?.message || "Failed to update commission rate",
      );
    },
  });
}

export function useDeleteCommissionTier() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminSettingsApi.deleteCommissionTier(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin-commissions"] });
      toast.success(
        res.data?.message || "Commission tier deleted successfully",
      );
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data?.message || "Failed to delete commission tier",
      );
    },
  });
}
