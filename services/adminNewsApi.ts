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

  if (data.title !== undefined && data.title !== "") {
    formData.append("title", data.title);
  }
  if (data.summary !== undefined && data.summary !== "") {
    formData.append("summary", data.summary);
  }
  if (data.content !== undefined && data.content !== "") {
    formData.append("content", data.content);
  }
  if (data.category !== undefined && data.category !== "") {
    formData.append("category", data.category);
  }
  if (data.status !== undefined && data.status !== "") {
    formData.append("status", data.status.toLowerCase());
  }
  if (data.brand !== undefined && data.brand !== "") {
    formData.append("brand", data.brand);
  }
  if (data.authorName !== undefined && data.authorName !== "") {
    formData.append("authorName", data.authorName);
  }
  // tags — send as repeated field OR JSON string depending on backend
  if (Array.isArray(data.tags) && data.tags.length > 0) {
    data.tags.forEach((tag) => formData.append("tags[]", tag));
    // Also send as comma-separated fallback
    formData.append("tags", data.tags.join(","));
  }
  if (data.isPlatformUpdate !== undefined) {
    formData.append("isPlatformUpdate", String(data.isPlatformUpdate));
  }
  if (data.isTopNews !== undefined) {
    formData.append("isTopNews", String(data.isTopNews));
  }
  if (data.industryId !== undefined && data.industryId !== "") {
    formData.append("industryId", data.industryId);
  }
  if (data.coverImage !== undefined) {
    if (data.coverImage instanceof File) {
      formData.append("coverImage", data.coverImage);
    } else if (typeof data.coverImage === "string" && data.coverImage !== "") {
      formData.append("coverImage", data.coverImage);
    }
    // null / empty string → omit field so backend keeps existing image
  }

  return formData;
}

export const adminNewsApi = {
  // 1. Get News List — uses /admin/news so drafts + all statuses are visible
  getNews: (params?: NewsQueryParams) =>
    apiClient.get<AdminNewsItem[] | PaginatedNewsResponse>("/admin/news", {
      params,
    }),

  // 2. Get Single Article Details (GET /news/:id)
  getNewsById: (id: string) => apiClient.get<AdminNewsItem>(`/news/${id}`),

  // 3. Create News Article (multipart/form-data: POST /admin/news)
  createNews: (data: CreateNewsDto) => {
    const formData = buildNewsFormData(data);
    return apiClient.post<AdminNewsItem>("/admin/news", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // 4. Update News Article (multipart/form-data: PATCH /admin/news/:id)
  updateNews: (id: string, data: UpdateNewsDto) => {
    const formData = buildNewsFormData(data);
    return apiClient.patch<AdminNewsItem>(`/admin/news/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // 5. Delete News Article (DELETE /admin/news/:id)
  deleteNews: (id: string) =>
    apiClient.delete<{ message?: string }>(`/admin/news/${id}`),
};
