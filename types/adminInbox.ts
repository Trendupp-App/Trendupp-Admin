export type InboxCategory =
  | "campaigns"
  | "applications"
  | "payments"
  | "chatDispute"
  | "account"
  | "security"
  | "broadcast";

export type InboxPriority = "critical" | "high" | "medium" | "low";

export type InboxEmailStatus = "skipped" | "sent" | "mocked" | "failed";

export interface InboxActor {
  id: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
}

export interface InboxNotification {
  id: string;
  /** Catalog key, e.g. "payout.released" */
  type: string;
  /** Preference category it was gated on, or "security" */
  category: string;
  priority: InboxPriority;
  title: string;
  body: string;
  /** Client deep-link path (in-admin route) */
  actionUrl: string | null;
  /** Raw event payload for client-side rendering/deep-linking */
  data: Record<string, unknown>;
  /** Set when the badge was cleared */
  seenAt: string | null;
  /** Set when the item was opened */
  readAt: string | null;
  /** Delivery status of the email leg */
  emailStatus: InboxEmailStatus;
  createdAt: string;
  /** Who triggered the event (brand accepting, admin resolving, ...) */
  actor?: InboxActor | null;
}

export interface InboxPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedInboxResponse {
  data: InboxNotification[];
  pagination: InboxPagination;
}

export interface InboxUnreadCountResponse {
  count: number;
}

export interface InboxUpdatedCountResponse {
  updated: number;
}

export interface InboxListParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
  category?: InboxCategory;
}
