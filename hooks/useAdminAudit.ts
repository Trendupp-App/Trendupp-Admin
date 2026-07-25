import { useQuery } from "@tanstack/react-query";
import { adminAuditApi } from "@/services/adminAuditApi";
import type { AuditLogListParams } from "@/types/adminAudit";

export function useAdminAuditLogs(
  params?: AuditLogListParams,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ["admin-audit-logs", params],
    queryFn: () => adminAuditApi.getAuditLogs(params).then((res) => res.data),
    staleTime: 1000 * 30,
    enabled,
  });
}

export function useAdminAuditActions(enabled: boolean = true) {
  return useQuery({
    queryKey: ["admin-audit-actions"],
    queryFn: () => adminAuditApi.getActions().then((res) => res.data.actions),
    staleTime: 1000 * 60 * 5,
    enabled,
  });
}
