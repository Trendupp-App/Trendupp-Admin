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

import type {
  EscrowBalanceItem,
  EscrowBreakdownDto,
} from "@/types/adminEscrow";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n?: number) {
  if (!n && n !== 0) return "₦—";
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(1)}K`;
  return `₦${n.toLocaleString()}`;
}

type EscrowRowItem = EscrowBalanceItem & {
  breakdown?: EscrowBreakdownDto;
};

const DEFAULT_BALANCES: EscrowRowItem[] = [
  {
    id: "bal-1",
    campaignTitle: "Summer Style Collection 2025",
    advertiser: { name: "Konga" },
    totalFunded: 3500000,
    breakdown: {
      netAmount: 2712500,
      commission: 525000,
      vat: 262500,
    },
    fundingStatus: "successful",
    campaignStatus: "active",
    lastUpdated: "2025-06-15T14:15:00.000Z",
  },
  {
    id: "bal-2",
    campaignTitle: "Pepsi Summer Vibes",
    advertiser: { name: "Pepsi Nigeria" },
    totalFunded: 8000000,
    breakdown: {
      netAmount: 6200000,
      commission: 1200000,
      vat: 600000,
    },
    fundingStatus: "pending",
    campaignStatus: "active",
    lastUpdated: "2025-06-16T10:20:00.000Z",
  },
  {
    id: "bal-3",
    campaignTitle: "Pepsi Summer Vibes",
    advertiser: { name: "Pepsi Nigeria" },
    totalFunded: 8000000,
    breakdown: {
      netAmount: 6200000,
      commission: 1200000,
      vat: 600000,
    },
    fundingStatus: "pending",
    campaignStatus: "active",
    lastUpdated: "2025-06-16T10:20:00.000Z",
  },
  {
    id: "bal-4",
    campaignTitle: "GTBank SPARK 20",
    advertiser: { name: "GTBank" },
    totalFunded: 5200000,
    breakdown: {
      netAmount: 4030000,
      commission: 780000,
      vat: 390000,
    },
    fundingStatus: "failed",
    campaignStatus: "disputed",
    lastUpdated: "2025-06-16T11:45:00.000Z",
  },
];

export default function EscrowBalancesTab() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const LIMIT = 10;

  const { data, isLoading, isFetching } = useEscrowBalances(page, LIMIT);

  const rawItems: EscrowRowItem[] =
    data?.data && data.data.length > 0
      ? (data.data as EscrowRowItem[])
      : DEFAULT_BALANCES;
  const total = data?.meta?.total ?? data?.total ?? rawItems.length;
  const totalPages = data?.meta?.totalPages ?? Math.ceil(total / LIMIT);

  // Client-side search + Date Range filter (From / To)
  const filtered = rawItems.filter((item: EscrowRowItem) => {
    const title = (
      item.campaignTitle ??
      item.campaign?.title ??
      ""
    ).toLowerCase();
    const brand = (
      item.advertiser?.name ??
      item.brand?.name ??
      item.brandName ??
      ""
    ).toLowerCase();
    const q = search.toLowerCase();
    const matchesSearch = !search || title.includes(q) || brand.includes(q);

    const itemDateStr = item.lastUpdated ?? item.updatedAt ?? item.createdAt;
    let matchesDateRange = true;
    if (itemDateStr) {
      const itemTime = new Date(itemDateStr).getTime();
      if (fromDate) {
        const fromTime = new Date(fromDate).setHours(0, 0, 0, 0);
        if (itemTime < fromTime) matchesDateRange = false;
      }
      if (toDate) {
        const toTime = new Date(toDate).setHours(23, 59, 59, 999);
        if (itemTime > toTime) matchesDateRange = false;
      }
    }

    return matchesSearch && matchesDateRange;
  });

  const handleExport = () => {
    const headers = [
      "CAMPAIGN",
      "ADVERTISER",
      "CAMPAIGN BUDGET",
      "AGENCY COMMISSION",
      "VAT (7.5%)",
      "TOTAL FUNDED",
      "FUNDING STATUS",
      "CAMPAIGN STATUS",
      "LAST UPDATED",
    ];
    const rows = filtered.map((item: EscrowRowItem) => {
      const totalFunded =
        item.totalFunded ?? item.totalAmount ?? item.amount ?? 0;
      const commission =
        item.breakdown?.commission ??
        item.breakdown?.agencyCommission ??
        item.agencyCommission ??
        item.commission ??
        (totalFunded > 0 ? Math.round(totalFunded * 0.15) : 0);
      const vat =
        item.breakdown?.vat ??
        item.vat ??
        (totalFunded > 0 ? Math.round(totalFunded * 0.075) : 0);
      const budget =
        item.breakdown?.netAmount ??
        item.breakdown?.creatorNetBudget ??
        item.campaignBudget ??
        item.netAmount ??
        (totalFunded > 0 ? totalFunded - commission - vat : 0);

      const updatedStr = item.lastUpdated ?? item.updatedAt ?? item.createdAt;
      const updatedLabel = updatedStr
        ? new Date(updatedStr).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })
        : "";

      return [
        item.campaignTitle ?? item.campaign?.title ?? "",
        item.advertiser?.name ?? item.brand?.name ?? item.brandName ?? "",
        budget,
        commission,
        vat,
        totalFunded,
        item.fundingStatus ?? item.status ?? "",
        item.campaignStatus ?? item.campaign?.status ?? "",
        updatedLabel,
      ];
    });
    downloadCsv(
      `Trendupp_Escrow_Balances_${new Date().toISOString().slice(0, 10)}`,
      headers,
      rows,
    );
    toast.success("Escrow balances report exported");
  };

  const currentEscrowTotal =
    data?.currentMoneyInEscrow ??
    data?.totalMoneyInEscrow ??
    rawItems.reduce(
      (acc: number, i: EscrowRowItem) =>
        acc + (i.totalFunded ?? i.escrowAmount ?? i.totalAmount ?? 0),
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
            This table shows all funds currently sitting in escrow. You can
            release funds for successful funding via{" "}
            <span className="font-bold text-[#1e3a8a]">
              Pandascrow Payment Portal
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
        <div className="relative">
          <Search
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99b0]"
          />
          <input
            type="text"
            placeholder="Search campaign or brand..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-8 pr-3 py-1.5 text-xs border border-[#e8e6f0] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#e91e8c]/20 w-64 text-[#1a1a2e]"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`inline-flex items-center gap-1.5 text-xs border rounded-xl px-3 py-1.5 font-semibold transition-colors cursor-pointer ${
              showFilterPanel || fromDate || toDate
                ? "border-[#e91e8c] bg-[#fce4f3] text-[#e91e8c]"
                : "border-[#e8e6f0] bg-white text-[#4a4a6a] hover:bg-[#f4f3f6]"
            }`}
          >
            <SlidersHorizontal size={12} /> Filters
            {(fromDate || toDate) && (
              <span className="w-2 h-2 rounded-full bg-[#e91e8c] ml-0.5" />
            )}
          </button>
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center gap-1.5 text-xs border border-[#e8e6f0] rounded-xl px-3 py-1.5 bg-white text-[#4a4a6a] font-semibold hover:bg-[#f4f3f6] transition-colors cursor-pointer"
          >
            <Download size={12} /> Export
          </button>
        </div>
      </div>

      {/* Date Range Filter Panel */}
      {showFilterPanel && (
        <div className="flex flex-wrap items-center gap-3 p-3 bg-white border border-[#e8e6f0] rounded-2xl shadow-xs text-xs animate-fade-in">
          <span className="font-bold text-[#1a1a2e] text-[11px] uppercase tracking-wider">
            Filter by Date Range:
          </span>
          <div className="flex items-center gap-2">
            <label className="text-[#7a7a9a] font-medium text-[11px]">
              From:
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setFromDate(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1 text-xs border border-[#e8e6f0] rounded-xl bg-white text-[#1a1a2e] focus:outline-none focus:border-[#e91e8c]"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-[#7a7a9a] font-medium text-[11px]">
              To:
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setToDate(e.target.value);
                setPage(1);
              }}
              className="px-2.5 py-1 text-xs border border-[#e8e6f0] rounded-xl bg-white text-[#1a1a2e] focus:outline-none focus:border-[#e91e8c]"
            />
          </div>
          {(fromDate || toDate) && (
            <button
              type="button"
              onClick={() => {
                setFromDate("");
                setToDate("");
                setPage(1);
              }}
              className="px-2.5 py-1 text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors ml-auto cursor-pointer"
            >
              Clear Filter
            </button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-[#e8e6f0]/60 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#f4f3f6] bg-[#fafafa]">
                <th className="px-5 py-3 text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wide">
                  Campaign
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wide">
                  Advertiser
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wide">
                  Campaign Budget
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wide">
                  Agency Commission
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wide">
                  VAT (7.5%)
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wide">
                  Total Funded
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wide">
                  Funding Status
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wide">
                  Campaign Status
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wide">
                  Last Updated
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#f4f3f6]">
                    {Array.from({ length: 9 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-[#f4f3f6] rounded animate-pulse w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
                    className="px-5 py-10 text-center text-[#9a99b0] text-xs"
                  >
                    No escrow records found
                  </td>
                </tr>
              ) : (
                filtered.map((item: EscrowRowItem, idx: number) => {
                  const campaignTitle =
                    item.campaignTitle ??
                    item.campaign?.title ??
                    `Campaign #${item.campaignId ?? item.id}`;
                  const brandName =
                    item.advertiser?.name ??
                    item.brand?.name ??
                    item.brandName ??
                    "—";
                  const total =
                    item.totalFunded ?? item.totalAmount ?? item.amount ?? 0;
                  const commission =
                    item.breakdown?.commission ??
                    item.breakdown?.agencyCommission ??
                    item.agencyCommission ??
                    item.commission ??
                    (total > 0 ? Math.round(total * 0.15) : 0);
                  const vat =
                    item.breakdown?.vat ??
                    item.vat ??
                    (total > 0 ? Math.round(total * 0.075) : 0);
                  const budget =
                    item.breakdown?.netAmount ??
                    item.breakdown?.creatorNetBudget ??
                    item.campaignBudget ??
                    item.netAmount ??
                    (total > 0 ? total - commission - vat : 0);

                  const fundingStatusStr =
                    item.fundingStatus ?? item.status ?? "funded";
                  const campaignStatusStr =
                    item.campaignStatus ?? item.campaign?.status ?? "active";
                  const updated =
                    item.lastUpdated ?? item.updatedAt ?? item.createdAt;

                  const updatedLabel = updated
                    ? new Date(updated).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—";

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
                      <td className="px-4 py-3 font-bold text-[#1a1a2e]">
                        {fmt(budget)}
                      </td>
                      <td className="px-4 py-3 font-bold text-[#1a1a2e]">
                        {fmt(commission)}
                      </td>
                      <td className="px-4 py-3 font-bold text-[#1a1a2e]">
                        {fmt(vat)}
                      </td>
                      <td className="px-4 py-3 font-bold text-[#1a1a2e]">
                        {fmt(total)}
                      </td>
                      <td className="px-4 py-3">
                        <AdminStatusBadge status={fundingStatusStr} />
                      </td>
                      <td className="px-4 py-3">
                        <AdminStatusBadge status={campaignStatusStr} />
                      </td>
                      <td className="px-4 py-3 text-[#7a7a9a]">
                        {updatedLabel}
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
