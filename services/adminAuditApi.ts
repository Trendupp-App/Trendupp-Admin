import apiClient from "@/lib/apiClient";
import type {
  AuditActionsResponse,
  AuditLogListParams,
  PaginatedAuditLogsResponse,
} from "@/types/adminAudit";

export const adminAuditApi = {
  // 1. Paginated audit trail (newest first)
  getAuditLogs: (params?: AuditLogListParams) =>
    apiClient.get<PaginatedAuditLogsResponse>("/admin/audit-logs", { params }),

  // 2. Distinct action names for the filter dropdown
  getActions: () =>
    apiClient.get<AuditActionsResponse>("/admin/audit-logs/actions"),
};
