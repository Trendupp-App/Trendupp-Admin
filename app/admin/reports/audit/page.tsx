"use client";

import AuditLogTable from "@/components/admin/reports/AuditLogTable";

export default function AuditLogsPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 animate-fade-in-up">
      {/* Title Header */}
      <div>
        <h1 className="text-xl font-bold text-[#1a1a2e]">Audit Logs</h1>
        <p className="text-xs text-[#7a7a9a] mt-0.5">
          Immutable trail of every privileged admin action across the platform
        </p>
      </div>

      <AuditLogTable />
    </div>
  );
}
