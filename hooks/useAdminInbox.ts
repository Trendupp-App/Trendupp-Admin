import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { adminInboxApi } from "@/services/adminInboxApi";
import type { InboxCategory } from "@/types/adminInbox";
import { toast } from "sonner";
import type { AxiosError } from "axios";

const INBOX_LIST_KEY = "admin-inbox-list";
const INBOX_UNREAD_COUNT_KEY = "admin-inbox-unread-count";

export function useInboxNotifications(
  category?: InboxCategory,
  enabled: boolean = true,
) {
  return useInfiniteQuery({
    queryKey: [INBOX_LIST_KEY, category ?? "all"],
    queryFn: async ({ pageParam }) => {
      const res = await adminInboxApi.list({
        page: pageParam,
        limit: 15,
        category,
      });
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, pages } = lastPage.pagination;
      return page < pages ? page + 1 : undefined;
    },
    staleTime: 1000 * 30,
    enabled,
  });
}

export function useUnreadCount(enabled: boolean = true) {
  return useQuery({
    queryKey: [INBOX_UNREAD_COUNT_KEY],
    queryFn: () => adminInboxApi.unreadCount().then((res) => res.data.count),
    refetchInterval: 45_000,
    refetchIntervalInBackground: false,
    staleTime: 1000 * 30,
    enabled,
  });
}

export function useMarkSeen() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => adminInboxApi.markSeen(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INBOX_UNREAD_COUNT_KEY] });
    },
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => adminInboxApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INBOX_LIST_KEY] });
      queryClient.invalidateQueries({ queryKey: [INBOX_UNREAD_COUNT_KEY] });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ?? "Failed to mark notifications as read",
      );
    },
  });
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminInboxApi.markRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [INBOX_LIST_KEY] });
      queryClient.invalidateQueries({ queryKey: [INBOX_UNREAD_COUNT_KEY] });
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      toast.error(
        err?.response?.data?.message ?? "Failed to mark notification as read",
      );
    },
  });
}
