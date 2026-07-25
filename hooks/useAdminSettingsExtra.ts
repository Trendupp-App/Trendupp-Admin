import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminSettingsApi } from "@/services/adminSettingsApi";
import type {
  NewsCategory,
  CreateNewsCategoryDto,
  UpdateNewsCategoryDto,
  ContactInfo,
  ExternalLinks,
  ChangePasswordDto,
} from "@/types/adminSettings";
import { toast } from "sonner";
import type { AxiosError } from "axios";

// 1. News Categories Hooks
export function useNewsCategories(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-news-categories"],
    queryFn: async () => {
      const res = await adminSettingsApi.getNewsCategories();
      const data = res.data;
      if (Array.isArray(data)) {
        return data;
      }
      if (
        data &&
        typeof data === "object" &&
        "data" in data &&
        Array.isArray((data as { data: NewsCategory[] }).data)
      ) {
        return (data as { data: NewsCategory[] }).data;
      }
      return [] as NewsCategory[];
    },
    staleTime: 1000 * 60 * 2,
    enabled,
  });
}

export function useCreateNewsCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNewsCategoryDto) =>
      adminSettingsApi.createNewsCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news-categories"] });
      toast.success("News category created successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data?.message || "Failed to create news category",
      );
    },
  });
}

export function useUpdateNewsCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNewsCategoryDto }) =>
      adminSettingsApi.updateNewsCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news-categories"] });
      toast.success("News category updated successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data?.message || "Failed to update news category",
      );
    },
  });
}

export function useDeleteNewsCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminSettingsApi.deleteNewsCategory(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin-news-categories"] });
      toast.success(res.data?.message || "News category deleted successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data?.message || "Failed to delete news category",
      );
    },
  });
}

// 2. Contact Info Hooks
export function useContactInfo(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-contact-info"],
    queryFn: async () => {
      const res = await adminSettingsApi.getContactInfo();
      const data = res.data;
      if (data && typeof data === "object" && "data" in data) {
        return (data as { data: ContactInfo }).data;
      }
      return data as ContactInfo;
    },
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}

export function useUpdateContactInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ContactInfo) => adminSettingsApi.updateContactInfo(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-contact-info"] });
      toast.success("Contact information updated successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data?.message || "Failed to update contact information",
      );
    },
  });
}

// 3. External Links Hooks
export function useExternalLinks(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-external-links"],
    queryFn: async () => {
      const res = await adminSettingsApi.getExternalLinks();
      const data = res.data;
      if (data && typeof data === "object" && "data" in data) {
        return (data as { data: ExternalLinks }).data;
      }
      return data as ExternalLinks;
    },
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}

export function useUpdateExternalLinks() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ExternalLinks) =>
      adminSettingsApi.updateExternalLinks(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-external-links"] });
      toast.success("External links updated successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data?.message || "Failed to update external links",
      );
    },
  });
}

// 4. Change Password Hook
export function useChangePassword() {
  return useMutation({
    mutationFn: (data: ChangePasswordDto) =>
      adminSettingsApi.changePassword(data),
    onSuccess: (res) => {
      toast.success(res.data?.message || "Password updated successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(err.response?.data?.message || "Failed to update password");
    },
  });
}
