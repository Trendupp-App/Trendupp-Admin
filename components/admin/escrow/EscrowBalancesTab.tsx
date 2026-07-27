"use client";

import { useState } from "react";
import {
  SlidersHorizontal,
  Download,
  ChevronLeft,
  ChevronRight,
  Info,
  Search,
} from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { useEscrowBalances } from "@/hooks/useAdminEscrow";
import { downloadCsv } from "@/lib/exportUtils";
import { toast } from "sonner";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n?: number) {
  if (!n && n !== 0) return "₦—";
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(1)}K`;
  return `₦${n.toLocaleString()}`;
}

const ESCROW_STATUSES = [
  "All",
  "funded",
  "held",
  "released",
  "processing",
  "failed",
  "refunded",
  "pending",
  "completed",
];

export default function EscrowBalancesTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const LIMIT = 10;

  const { data, isLoading, isFetching } = useEscrowBalances(page, LIMIT);

  const items = data?.data ?? [];
  const total = data?.meta?.total ?? data?.total ?? items.length;
  const totalPages = data?.meta?.totalPages ?? Math.ceil(total / LIMIT);

  // Client-side search + status filter
  const filtered = items.filter((item) => {
    const title = (
      item.campaignTitle ??
      item.campaign?.title ??
      ""
    ).toLowerCase();
    const brand = (item.brand?.name ?? item.brandName ?? "").toLowerCase();
    const creator = (
      item.creator?.name ??
      item.creatorName ??
      ""
    ).toLowerCase();
    const q = search.toLowerCase();

    const matchesSearch =
      !search || title.includes(q) || brand.includes(q) || creator.includes(q);
    const matchesStatus =
      statusFilter === "All" ||
      (item.status ?? "").toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const headers = [
      "Campaign",
      "Campaign ID",
      "Brand",
      "Creator",
      "Total Amount",
      "Escrow Amount",
      "Status",
      "Due Date",
      "Last Updated",
    ];
    const rows = filtered.map((item) => [
      item.campaignTitle ?? item.campaign?.title ?? "",
      item.campaignId ?? item.campaign?.id ?? item.id,
      item.brand?.name ?? item.brandName ?? "",
      item.creator?.name ?? item.creatorName ?? "",
      item.totalAmount ?? item.amount ?? 0,
      item.escrowAmount ?? item.totalAmount ?? 0,
      item.status,
      item.dueDate ?? "",
      item.lastUpdated ?? item.updatedAt ?? item.createdAt ?? "",
    ]);
    downloadCsv(
      `Trendupp_Escrow_Balances_${new Date().toISOString().slice(0, 10)}`,
      headers,
      rows,
    );
    toast.success("Escrow balances exported");
  };

  const currentEscrowTotal =
    data?.currentMoneyInEscrow ??
    data?.totalMoneyInEscrow ??
    items.reduce(
      (acc, i) => acc + (i.totalFunded ?? i.escrowAmount ?? i.totalAmount ?? 0),
      0,
    );

  const lastUpdatedText = data?.lastUpdated
    ? new Date(data.lastUpdated).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : `${new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}, ${new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}`;

  return (
    <div className="flex flex-col gap-4">
      {/* Current Money in Escrow Hero Card */}
      <div className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-5 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-[#fce4f3] flex items-center justify-center text-[#e91e8c]">
            <svg
              width="22"
              height="22"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <line x1="2" y1="10" x2="22" y2="10" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-[#7a7a9a] font-medium">
              Current Money in Escrow
            </p>
            <p className="text-2xl font-bold text-[#1a1a2e] tracking-tight mt-0.5">
              {fmt(currentEscrowTotal)}
            </p>
          </div>
        </div>
        <span className="text-[11px] text-[#9a99b0]">
          Last updated: {lastUpdatedText}
        </span>
      </div>

      {/* Notice Banner */}
      <div className="flex items-center justify-between bg-[#f0f6ff] border border-[#dbeafe] rounded-2xl px-4 py-3 shadow-xs">
        <div className="flex items-center gap-3">
          <Info size={16} className="text-[#2563eb] shrink-0" />
          <p className="text-xs text-[#1e40af] font-medium leading-normal">
            This table shows all funds currently sitting in escrow. Disburse
            funds for completed campaign deliverables via{" "}
            <span className="font-bold text-[#1e3a8a]">
              Pay via Payment Portal
            </span>
            .
          </p>
        </div>
        <a
          href="#"
          className="text-xs text-[#2563eb] font-semibold hover:underline shrink-0 ml-3 whitespace-nowrap"
        >
          Learn more &rarr;
        </a>
      </div>

      {/* Filters + Search Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 mt-1">
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99b0]"
            />
            <input
              type="text"
              placeholder="Search campaign, brand..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-8 pr-3 py-1.5 text-xs border border-[#e8e6f0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#e91e8c]/20 w-52"
            />
          </div>

          {/* Status filter */}
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs border border-[#e8e6f0] rounded-lg px-3 py-1.5 bg-white text-[#4a4a6a] focus:outline-none focus:ring-2 focus:ring-[#e91e8c]/20"
          >
            {ESCROW_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "All"
                  ? "All Statuses"
                  : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 text-xs border border-[#e8e6f0] rounded-lg px-3 py-1.5 bg-white text-[#4a4a6a] hover:bg-[#f4f3f6] transition-colors">
            <SlidersHorizontal size={12} /> Filters
          </button>
          <button
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 text-xs border border-[#e8e6f0] rounded-lg px-3 py-1.5 bg-white text-[#4a4a6a] hover:bg-[#f4f3f6] transition-colors"
          >
            <Download size={12} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#e8e6f0]/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#f4f3f6] bg-[#fafafa]">
                <th className="px-5 py-3 text-[10px] font-semibold text-[#7a7a9a] uppercase tracking-wide">
                  Campaign Title
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold text-[#7a7a9a] uppercase tracking-wide">
                  Brand
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold text-[#7a7a9a] uppercase tracking-wide">
                  Creator
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold text-[#7a7a9a] uppercase tracking-wide">
                  Total Amount
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold text-[#7a7a9a] uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold text-[#7a7a9a] uppercase tracking-wide">
                  Campaign ID
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold text-[#7a7a9a] uppercase tracking-wide">
                  Completion
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold text-[#7a7a9a] uppercase tracking-wide">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#f4f3f6]">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-[#f4f3f6] rounded animate-pulse w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={8}
                    className="px-5 py-10 text-center text-[#9a99b0] text-xs"
                  >
                    No escrow records found
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => {
                  const campaignTitle =
                    item.campaignTitle ??
                    item.campaign?.title ??
                    `Campaign #${item.campaignId ?? item.id}`;
                  const brandName =
                    item.advertiser?.name ??
                    item.brand?.name ??
                    item.brandName ??
                    "—";
                  const creatorName =
                    item.creator?.name ?? item.creatorName ?? "—";
                  const total =
                    item.totalFunded ?? item.totalAmount ?? item.amount ?? 0;
                  const campaignId =
                    item.campaignId ?? item.campaign?.id ?? item.id;
                  const completion = item.completionPercentage;
                  const statusStr =
                    item.fundingStatus ??
                    item.campaignStatus ??
                    item.status ??
                    "pending";

                  const isActionable = ["funded", "held", "completed"].includes(
                    statusStr.toLowerCase(),
                  );

                  return (
                    <tr
                      key={item.id ?? idx}
                      className={`border-b border-[#f4f3f6] hover:bg-[#fafafa] transition-colors ${isFetching ? "opacity-60" : ""}`}
                    >
                      <td className="px-5 py-3">
                        <span className="font-semibold text-[#1a1a2e] line-clamp-1 max-w-[180px] block">
                          {campaignTitle}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#4a4a6a]">{brandName}</td>
                      <td className="px-4 py-3 text-[#4a4a6a]">
                        {creatorName}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#1a1a2e]">
                        {fmt(total)}
                      </td>
                      <td className="px-4 py-3">
                        <AdminStatusBadge status={statusStr} />
                      </td>
                      <td className="px-4 py-3 text-[#7a7a9a] font-mono text-[10px]">
                        {campaignId
                          ? String(campaignId).slice(0, 8) + "…"
                          : "—"}
                      </td>
                      <td className="px-4 py-3">
                        {completion !== undefined ? (
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-[#f0eef8] rounded-full overflow-hidden w-16">
                              <div
                                className="h-full bg-[#e91e8c] rounded-full"
                                style={{
                                  width: `${Math.min(completion, 100)}%`,
                                }}
                              />
                            </div>
                            <span className="text-[#4a4a6a] text-[10px]">
                              {completion}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-[#9a99b0]">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isActionable ? (
                          <button className="inline-flex items-center gap-1 text-[10px] font-semibold text-white bg-[#e91e8c] hover:bg-[#c91878] px-2.5 py-1 rounded-lg transition-colors whitespace-nowrap">
                            Pay via Payment Portal
                          </button>
                        ) : (
                          <span className="text-[10px] text-[#9a99b0]">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-[#f4f3f6] bg-[#fafafa]">
            <span className="text-[10px] text-[#7a7a9a]">
              Page {page} of {totalPages} &bull; {total} records
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1 rounded-lg border border-[#e8e6f0] text-[#4a4a6a] disabled:opacity-40 hover:bg-[#f4f3f6] transition-colors"
              >
                <ChevronLeft size={13} />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pg =
                  totalPages <= 5
                    ? i + 1
                    : page <= 3
                      ? i + 1
                      : page >= totalPages - 2
                        ? totalPages - 4 + i
                        : page - 2 + i;
                return (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={`w-7 h-7 text-[10px] font-semibold rounded-lg border transition-colors ${pg === page ? "bg-[#e91e8c] text-white border-[#e91e8c]" : "border-[#e8e6f0] text-[#4a4a6a] hover:bg-[#f4f3f6]"}`}
                  >
                    {pg}
                  </button>
                );
              })}
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1 rounded-lg border border-[#e8e6f0] text-[#4a4a6a] disabled:opacity-40 hover:bg-[#f4f3f6] transition-colors"
              >
                <ChevronRight size={13} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
