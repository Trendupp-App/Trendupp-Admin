import apiClient from "@/lib/apiClient";
import type {
  AdminNewsItem,
  CreateNewsDto,
  UpdateNewsDto,
  NewsQueryParams,
  PaginatedNewsResponse,
} from "@/types/adminNews";

function buildNewsFormData(data: CreateNewsDto | UpdateNewsDto): FormData {
  const formData = new FormData();

  if (data.title !== undefined) formData.append("title", data.title);
  if (data.summary !== undefined) formData.append("summary", data.summary);
  if (data.content !== undefined) formData.append("content", data.content);
  if (data.category !== undefined) formData.append("category", data.category);

  if (data.status !== undefined) {
    formData.append("status", data.status.toLowerCase());
  }

  if (data.isPlatformUpdate !== undefined) {
    formData.append("isPlatformUpdate", String(data.isPlatformUpdate));
  }

  if (data.isTopNews !== undefined) {
    formData.append("isTopNews", String(data.isTopNews));
  }

  if (data.industryId) {
    formData.append("industryId", data.industryId);
  }

  if (data.coverImage instanceof File) {
    formData.append("coverImage", data.coverImage);
  } else if (typeof data.coverImage === "string") {
    formData.append("coverImage", data.coverImage);
  }

  return formData;
}

export const adminNewsApi = {
  // 1. Get News List
  getNews: (params?: NewsQueryParams) =>
    apiClient.get<AdminNewsItem[] | PaginatedNewsResponse>("/admin/news", {
      params,
    }),

  // 2. Get Single Article Details
  getNewsById: (id: string) =>
    apiClient.get<AdminNewsItem>(`/admin/news/${id}`),

  // 3. Create News Article (multipart/form-data)
  createNews: (data: CreateNewsDto) => {
    const formData = buildNewsFormData(data);
    return apiClient.post<AdminNewsItem>("/admin/news", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // 4. Update News Article (multipart/form-data)
  updateNews: (id: string, data: UpdateNewsDto) => {
    const formData = buildNewsFormData(data);
    return apiClient.patch<AdminNewsItem>(`/admin/news/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // 5. Delete News Article
  deleteNews: (id: string) =>
    apiClient.delete<{ message?: string }>(`/admin/news/${id}`),
};
