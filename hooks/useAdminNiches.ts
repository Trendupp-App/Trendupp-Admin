import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminSettingsApi } from "@/services/adminSettingsApi";
import type {
  CreatorNiche,
  CreateNicheDto,
  UpdateNicheDto,
} from "@/types/adminSettings";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export function useNiches(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-niches"],
    queryFn: async () => {
      const res = await adminSettingsApi.getNiches();
      const data = res.data;
      if (Array.isArray(data)) {
        return data;
      }
      if (
        data &&
        typeof data === "object" &&
        "data" in data &&
        Array.isArray((data as { data: CreatorNiche[] }).data)
      ) {
        return (data as { data: CreatorNiche[] }).data;
      }
      return [] as CreatorNiche[];
    },
    staleTime: 1000 * 60 * 2,
    enabled,
  });
}

export function useCreateNiche() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateNicheDto) => adminSettingsApi.createNiche(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-niches"] });
      toast.success("Niche added successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to add niche");
    },
  });
}

export function useUpdateNiche() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNicheDto }) =>
      adminSettingsApi.updateNiche(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-niches"] });
      toast.success("Niche updated successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to update niche");
    },
  });
}

export function useDeleteNiche() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => adminSettingsApi.deleteNiche(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin-niches"] });
      toast.success(res.data?.message || "Niche deleted successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to delete niche");
    },
  });
}
