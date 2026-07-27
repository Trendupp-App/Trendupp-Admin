import apiClient from "@/lib/apiClient";
import type {
  InboxListParams,
  InboxNotification,
  InboxUnreadCountResponse,
  InboxUpdatedCountResponse,
  PaginatedInboxResponse,
} from "@/types/adminInbox";

export const adminInboxApi = {
  // 1. Paginated notification feed for the signed-in admin
  list: (params?: InboxListParams) =>
    apiClient.get<PaginatedInboxResponse>("/admin/notifications", { params }),

  // 2. Unread badge count
  unreadCount: () =>
    apiClient.get<InboxUnreadCountResponse>(
      "/admin/notifications/unread-count",
    ),

  // 3. Mark everything as seen (clears the badge; items stay unread)
  markSeen: () =>
    apiClient.patch<InboxUpdatedCountResponse>("/admin/notifications/seen"),

  // 4. Mark everything as read
  markAllRead: () =>
    apiClient.patch<InboxUpdatedCountResponse>("/admin/notifications/read-all"),

  // 5. Mark a single notification as read
  markRead: (id: string) =>
    apiClient.patch<InboxNotification>(`/admin/notifications/${id}/read`),
};
