"use client";

import { useMemo, useState } from "react";
import {
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  RotateCcw,
  ScrollText,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatRelativeTime } from "@/lib/formatRelativeTime";
import UserAvatar from "@/shared/UserAvatar";
import { useDebouncedValue } from "@/hooks/useDebounceValue";
import { useAdminAuditActions, useAdminAuditLogs } from "@/hooks/useAdminAudit";
import type { AuditLogItem } from "@/types/adminAudit";

const PAGE_SIZE = 20;

function actionBadgeClass(action: string): string {
  const a = action.toLowerCase();
  if (/(delete|remove|suspend|block|reject|revoke|fail)/.test(a)) {
    return "text-rose-600 bg-rose-50 border-rose-100";
  }
  if (/(create|approve|activate|release|resolve|invite)/.test(a)) {
    return "text-[#16a34a] bg-[#f0fdf4] border-[#dcfce7]";
  }
  if (/(update|edit|change|assign|transfer)/.test(a)) {
    return "text-[#2f63eb] bg-[#edf2fe] border-[#dbeafe]";
  }
  if (/(login|logout|auth|password|otp|security)/.test(a)) {
    return "text-[#ca8a04] bg-[#fef9e7] border-[#fef3c7]";
  }
  return "text-[#5a5a7a] bg-[#f4f3f6] border-[#e8e6f0]";
}

function actionLabel(action: string): string {
  return action.replace(/[._-]+/g, " ");
}

function fullTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function personName(
  person?: { firstName: string; lastName: string } | null,
): string {
  if (!person) return "—";
  return `${person.firstName} ${person.lastName}`.trim() || "—";
}

function initialsOf(
  person?: { firstName: string; lastName: string } | null,
): string {
  if (!person) return "?";
  return (
    `${person.firstName?.[0] ?? ""}${person.lastName?.[0] ?? ""}`.toUpperCase() ||
    "?"
  );
}

export default function AuditLogTable() {
  const [search, setSearch] = useState("");
  const [selectedAction, setSelectedAction] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const debouncedSearch = useDebouncedValue(search);

  const { data, isLoading, isError, refetch } = useAdminAuditLogs({
    page,
    limit: PAGE_SIZE,
    action: selectedAction || undefined,
    q: debouncedSearch || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  });
  const { data: actions = [] } = useAdminAuditActions();

  const rows: AuditLogItem[] = useMemo(() => data?.data ?? [], [data]);
  const totalItems = data?.pagination.total ?? 0;
  const totalPages = data?.pagination.pages || 1;

  const hasActiveFilters =
    search !== "" ||
    selectedAction !== "" ||
    startDate !== "" ||
    endDate !== "";

  const clearAllFilters = () => {
    setSearch("");
    setSelectedAction("");
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-sm">
      {/* Filters Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
          {/* Search */}
          <div className="relative flex items-center min-w-[240px] flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 text-[#9a99b0]" />
            <input
              type="text"
              placeholder="Search by action name..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="h-9 w-full bg-white border border-[#e8e6f0] rounded-xl pl-9 pr-8 text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:ring-1 focus:ring-brand-pink/30"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 text-[#9a99b0] hover:text-[#1a1a2e]"
              >
                <X size={12} />
              </button>
            )}
          </div>

          {/* Action dropdown */}
          <div className="relative">
            <select
              value={selectedAction}
              onChange={(e) => {
                setSelectedAction(e.target.value);
                setPage(1);
              }}
              className={cn(
                "h-9 pl-4 pr-9 rounded-xl bg-white border text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-pink/30 cursor-pointer appearance-none transition-all max-w-[220px]",
                selectedAction
                  ? "border-brand-pink text-brand-pink bg-rose-50/20"
                  : "border-[#e8e6f0] text-[#1a1a2e]",
              )}
            >
              <option value="">Action</option>
              {actions.map((a) => (
                <option key={a} value={a}>
                  {actionLabel(a)}
                </option>
              ))}
            </select>
            <ChevronDown
              size={13}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none",
                selectedAction ? "text-brand-pink" : "text-[#9a99b0]",
              )}
            />
          </div>

          {/* Date range */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={startDate}
              max={endDate || undefined}
              onChange={(e) => {
                setStartDate(e.target.value);
                setPage(1);
              }}
              className={cn(
                "h-9 px-3 rounded-xl bg-white border text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-pink/30 cursor-pointer",
                startDate
                  ? "border-brand-pink text-brand-pink"
                  : "border-[#e8e6f0] text-[#5a5a7a]",
              )}
            />
            <span className="text-[10px] font-bold text-[#9a99b0]">to</span>
            <input
              type="date"
              value={endDate}
              min={startDate || undefined}
              onChange={(e) => {
                setEndDate(e.target.value);
                setPage(1);
              }}
              className={cn(
                "h-9 px-3 rounded-xl bg-white border text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-brand-pink/30 cursor-pointer",
                endDate
                  ? "border-brand-pink text-brand-pink"
                  : "border-[#e8e6f0] text-[#5a5a7a]",
              )}
            />
          </div>
        </div>

        {/* Clear All Filters Button */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl transition-colors"
          >
            <RotateCcw size={12} /> Clear all filters
          </button>
        )}
      </div>

      {/* Table Content */}
      {isLoading ? (
        <div className="flex flex-col gap-3 py-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-14 w-full bg-[#faf9fc] rounded-2xl animate-pulse flex items-center px-4 gap-4"
            >
              <div className="w-24 h-4 bg-[#e8e6f0]/60 rounded-md" />
              <div className="w-8 h-8 rounded-full bg-[#e8e6f0]/60 shrink-0" />
              <div className="w-32 h-4 bg-[#e8e6f0]/60 rounded-md" />
              <div className="w-40 h-4 bg-[#e8e6f0]/40 rounded-md ml-auto" />
              <div className="w-20 h-4 bg-[#e8e6f0]/60 rounded-md" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="py-12 px-4 flex flex-col items-center justify-center text-center bg-[#faf9fc] rounded-2xl border border-dashed border-[#e8e6f0]">
          <ScrollText size={32} className="text-[#9a99b0] mb-3" />
          <h3 className="text-sm font-bold text-[#1a1a2e]">
            Failed to Load Audit Logs
          </h3>
          <p className="text-xs text-[#7a7a9a] mt-1 max-w-sm">
            Something went wrong while fetching the audit trail. Please try
            again.
          </p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-brand-pink text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-1.5"
          >
            <RotateCcw size={13} /> Retry
          </button>
        </div>
      ) : rows.length === 0 ? (
        <div className="py-12 px-4 flex flex-col items-center justify-center text-center bg-[#faf9fc] rounded-2xl border border-dashed border-[#e8e6f0]">
          <ScrollText size={32} className="text-[#9a99b0] mb-3" />
          <h3 className="text-sm font-bold text-[#1a1a2e]">
            No Audit Logs Found
          </h3>
          <p className="text-xs text-[#7a7a9a] mt-1 max-w-sm">
            {hasActiveFilters
              ? "No entries match your filter criteria. Try adjusting or resetting your active filters."
              : "Privileged admin actions will appear here as they happen."}
          </p>
          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="mt-4 px-4 py-2 bg-brand-pink text-white text-xs font-bold rounded-xl hover:opacity-90 transition-opacity cursor-pointer inline-flex items-center gap-1.5"
            >
              <RotateCcw size={13} /> Reset All Filters
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6 px-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#e8e6f0]/40 text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                <th className="pb-3.5 pl-2">Action</th>
                <th className="pb-3.5">Admin</th>
                <th className="pb-3.5">Target User</th>
                <th className="pb-3.5">IP Address</th>
                <th className="pb-3.5">When</th>
                <th className="pb-3.5 text-right pr-2">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e8e6f0]/30 text-xs">
              {rows.map((log) => {
                const isExpanded = expandedId === log.id;
                return (
                  <AuditRow
                    key={log.id}
                    log={log}
                    isExpanded={isExpanded}
                    onToggle={() => setExpandedId(isExpanded ? null : log.id)}
                  />
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Footer */}
      {totalItems > 0 && (
        <div className="flex items-center justify-between border-t border-[#e8e6f0]/60 pt-4 text-xs">
          <span className="text-[#7a7a9a] font-medium">
            Showing{" "}
            <strong className="text-[#1a1a2e]">
              {(page - 1) * PAGE_SIZE + 1}
            </strong>{" "}
            to{" "}
            <strong className="text-[#1a1a2e]">
              {Math.min(page * PAGE_SIZE, totalItems)}
            </strong>{" "}
            of <strong className="text-[#1a1a2e]">{totalItems}</strong> log
            entries
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1 || isLoading}
              className="h-8 px-3 rounded-xl border border-[#e8e6f0] text-[#1a1a2e] font-semibold flex items-center gap-1 hover:bg-[#f4f3f6] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft size={14} /> Previous
            </button>
            <span className="px-2 font-bold text-[#1a1a2e]">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page >= totalPages || isLoading}
              className="h-8 px-3 rounded-xl border border-[#e8e6f0] text-[#1a1a2e] font-semibold flex items-center gap-1 hover:bg-[#f4f3f6] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              Next <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

function AuditRow({
  log,
  isExpanded,
  onToggle,
}: {
  log: AuditLogItem;
  isExpanded: boolean;
  onToggle: () => void;
}) {
  const hasDetails =
    (log.details && Object.keys(log.details).length > 0) || !!log.userAgent;

  return (
    <>
      <tr className="hover:bg-[#faf9fc]/40 transition-colors">
        <td className="py-3 pl-2">
          <span
            className={cn(
              "px-2 py-0.5 rounded-md text-[10px] font-bold border capitalize whitespace-nowrap",
              actionBadgeClass(log.action),
            )}
          >
            {actionLabel(log.action)}
          </span>
        </td>
        <td className="py-3">
          <div className="flex items-center gap-2">
            <UserAvatar initials={initialsOf(log.admin)} size={28} />
            <div className="flex flex-col">
              <span className="font-semibold text-[#1a1a2e]">
                {personName(log.admin)}
              </span>
              <span className="text-[10px] text-[#9a99b0]">
                {log.admin?.role?.displayName ?? log.admin?.email ?? "—"}
              </span>
            </div>
          </div>
        </td>
        <td className="py-3">
          {log.targetUser ? (
            <div className="flex flex-col">
              <span className="font-semibold text-[#1a1a2e]">
                {personName(log.targetUser)}
              </span>
              <span className="text-[10px] text-[#9a99b0]">
                {log.targetUser.email}
              </span>
            </div>
          ) : (
            <span className="text-[#9a99b0]">—</span>
          )}
        </td>
        <td className="py-3 text-[#5a5a7a] font-mono text-[10px] whitespace-nowrap">
          {log.ipAddress || "—"}
        </td>
        <td
          className="py-3 text-[#9a99b0] whitespace-nowrap"
          title={fullTimestamp(log.createdAt)}
        >
          {formatRelativeTime(log.createdAt)}
        </td>
        <td className="py-3 text-right pr-2">
          {hasDetails ? (
            <button
              onClick={onToggle}
              className="h-8 px-3.5 bg-[#eff6ff] text-[#2563eb] rounded-xl hover:bg-[#dbeafe] transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 text-xs font-bold shrink-0"
            >
              {isExpanded ? (
                <>
                  Hide <ChevronUp size={13} className="shrink-0" />
                </>
              ) : (
                <>
                  View <ChevronDown size={13} className="shrink-0" />
                </>
              )}
            </button>
          ) : (
            <span className="text-[#9a99b0]">—</span>
          )}
        </td>
      </tr>
      {isExpanded && hasDetails && (
        <tr className="bg-[#faf9fc]/60">
          <td colSpan={6} className="px-2 py-3">
            <div className="flex flex-col gap-2 rounded-2xl border border-[#e8e6f0]/60 bg-white p-4">
              {log.details && Object.keys(log.details).length > 0 && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                    Details
                  </span>
                  <pre className="text-[11px] text-[#1a1a2e] bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-xl p-3 overflow-x-auto whitespace-pre-wrap break-all">
                    {JSON.stringify(log.details, null, 2)}
                  </pre>
                </div>
              )}
              {log.userAgent && (
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                    User Agent
                  </span>
                  <span className="text-[11px] text-[#5a5a7a] break-all">
                    {log.userAgent}
                  </span>
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
