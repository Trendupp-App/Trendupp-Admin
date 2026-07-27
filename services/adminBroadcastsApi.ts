import apiClient from "@/lib/apiClient";
import type {
  BroadcastListQueryParams,
  CreateBroadcastPayload,
  CreateBroadcastResponse,
  GetBroadcastResponse,
  PaginatedBroadcastsResponse,
  UpdateBroadcastPayload,
  UpdateBroadcastResponse,
} from "@/types/adminBroadcasts";

export const adminBroadcastsApi = {
  getBroadcasts: (params?: BroadcastListQueryParams) =>
    apiClient.get<PaginatedBroadcastsResponse>("/admin/broadcasts", {
      params,
    }),

  getBroadcastById: (id: string) =>
    apiClient.get<GetBroadcastResponse>(`/admin/broadcasts/${id}`),

  createBroadcast: (payload: CreateBroadcastPayload) =>
    apiClient.post<CreateBroadcastResponse>("/admin/broadcasts", payload),

  updateBroadcast: (id: string, payload: UpdateBroadcastPayload) =>
    apiClient.patch<UpdateBroadcastResponse>(
      `/admin/broadcasts/${id}`,
      payload,
    ),

  deleteBroadcast: (id: string) =>
    apiClient.delete<{ message: string }>(`/admin/broadcasts/${id}`),
};
