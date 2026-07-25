import apiClient from "@/lib/apiClient";
import type {
  AdminBroadcastItem,
  CreateBroadcastPayload,
  UpdateBroadcastPayload,
  AdminBroadcastQueryParams,
  PaginatedAdminBroadcastsResponse,
} from "@/types/adminNotifications";

export const adminNotificationsApi = {
  // 1. Create Broadcast
  createBroadcast: (payload: CreateBroadcastPayload) =>
    apiClient.post<{ message?: string; broadcast?: AdminBroadcastItem }>(
      "/admin/broadcasts",
      payload,
    ),

  // 2. Get Paginated Broadcasts List
  getBroadcasts: (params?: AdminBroadcastQueryParams) =>
    apiClient.get<AdminBroadcastItem[] | PaginatedAdminBroadcastsResponse>(
      "/admin/broadcasts",
      { params },
    ),

  // 3. Get Single Broadcast Details
  getBroadcastById: (id: string) =>
    apiClient.get<
      | AdminBroadcastItem
      | { broadcast: AdminBroadcastItem }
      | { data: AdminBroadcastItem }
    >(`/admin/broadcasts/${id}`),

  // 4. Update Broadcast
  updateBroadcast: (id: string, payload: UpdateBroadcastPayload) =>
    apiClient.patch<{ message?: string; broadcast?: AdminBroadcastItem }>(
      `/admin/broadcasts/${id}`,
      payload,
    ),

  // 5. Delete Broadcast
  deleteBroadcast: (id: string) =>
    apiClient.delete<{ message?: string }>(`/admin/broadcasts/${id}`),
};
