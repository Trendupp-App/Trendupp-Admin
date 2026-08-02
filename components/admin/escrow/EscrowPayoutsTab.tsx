"use client";

import { useState } from "react";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
} from "lucide-react";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import {
  useCreatorPayouts,
  useAdvertiserRefunds,
} from "@/hooks/useAdminEscrow";
import { downloadCsv } from "@/lib/exportUtils";
import { toast } from "sonner";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n?: number) {
  if (!n && n !== 0) return "₦—";
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(1)}K`;
  return `₦${n.toLocaleString()}`;
}

function fmtDate(d?: string) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const PAYOUT_STATUSES = [
  "All",
  "pending",
  "processing",
  "successful",
  "failed",
  "paid",
];

// ── Stat Pill ─────────────────────────────────────────────────────────────────

interface StatPillProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
  bg: string;
}

function StatPill({ icon, label, value, color, bg }: StatPillProps) {
  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${bg} ${color}`}
    >
      <div className="shrink-0">{icon}</div>
      <div>
        <p className="text-[10px] font-semibold opacity-70 uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm font-bold">{value}</p>
      </div>
    </div>
  );
}

// ── Creator Payouts Sub-Tab ───────────────────────────────────────────────────

function CreatorPayoutsView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const LIMIT = 10;

  const { data, isLoading, isFetching } = useCreatorPayouts(page, LIMIT);

  const items = Array.isArray(data) ? data : (data?.data ?? []);
  const total = data?.meta?.total ?? data?.total ?? items.length;
  const totalPages = data?.meta?.totalPages ?? Math.ceil(total / LIMIT);

  // Client-side search + filter
  const filtered = items.filter((item) => {
    const creator = (
      item.creator?.name ??
      (item.creator?.firstName
        ? `${item.creator.firstName} ${item.creator.lastName ?? ""}`
        : undefined) ??
      item.creatorName ??
      ""
    ).toLowerCase();
    const brand = (item.brand?.name ?? item.brandName ?? "").toLowerCase();
    const campaign = (
      item.campaign?.title ??
      item.campaignTitle ??
      ""
    ).toLowerCase();
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      creator.includes(q) ||
      brand.includes(q) ||
      campaign.includes(q);
    const matchesStatus =
      statusFilter === "All" ||
      (item.status ?? "").toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Stat counts & amounts from live API metrics (with fallback to local item calculation if metrics object is missing)
  const metrics = data?.metrics;

  const pending =
    metrics?.pending?.count ??
    items.filter((i) => ["pending"].includes((i.status ?? "").toLowerCase()))
      .length;

  const successful =
    metrics?.successful?.count ??
    items.filter((i) =>
      ["successful", "paid"].includes((i.status ?? "").toLowerCase()),
    ).length;

  const failed =
    metrics?.failed?.count ??
    items.filter((i) => ["failed"].includes((i.status ?? "").toLowerCase()))
      .length;

  const totalPaid =
    metrics?.successful?.totalAmount ??
    items
      .filter((i) =>
        ["successful", "paid"].includes((i.status ?? "").toLowerCase()),
      )
      .reduce((acc, i) => acc + (i.amount ?? 0), 0);

  const handleExport = () => {
    const headers = [
      "Creator",
      "Brand",
      "Campaign",
      "Amount",
      "Account",
      "Transaction Trigger",
      "Status",
      "Date Initiated",
    ];
    const rows = filtered.map((item) => [
      item.creator?.name ?? item.creatorName ?? "",
      item.brand?.name ?? item.brandName ?? "",
      item.campaign?.title ?? item.campaignTitle ?? "",
      item.amount ?? 0,
      item.account ?? item.creator?.accountNumber ?? "—",
      item.transactionTrigger ?? item.triggeredBy ?? "—",
      item.status,
      item.paidAt ?? item.createdAt ?? item.dateInitiated ?? "",
    ]);
    downloadCsv(
      `Trendupp_Creator_Payouts_${new Date().toISOString().slice(0, 10)}`,
      headers,
      rows,
    );
    toast.success("Creator payouts exported");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Stat Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatPill
          icon={<Clock size={16} />}
          label="Pending Payouts"
          value={String(pending)}
          color="text-amber-700"
          bg="bg-amber-50 border-amber-200"
        />
        <StatPill
          icon={<CheckCircle size={16} />}
          label="Successful Payouts"
          value={String(successful)}
          color="text-green-700"
          bg="bg-green-50 border-green-200"
        />
        <StatPill
          icon={<XCircle size={16} />}
          label="Failed Payouts"
          value={String(failed)}
          color="text-red-700"
          bg="bg-red-50 border-red-200"
        />
        <StatPill
          icon={<ArrowUpRight size={16} />}
          label="Total Paid Amount"
          value={fmt(totalPaid)}
          color="text-[#e91e8c]"
          bg="bg-[#fce4f3] border-[#f0b8dc]"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99b0]"
            />
            <input
              type="text"
              placeholder="Search creator, brand..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-8 pr-3 py-1.5 text-xs border border-[#e8e6f0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#e91e8c]/20 w-52"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs border border-[#e8e6f0] rounded-lg px-3 py-1.5 bg-white text-[#4a4a6a] focus:outline-none focus:ring-2 focus:ring-[#e91e8c]/20"
          >
            {PAYOUT_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "All"
                  ? "All Statuses"
                  : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
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
                  Creator
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold text-[#7a7a9a] uppercase tracking-wide">
                  Brand
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold text-[#7a7a9a] uppercase tracking-wide">
                  Amount
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold text-[#7a7a9a] uppercase tracking-wide">
                  Account
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold text-[#7a7a9a] uppercase tracking-wide">
                  Transaction Trigger
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold text-[#7a7a9a] uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold text-[#7a7a9a] uppercase tracking-wide">
                  Date Initiated
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#f4f3f6]">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-[#f4f3f6] rounded animate-pulse w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-10 text-center text-[#9a99b0] text-xs"
                  >
                    No payout records found
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => {
                  const creatorName =
                    item.creator?.name ??
                    (item.creator?.firstName
                      ? `${item.creator.firstName} ${item.creator.lastName ?? ""}`.trim()
                      : undefined) ??
                    item.creatorName ??
                    "—";
                  const brandName = item.brand?.name ?? item.brandName ?? "—";
                  const account =
                    item.account ??
                    item.creator?.accountNumber ??
                    `${item.creator?.bankName ?? "—"}`;
                  const trigger =
                    item.transactionTrigger ?? item.triggeredBy ?? "—";
                  const dateStr =
                    item.paidAt ?? item.createdAt ?? item.dateInitiated;

                  return (
                    <tr
                      key={item.id ?? idx}
                      className={`border-b border-[#f4f3f6] hover:bg-[#fafafa] transition-colors ${isFetching ? "opacity-60" : ""}`}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          {item.creator?.avatar || item.creatorAvatar ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={item.creator?.avatar ?? item.creatorAvatar}
                              alt=""
                              className="w-6 h-6 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-[#fce4f3] text-[#e91e8c] text-[9px] font-bold flex items-center justify-center">
                              {creatorName.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <span className="font-semibold text-[#1a1a2e]">
                            {creatorName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-[#4a4a6a]">{brandName}</td>
                      <td className="px-4 py-3 font-semibold text-[#1a1a2e]">
                        {fmt(item.amount)}
                      </td>
                      <td className="px-4 py-3 text-[#4a4a6a]">{account}</td>
                      <td className="px-4 py-3 text-[#4a4a6a]">{trigger}</td>
                      <td className="px-4 py-3">
                        <AdminStatusBadge status={item.status ?? "pending"} />
                      </td>
                      <td className="px-4 py-3 text-[#7a7a9a]">
                        {fmtDate(dateStr)}
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

// ── Advertiser Refunds Sub-Tab ────────────────────────────────────────────────

function AdvertiserRefundsView() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const LIMIT = 10;

  const { data, isLoading, isFetching } = useAdvertiserRefunds(page, LIMIT);

  const items = data?.data ?? [];
  const total = data?.meta?.total ?? data?.total ?? items.length;
  const totalPages = data?.meta?.totalPages ?? Math.ceil(total / LIMIT);

  const filtered = items.filter((item) => {
    const advertiser = (
      item.advertiser?.name ??
      item.advertiserName ??
      item.brand?.name ??
      ""
    ).toLowerCase();
    const campaign = (
      item.campaign?.title ??
      item.campaignTitle ??
      ""
    ).toLowerCase();
    const q = search.toLowerCase();
    const matchesSearch =
      !search || advertiser.includes(q) || campaign.includes(q);
    const matchesStatus =
      statusFilter === "All" ||
      (item.status ?? "").toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  // Stat counts & amounts from live API metrics (with fallback to local item calculation if metrics object is missing)
  const metrics = data?.metrics;

  const pending =
    metrics?.pending?.count ??
    items.filter((i) => ["pending"].includes((i.status ?? "").toLowerCase()))
      .length;

  const successful =
    metrics?.successful?.count ??
    items.filter((i) =>
      ["successful", "refunded"].includes((i.status ?? "").toLowerCase()),
    ).length;

  const failed =
    metrics?.failed?.count ??
    items.filter((i) => ["failed"].includes((i.status ?? "").toLowerCase()))
      .length;

  const totalRefunded =
    metrics?.successful?.totalAmount ??
    items
      .filter((i) =>
        ["successful", "refunded"].includes((i.status ?? "").toLowerCase()),
      )
      .reduce((acc, i) => acc + (i.amount ?? 0), 0);

  const handleExport = () => {
    const headers = [
      "Campaign",
      "Amount",
      "Account",
      "Transaction Trigger",
      "Status",
    ];
    const rows = filtered.map((item) => [
      item.campaign?.title ?? item.campaignTitle ?? "",
      item.amount ?? 0,
      item.account ?? "—",
      item.transactionTrigger ?? "—",
      item.status,
    ]);
    downloadCsv(
      `Trendupp_Advertiser_Refunds_${new Date().toISOString().slice(0, 10)}`,
      headers,
      rows,
    );
    toast.success("Advertiser refunds exported");
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Stat Pills */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatPill
          icon={<Clock size={16} />}
          label="Pending Refunds"
          value={String(pending)}
          color="text-amber-700"
          bg="bg-amber-50 border-amber-200"
        />
        <StatPill
          icon={<CheckCircle size={16} />}
          label="Successful Refunds"
          value={String(successful)}
          color="text-green-700"
          bg="bg-green-50 border-green-200"
        />
        <StatPill
          icon={<XCircle size={16} />}
          label="Failed Refunds"
          value={String(failed)}
          color="text-red-700"
          bg="bg-red-50 border-red-200"
        />
        <StatPill
          icon={<ArrowUpRight size={16} />}
          label="Total Refunded"
          value={fmt(totalRefunded)}
          color="text-purple-700"
          bg="bg-purple-50 border-purple-200"
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search
              size={13}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99b0]"
            />
            <input
              type="text"
              placeholder="Search campaign..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-8 pr-3 py-1.5 text-xs border border-[#e8e6f0] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#e91e8c]/20 w-52"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="text-xs border border-[#e8e6f0] rounded-lg px-3 py-1.5 bg-white text-[#4a4a6a] focus:outline-none"
          >
            {[
              "All",
              "pending",
              "processing",
              "successful",
              "failed",
              "refunded",
            ].map((s) => (
              <option key={s} value={s}>
                {s === "All"
                  ? "All Statuses"
                  : s.charAt(0).toUpperCase() + s.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
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
                  Campaign
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold text-[#7a7a9a] uppercase tracking-wide">
                  Amount
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold text-[#7a7a9a] uppercase tracking-wide">
                  Account
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold text-[#7a7a9a] uppercase tracking-wide">
                  Transaction Trigger
                </th>
                <th className="px-4 py-3 text-[10px] font-semibold text-[#7a7a9a] uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#f4f3f6]">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3">
                        <div className="h-3 bg-[#f4f3f6] rounded animate-pulse w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-10 text-center text-[#9a99b0] text-xs"
                  >
                    No refund records found
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => {
                  const campaignTitle =
                    item.campaign?.title ?? item.campaignTitle ?? "—";
                  const account = item.account ?? "—";
                  const trigger = item.transactionTrigger ?? "—";

                  return (
                    <tr
                      key={item.id ?? idx}
                      className={`border-b border-[#f4f3f6] hover:bg-[#fafafa] transition-colors ${isFetching ? "opacity-60" : ""}`}
                    >
                      <td className="px-5 py-3 text-[#4a4a6a] font-medium line-clamp-1 max-w-[180px]">
                        {campaignTitle}
                      </td>
                      <td className="px-4 py-3 font-semibold text-[#1a1a2e]">
                        {fmt(item.amount)}
                      </td>
                      <td className="px-4 py-3 text-[#4a4a6a]">{account}</td>
                      <td className="px-4 py-3 text-[#4a4a6a]">{trigger}</td>
                      <td className="px-4 py-3">
                        <AdminStatusBadge status={item.status ?? "pending"} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

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

// ── Main Payouts Tab ──────────────────────────────────────────────────────────

type PayoutsSubTab = "creators" | "advertisers";

export default function EscrowPayoutsTab() {
  const [subTab, setSubTab] = useState<PayoutsSubTab>("creators");

  return (
    <div className="flex flex-col gap-4">
      {/* Sub-Tab Toggle */}
      <div className="flex items-center gap-1 bg-[#f4f3f6] p-1 rounded-xl w-fit">
        {(["creators", "advertisers"] as PayoutsSubTab[]).map((t) => (
          <button
            key={t}
            onClick={() => setSubTab(t)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${subTab === t ? "bg-white text-[#1a1a2e] shadow-sm" : "text-[#7a7a9a] hover:text-[#1a1a2e]"}`}
          >
            {t === "creators" ? "Creator Payouts" : "Advertiser Refunds"}
          </button>
        ))}
      </div>

      {subTab === "creators" ? (
        <CreatorPayoutsView />
      ) : (
        <AdvertiserRefundsView />
      )}
    </div>
  );
}
