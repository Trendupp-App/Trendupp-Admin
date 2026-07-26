"use client";

import { useAdminAuditLogs } from "@/hooks/useAdminAudit";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import type { AuditLogItem } from "@/types/adminAudit";

interface CampaignAuditLogTabProps {
  campaignId: string;
}

const prettyAction = (action: string) =>
  action
    .toLowerCase()
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");

const reasonOf = (row: AuditLogItem): string => {
  const body = (row.details as { body?: { reason?: unknown } } | null)?.body;
  return typeof body?.reason === "string" && body.reason ? body.reason : "—";
};

export default function CampaignAuditLogTab({
  campaignId,
}: CampaignAuditLogTabProps) {
  const { data, isLoading } = useAdminAuditLogs({ campaignId, limit: 50 });
  const logs = data?.data ?? [];

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 text-left">
      <div className="flex justify-between items-center border-b border-[#e8e6f0]/40 pb-3">
        <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
          Audit Log &mdash; Immutable administrative record
        </h3>
      </div>

      {isLoading && (
        <div className="flex flex-col gap-2 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-full h-9 bg-[#faf9fc] rounded-xl" />
          ))}
        </div>
      )}

      {!isLoading && logs.length === 0 && (
        <p className="text-xs text-[#9a99b0] text-center py-8">
          No administrative actions recorded for this campaign yet.
        </p>
      )}

      {!isLoading && logs.length > 0 && (
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#e8e6f0]/40 text-[9px] font-bold text-[#9a99b0] uppercase tracking-wider">
                <th className="pb-3 pl-2">Admin</th>
                <th className="pb-3">Role</th>
                <th className="pb-3">Action</th>
                <th className="pb-3">Reason</th>
                <th className="pb-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e6f0]/30 font-medium">
              {logs.map((row) => (
                <tr key={row.id} className="hover:bg-[#faf9fc]/30">
                  <td className="py-3.5 pl-2 font-bold text-[#1a1a2e]">
                    {row.admin
                      ? `${row.admin.firstName ?? ""} ${row.admin.lastName ?? ""}`.trim() ||
                        row.admin.email
                      : "—"}
                  </td>
                  <td className="py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#fff1f2] text-brand-pink capitalize">
                      {row.admin?.role?.displayName ??
                        row.admin?.role?.name?.replace("_", " ") ??
                        "—"}
                    </span>
                  </td>
                  <td className="py-3.5 font-semibold text-[#1a1a2e]">
                    {prettyAction(row.action)}
                  </td>
                  <td className="py-3.5 text-[#5a5a7a] font-medium max-w-56 truncate">
                    {reasonOf(row)}
                  </td>
                  <td
                    className="py-3.5 text-[#9a99b0] font-semibold"
                    title={new Date(row.createdAt).toLocaleString()}
                  >
                    {formatRelativeTime(row.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
