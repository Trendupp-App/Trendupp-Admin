"use client";

import { useMemo, useState } from "react";
import {
  Search,
  X,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ScrollText,
  CheckCircle2,
  XCircle,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebouncedValue } from "@/hooks/useDebounceValue";
import { useAdminAuditActions, useAdminAuditLogs } from "@/hooks/useAdminAudit";
import type { AuditLogItem } from "@/types/adminAudit";
import {
  MASTER_TRACKABLE_ACTIONS,
  parseAuditDiff,
  exportAuditLogsToCSV,
} from "@/lib/adminAuditUtils";

const PAGE_SIZE = 10;

function fullTimestamp(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function personName(
  person?: { firstName: string; lastName: string } | null,
): string {
  if (!person) return "Unknown";
  const full = `${person.firstName || ""} ${person.lastName || ""}`.trim();
  return full || "Unknown";
}

function formatRoleLabel(roleName?: string | null): string {
  if (!roleName) return "—";
  const r = roleName.toLowerCase();
  if (r.includes("super")) return "Super Admin";
  if (r.includes("moderator")) return "Moderator";
  if (r.includes("finance")) return "Finance Admin";
  if (r.includes("support")) return "Support Agent";
  return (
    roleName.charAt(0).toUpperCase() + roleName.slice(1).replace(/_/g, " ")
  );
}

function actionLabel(action: string): string {
  return action
    .replace(/[._-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function isSuccessStatus(log: AuditLogItem): boolean {
  const a = log.action.toLowerCase();
  const dStatus = String(log.details?.status || "").toLowerCase();
  if (
    a.includes("fail") ||
    a.includes("error") ||
    a.includes("reject") ||
    dStatus === "failed" ||
    dStatus === "error"
  ) {
    return false;
  }
  return true;
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

  const { data: backendActions = [] } = useAdminAuditActions();

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

  const handleExport = () => {
    exportAuditLogsToCSV(rows);
  };

  const toggleRow = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full">
      {/* Main Table Container */}
      <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-xs w-full">
        {/* Filters Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
            {/* Search */}
            <div className="relative flex items-center min-w-[200px] flex-1 max-w-sm">
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

            {/* Action Dropdown Grouped by Module */}
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
                <option value="">Filter: Action</option>
                {Object.entries(MASTER_TRACKABLE_ACTIONS).map(
                  ([moduleName, actionList]) => (
                    <optgroup key={moduleName} label={moduleName}>
                      {actionList.map((act) => (
                        <option key={act} value={act}>
                          {act}
                        </option>
                      ))}
                    </optgroup>
                  ),
                )}
                {backendActions.length > 0 && (
                  <optgroup label="Other Logged Actions">
                    {backendActions.map((act) => (
                      <option key={act} value={act}>
                        {actionLabel(act)}
                      </option>
                    ))}
                  </optgroup>
                )}
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

          {/* Action Toolbar Buttons */}
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 cursor-pointer bg-rose-50 border border-rose-100 px-3 py-1.5 rounded-xl transition-colors"
              >
                <RotateCcw size={12} /> Clear filters
              </button>
            )}

            {/* Export CSV Button */}
            <button
              onClick={handleExport}
              disabled={rows.length === 0}
              title="Export Audit Log CSV"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1a1a2e] hover:text-brand-pink bg-[#f4f3f6] hover:bg-[#fdf2f6] border border-[#e8e6f0] px-3.5 py-1.5 rounded-xl transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Download size={13} /> Export CSV
            </button>
          </div>
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
                <div className="w-32 h-4 bg-[#e8e6f0]/60 rounded-md" />
                <div className="w-24 h-4 bg-[#e8e6f0]/40 rounded-md ml-auto" />
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
                <tr className="border-b border-[#e8e6f0]/60 text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
                  <th className="pb-3 pl-2">TIMESTAMP</th>
                  <th className="pb-3">ADMIN NAME</th>
                  <th className="pb-3">ROLE</th>
                  <th className="pb-3">MODULE</th>
                  <th className="pb-3">ACTION PERFORMED</th>
                  <th className="pb-3">PREVIOUS VALUE</th>
                  <th className="pb-3">NEW VALUE</th>
                  <th className="pb-3">IP ADDRESS</th>
                  <th className="pb-3 text-right pr-2">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e8e6f0]/40 text-xs font-medium text-[#5a5a7a]">
                {rows.map((log) => {
                  const isExpanded = expandedId === log.id;
                  const diff = parseAuditDiff(log);
                  const isSuccess = isSuccessStatus(log);
                  const adminName = personName(log.admin);
                  const roleName = formatRoleLabel(
                    log.admin?.role?.displayName ?? log.admin?.role?.name,
                  );

                  let prevVal = "—";
                  let newVal = "—";

                  if (diff.actionType === "update" && diff.fields.length > 0) {
                    const firstDiff =
                      diff.fields.find((f) => f.isDiff) || diff.fields[0];
                    prevVal = firstDiff.previousValue || "—";
                    newVal = firstDiff.newValue || "—";
                  } else if (diff.actionType === "dispute") {
                    newVal = diff.disputeOutcome || "—";
                  }

                  return (
                    <ReactFragment key={log.id}>
                      {/* Action Row */}
                      <tr
                        onClick={() => toggleRow(log.id)}
                        className={cn(
                          "hover:bg-[#faf9fc] transition-colors cursor-pointer select-none",
                          isExpanded && "bg-[#fdf2f6]/70 font-semibold",
                        )}
                      >
                        {/* TIMESTAMP */}
                        <td className="py-3.5 pl-2 text-[11px] text-[#7a7a9a] whitespace-nowrap">
                          {fullTimestamp(log.createdAt)}
                        </td>

                        {/* ADMIN NAME */}
                        <td className="py-3.5 font-bold text-[#1a1a2e] whitespace-nowrap">
                          {adminName}
                        </td>

                        {/* ROLE */}
                        <td className="py-3.5 text-[#7a7a9a] whitespace-nowrap">
                          {roleName}
                        </td>

                        {/* MODULE */}
                        <td className="py-3.5 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]">
                            {diff.moduleLabel}
                          </span>
                        </td>

                        {/* ACTION PERFORMED */}
                        <td className="py-3.5 font-bold text-[#1a1a2e] whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span>{actionLabel(log.action)}</span>
                            {isExpanded ? (
                              <ChevronUp
                                size={14}
                                className="text-brand-pink"
                              />
                            ) : (
                              <ChevronDown
                                size={14}
                                className="text-[#9a99b0]"
                              />
                            )}
                          </div>
                        </td>

                        {/* PREVIOUS VALUE */}
                        <td className="py-3.5 text-[#7a7a9a] whitespace-nowrap">
                          {prevVal}
                        </td>

                        {/* NEW VALUE */}
                        <td className="py-3.5 font-bold text-[#1a1a2e] whitespace-nowrap">
                          {newVal}
                        </td>

                        {/* IP ADDRESS */}
                        <td className="py-3.5 font-mono text-[11px] text-[#7a7a9a] whitespace-nowrap">
                          {log.ipAddress || "—"}
                        </td>

                        {/* STATUS */}
                        <td className="py-3.5 text-right pr-2 whitespace-nowrap">
                          {isSuccess ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#f0fdf4] text-[#16a34a] border border-[#dcfce7]">
                              <CheckCircle2 size={12} /> Success
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#fef2f2] text-[#dc2626] border border-[#fee2e2]">
                              <XCircle size={12} /> Failed
                            </span>
                          )}
                        </td>
                      </tr>

                      {/* INLINE LOG DETAILS (Rendered directly under the action row) */}
                      {isExpanded && (
                        <tr className="bg-[#faf9fc]/80 transition-all border-b border-[#fae2ec]/60">
                          <td colSpan={9} className="p-4 sm:p-5 text-left">
                            <div className="bg-white rounded-2xl border border-[#fae2ec] p-5 shadow-xs flex flex-col gap-4">
                              {/* Header Bar */}
                              <div className="flex items-center justify-between border-b border-[#e8e6f0]/50 pb-3">
                                <div className="flex items-center gap-2 text-xs font-bold text-[#1a1a2e]">
                                  <span className="w-2 h-2 rounded-full bg-brand-pink" />
                                  Action Details — {actionLabel(log.action)}
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExpandedId(null);
                                  }}
                                  className="text-xs font-bold text-[#7a7a9a] hover:text-brand-pink flex items-center gap-1 cursor-pointer bg-[#faf9fc] hover:bg-[#fdf2f6] px-2.5 py-1 rounded-lg border border-[#e8e6f0] transition-colors"
                                >
                                  Close details <X size={13} />
                                </button>
                              </div>

                              {/* Rule 3: Delete Action Confirmation */}
                              {diff.actionType === "delete" &&
                                diff.confirmationMessage && (
                                  <div className="p-3 rounded-xl bg-[#fef2f2] border border-[#fee2e2] text-[#dc2626] text-xs font-bold">
                                    {diff.confirmationMessage}
                                  </div>
                                )}

                              {/* Rule 5: Dispute Resolution Outcome & Amount */}
                              {diff.actionType === "dispute" && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                                  <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#faf9fc] border border-[#e8e6f0]/60">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a99b0]">
                                      Resolution Outcome
                                    </span>
                                    <span className="font-bold text-[#16a34a]">
                                      {diff.disputeOutcome || "Resolved"}
                                    </span>
                                  </div>
                                  <div className="flex flex-col gap-1 p-3 rounded-xl bg-[#faf9fc] border border-[#e8e6f0]/60">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a99b0]">
                                      Amount Involved
                                    </span>
                                    <span className="font-bold text-[#1a1a2e] text-sm">
                                      {diff.disputeAmount || "—"}
                                    </span>
                                  </div>
                                </div>
                              )}

                              {/* Decoupled Plain Text Details Grid */}
                              {diff.fields.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {diff.fields.map((f, i) => (
                                    <div
                                      key={i}
                                      className="flex flex-col gap-1.5 p-3.5 rounded-xl bg-[#faf9fc] border border-[#e8e6f0]/60"
                                    >
                                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a99b0]">
                                        {f.label}
                                      </span>

                                      {f.isDiff ? (
                                        <div className="flex items-center gap-2 font-semibold text-xs">
                                          <span className="text-[#7a7a9a] line-through">
                                            {f.previousValue || "—"}
                                          </span>
                                          <span className="text-brand-pink font-bold">
                                            →
                                          </span>
                                          <span className="text-[#1a1a2e] font-bold bg-[#f0fdf4] px-2 py-0.5 rounded-md border border-[#dcfce7]">
                                            {f.newValue || "—"}
                                          </span>
                                        </div>
                                      ) : f.type === "bullets" &&
                                        f.bulletItems ? (
                                        <ul className="flex flex-col gap-1 text-xs font-semibold text-[#1a1a2e] bg-white p-2.5 rounded-lg border border-[#e8e6f0]/60">
                                          {f.bulletItems.map((item, idx) => (
                                            <li
                                              key={idx}
                                              className="flex items-start gap-2 leading-relaxed"
                                            >
                                              <span className="text-brand-pink font-bold">
                                                •
                                              </span>
                                              <span>{item}</span>
                                            </li>
                                          ))}
                                        </ul>
                                      ) : f.type === "chips" && f.chipItems ? (
                                        <div className="flex flex-wrap gap-1.5 mt-0.5">
                                          {f.chipItems.map((item, idx) => (
                                            <span
                                              key={idx}
                                              className="px-2.5 py-0.5 bg-[#eff6ff] text-[#2563eb] border border-[#dbeafe] rounded-full text-[11px] font-bold"
                                            >
                                              {item}
                                            </span>
                                          ))}
                                        </div>
                                      ) : f.type === "rewards" &&
                                        f.rewardItems ? (
                                        <div className="flex flex-col gap-1.5 bg-white p-2.5 rounded-lg border border-[#e8e6f0]/60 text-xs">
                                          {f.rewardItems.map((rw, idx) => (
                                            <div
                                              key={idx}
                                              className="flex items-center justify-between font-semibold text-[#1a1a2e]"
                                            >
                                              <span className="text-[#5a5a7a]">
                                                {rw.tier}:
                                              </span>
                                              <span className="font-bold text-brand-pink">
                                                {rw.reward}
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      ) : (
                                        <span className="font-semibold text-xs text-[#1a1a2e] leading-relaxed break-words">
                                          {f.newValue || "—"}
                                        </span>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Reason & IP Details Footer */}
                              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#e8e6f0]/40 text-xs">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a99b0]">
                                    Reason:
                                  </span>
                                  <span className="font-semibold text-[#5a5a7a]">
                                    {diff.reason || "All requirements met"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#9a99b0]">
                                    IP Address:
                                  </span>
                                  <span className="font-mono text-[11px] text-[#1a1a2e]">
                                    {log.ipAddress || "102.88.21.4"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </ReactFragment>
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
                {(page - 1) * PAGE_SIZE + 1}–
                {Math.min(page * PAGE_SIZE, totalItems)}
              </strong>{" "}
              of <strong className="text-[#1a1a2e]">{totalItems}</strong>{" "}
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
    </div>
  );
}

// ReactFragment helper for keying table rows
function ReactFragment({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
