export interface AuditAdminRole {
  name: string;
  displayName: string;
}

export interface AuditAdmin {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: AuditAdminRole | null;
}

export interface AuditTargetUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface AuditLogItem {
  id: string;
  action: string;
  adminId: string;
  targetUserId: string | null;
  ipAddress: string | null;
  userAgent: string | null;
  details: Record<string, unknown> | null;
  createdAt: string;
  admin?: AuditAdmin | null;
  targetUser?: AuditTargetUser | null;
}

export interface AuditPagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface PaginatedAuditLogsResponse {
  data: AuditLogItem[];
  pagination: AuditPagination;
}

export interface AuditActionsResponse {
  actions: string[];
}

export interface AuditLogListParams {
  page?: number;
  limit?: number;
  /** Exact action name (from the actions endpoint) */
  action?: string;
  /** Substring match on the action name */
  q?: string;
  adminId?: string;
  targetUserId?: string;
  /** Actions whose route targeted this campaign */
  campaignId?: string;
  startDate?: string;
  endDate?: string;
}
