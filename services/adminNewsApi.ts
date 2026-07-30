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
    const statusVal = data.status.toLowerCase();
    // Backend enum only accepts 'draft', 'published', 'archived'. If 'scheduled', map to 'draft'
    const validStatus = statusVal === "scheduled" ? "draft" : statusVal;
    formData.append("status", validStatus);
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
  }

  return formData;
}

export const adminNewsApi = {
  // 1. Get News List — GET /news (auth-protected, returns all statuses for admin token)
  // NOTE: GET /admin/news does NOT exist on this backend (404). Write ops go to /admin/news.
  getNews: (params?: NewsQueryParams) =>
    apiClient.get<AdminNewsItem[] | PaginatedNewsResponse>("/news", {
      params,
    }),

  // 2. Get Single Article (GET /news/:id)
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
