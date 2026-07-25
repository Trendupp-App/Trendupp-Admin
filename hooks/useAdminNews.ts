import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { adminNewsApi } from "@/services/adminNewsApi";
import type {
  AdminNewsItem,
  CreateNewsDto,
  UpdateNewsDto,
  NewsQueryParams,
} from "@/types/adminNews";
import { toast } from "sonner";
import type { AxiosError } from "axios";

export function useAdminNews(
  params?: NewsQueryParams,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-news-list", params],
    queryFn: async () => {
      const res = await adminNewsApi.getNews(params);
      const data = res.data;
      if (Array.isArray(data)) {
        return data;
      }
      if (
        data &&
        typeof data === "object" &&
        "data" in data &&
        Array.isArray((data as { data: AdminNewsItem[] }).data)
      ) {
        return (data as { data: AdminNewsItem[] }).data;
      }
      return [] as AdminNewsItem[];
    },
    staleTime: 1000 * 60 * 2,
    enabled,
  });
}

export function useNewsDetails(id: string | null, enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-news-details", id],
    queryFn: () => {
      if (!id) return Promise.reject("No news ID");
      return adminNewsApi.getNewsById(id!).then((r) => r.data);
    },
    enabled: !!id && enabled,
    staleTime: 1000 * 60 * 2,
  });
}

export function useCreateNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateNewsDto) => adminNewsApi.createNews(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-news-list"] });
      toast.success("News article published successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data?.message || "Failed to publish news article",
      );
    },
  });
}

export function useUpdateNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateNewsDto }) =>
      adminNewsApi.updateNews(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin-news-list"] });
      queryClient.invalidateQueries({
        queryKey: ["admin-news-details", variables.id],
      });
      toast.success("News article updated successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data?.message || "Failed to update news article",
      );
    },
  });
}

export function useDeleteNews() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminNewsApi.deleteNews(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["admin-news-list"] });
      toast.success(res.data?.message || "News article deleted successfully");
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err.response?.data?.message || "Failed to delete news article",
      );
    },
  });
}
