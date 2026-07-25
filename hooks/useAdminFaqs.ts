import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminSettingsApi } from "@/services/adminSettingsApi";
import type {
  FaqItem,
  CreateFaqDto,
  UpdateFaqDto,
  FaqQueryParams,
} from "@/types/adminSettings";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export function useFaqs(params?: FaqQueryParams, enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-faqs", params],
    queryFn: async () => {
      const res = await adminSettingsApi.getFaqs(params);
      const data = res.data;
      if (Array.isArray(data)) {
        return data;
      }
      if (
        data &&
        typeof data === "object" &&
        "data" in data &&
        Array.isArray((data as { data: FaqItem[] }).data)
      ) {
        return (data as { data: FaqItem[] }).data;
      }
      return [] as FaqItem[];
    },
    staleTime: 1000 * 60 * 2,
    enabled,
  });
}

export function useCreateFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateFaqDto) => adminSettingsApi.createFaq(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      toast.success("FAQ created successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to create FAQ");
    },
  });
}

export function useUpdateFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateFaqDto }) =>
      adminSettingsApi.updateFaq(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      toast.success("FAQ updated successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to update FAQ");
    },
  });
}

export function useDeleteFaq() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminSettingsApi.deleteFaq(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin-faqs"] });
      toast.success(res.data?.message || "FAQ deleted successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to delete FAQ");
    },
  });
}
