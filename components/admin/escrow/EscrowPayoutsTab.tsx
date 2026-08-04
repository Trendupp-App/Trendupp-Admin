"use client";

import { useState, useMemo } from "react";
import {
  Download,
  ChevronLeft,
  ChevronRight,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  PauseCircle,
  Info,
  Users,
  Receipt,
  X,
} from "lucide-react";
import UserAvatar from "@/shared/UserAvatar";
import {
  useCreatorPayouts,
  useAdvertiserRefunds,
} from "@/hooks/useAdminEscrow";
import { downloadCsv } from "@/lib/exportUtils";
import { toast } from "sonner";
import type { EscrowSummaryDto } from "@/types/adminEscrow";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtExact(n?: number) {
  if (!n && n !== 0) return "₦0";
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

// ── Metric Card Component ─────────────────────────────────────────────────────

interface MetricCardProps {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  count: number;
  totalAmount: number;
}

function MetricCard({
  icon,
  iconBg,
  label,
  count,
  totalAmount,
}: MetricCardProps) {
  return (
    <div className="bg-white border border-[#e8e6f0]/70 rounded-2xl p-5 flex flex-col justify-between shadow-xs h-full min-h-[110px]">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${iconBg}`}
          >
            {icon}
          </div>
          <span className="text-xs font-bold text-[#5a5a7a] flex items-center gap-1">
            {label}
            <Info size={12} className="text-[#9a99b0]" />
          </span>
        </div>
        <span className="text-2xl font-black text-[#1a1a2e]">{count}</span>
      </div>
      <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#f4f3f6]">
        <span className="text-xs font-semibold text-[#7a7a9a]">
          Total Amount
        </span>
        <span className="text-xs sm:text-sm font-extrabold text-[#1a1a2e]">
          {fmtExact(totalAmount)}
        </span>
      </div>
    </div>
  );
}

// ── Status Pill Badge ─────────────────────────────────────────────────────────

function StatusBadge({ status }: { status?: string }) {
  const s = (status ?? "pending").toLowerCase();

  if (["successful", "paid", "refunded"].includes(s)) {
    return (
      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#e6f4ea] text-[#137333] border border-[#ceead6] inline-block">
        Successful
      </span>
    );
  }
  if (["pending", "processing"].includes(s)) {
    return (
      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#fef7e0] text-[#b06000] border border-[#feefc3] inline-block">
        Pending
      </span>
    );
  }
  if (["onhold", "held", "on_hold"].includes(s)) {
    return (
      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#f3e8ff] text-[#7e22ce] border border-[#e9d5ff] inline-block">
        On Hold
      </span>
    );
  }
  return (
    <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-[#fce8e6] text-[#c5221f] border border-[#fad2cf] inline-block">
      Failed
    </span>
  );
}

// ── Creator Payouts Sub-Tab View ──────────────────────────────────────────────

function CreatorPayoutsView({ exportTrigger }: { exportTrigger?: number }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const LIMIT = 10;

  const { data, isLoading, isFetching } = useCreatorPayouts(page, LIMIT);

  const items = useMemo(() => {
    return Array.isArray(data) ? data : (data?.data ?? []);
  }, [data]);

  const total = data?.meta?.total ?? data?.total ?? items.length;
  const totalPages = data?.meta?.totalPages ?? Math.ceil(total / LIMIT);

  // Client-side filtering
  const filtered = useMemo(() => {
    return items.filter((item) => {
      const creatorName = (
        item.creator?.name ??
        (item.creator?.firstName
          ? `${item.creator.firstName} ${item.creator.lastName ?? ""}`
          : undefined) ??
        item.creatorName ??
        ""
      ).toLowerCase();
      const brandName = (
        item.brand?.name ??
        item.brandName ??
        ""
      ).toLowerCase();
      const campaignTitle = (
        item.campaign?.title ??
        item.campaignTitle ??
        ""
      ).toLowerCase();

      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        creatorName.includes(q) ||
        brandName.includes(q) ||
        campaignTitle.includes(q);

      const normalizedStatus = (item.status ?? "").toLowerCase();
      const selected = statusFilter.toLowerCase();
      const matchesStatus =
        selected === "all" ||
        (selected === "successful" &&
          ["successful", "paid"].includes(normalizedStatus)) ||
        (selected === "pending" &&
          ["pending", "processing"].includes(normalizedStatus)) ||
        (selected === "on_hold" &&
          ["onhold", "on_hold", "held"].includes(normalizedStatus)) ||
        normalizedStatus === selected;
      const itemDateStr =
        item.lastUpdated ??
        item.updatedAt ??
        item.paidAt ??
        item.createdAt ??
        item.dateInitiated;
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

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [items, search, statusFilter, fromDate, toDate]);

  // Export CSV handler
  useMemo(() => {
    if (!exportTrigger) return;
    const headers = [
      "Campaign",
      "Brand",
      "Creator",
      "Amount",
      "Status",
      "Reason",
      "Date Initiated",
    ];
    const rows = filtered.map((item) => [
      item.campaign?.title ?? item.campaignTitle ?? "",
      item.brand?.name ?? item.brandName ?? "",
      item.creator?.name ?? item.creatorName ?? "",
      item.amount ?? 0,
      item.status ?? "pending",
      item.failureReason ??
        (item as unknown as { reason?: string }).reason ??
        "—",
      item.lastUpdated ??
        item.updatedAt ??
        item.paidAt ??
        item.createdAt ??
        item.dateInitiated ??
        "",
    ]);
    downloadCsv(
      `Trendupp_Creator_Payouts_${new Date().toISOString().slice(0, 10)}`,
      headers,
      rows,
    );
    toast.success("Creator payouts exported");
  }, [exportTrigger, filtered]);

  // Live Metrics calculations
  const metrics = data?.metrics;

  const pendingCount =
    metrics?.pending?.count ??
    items.filter((i) => ["pending"].includes((i.status ?? "").toLowerCase()))
      .length;
  const pendingAmount =
    metrics?.pending?.totalAmount ??
    items
      .filter((i) => ["pending"].includes((i.status ?? "").toLowerCase()))
      .reduce((acc, i) => acc + (i.amount ?? 0), 0);

  const successfulCount =
    metrics?.successful?.count ??
    items.filter((i) =>
      ["successful", "paid"].includes((i.status ?? "").toLowerCase()),
    ).length;
  const successfulAmount =
    metrics?.successful?.totalAmount ??
    items
      .filter((i) =>
        ["successful", "paid"].includes((i.status ?? "").toLowerCase()),
      )
      .reduce((acc, i) => acc + (i.amount ?? 0), 0);

  const failedCount =
    metrics?.failed?.count ??
    items.filter((i) => ["failed"].includes((i.status ?? "").toLowerCase()))
      .length;
  const failedAmount =
    metrics?.failed?.totalAmount ??
    items
      .filter((i) => ["failed"].includes((i.status ?? "").toLowerCase()))
      .reduce((acc, i) => acc + (i.amount ?? 0), 0);

  const onHoldCount =
    metrics?.onHold?.count ??
    items.filter((i) =>
      ["onhold", "held", "on_hold"].includes((i.status ?? "").toLowerCase()),
    ).length;
  const onHoldAmount =
    metrics?.onHold?.totalAmount ??
    items
      .filter((i) =>
        ["onhold", "held", "on_hold"].includes((i.status ?? "").toLowerCase()),
      )
      .reduce((acc, i) => acc + (i.amount ?? 0), 0);

  return (
    <div className="flex flex-col gap-5">
      {/* 4 Creator Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Clock size={16} />}
          iconBg="bg-amber-100/80 text-amber-600"
          label="Pending Payouts"
          count={pendingCount}
          totalAmount={pendingAmount}
        />
        <MetricCard
          icon={<CheckCircle2 size={16} />}
          iconBg="bg-emerald-100/80 text-emerald-600"
          label="Successful Payouts"
          count={successfulCount}
          totalAmount={successfulAmount}
        />
        <MetricCard
          icon={<XCircle size={16} />}
          iconBg="bg-rose-100/80 text-rose-600"
          label="Failed Payouts"
          count={failedCount}
          totalAmount={failedAmount}
        />
        <MetricCard
          icon={<PauseCircle size={16} />}
          iconBg="bg-purple-100/80 text-purple-600"
          label="On Hold Payouts"
          count={onHoldCount}
          totalAmount={onHoldAmount}
        />
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[200px] flex-1">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a99b0]"
          />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 pr-3 py-2 text-xs border border-[#e8e6f0] rounded-xl bg-white text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-[#e91e8c]/30 w-full font-medium"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="text-xs border border-[#e8e6f0] rounded-xl px-3 py-2 bg-white text-[#4a4a6a] font-semibold focus:outline-none cursor-pointer"
        >
          <option value="All">Status All</option>
          <option value="pending">Pending</option>
          <option value="successful">Successful</option>
          <option value="failed">Failed</option>
          <option value="on_hold">On Hold</option>
        </select>

        {/* Date Range Inputs (From / To) */}
        <div className="flex items-center gap-1.5 text-xs text-[#7a7a9a] font-medium">
          <span className="font-semibold">From:</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 text-xs border border-[#e8e6f0] rounded-xl bg-white text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-[#e91e8c]/30 font-semibold"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#7a7a9a] font-medium">
          <span className="font-semibold">To:</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 text-xs border border-[#e8e6f0] rounded-xl bg-white text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-[#e91e8c]/30 font-semibold"
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
            className="p-1.5 text-[#7a7a9a] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Clear date filter"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Creator Payouts Table */}
      <div className="bg-white border border-[#e8e6f0]/70 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e8e6f0]/60 bg-[#fafafa]">
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                  Creator
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                  Date (Last Updated)
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#f4f3f6]">
                    {Array.from({ length: 7 }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="h-3.5 bg-[#f4f3f6] rounded animate-pulse w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-12 text-center text-[#9a99b0] text-xs font-medium"
                  >
                    No payout records found
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => {
                  const campaignTitle =
                    item.campaign?.title ?? item.campaignTitle ?? "—";
                  const brandName = item.brand?.name ?? item.brandName ?? "—";
                  const creatorName =
                    item.creator?.name ??
                    (item.creator?.firstName
                      ? `${item.creator.firstName} ${item.creator.lastName ?? ""}`.trim()
                      : undefined) ??
                    item.creatorName ??
                    "—";
                  const failureReason = item.failureReason ?? "—";
                  const dateStr = fmtDate(
                    item.lastUpdated ??
                      item.updatedAt ??
                      item.paidAt ??
                      item.createdAt ??
                      item.dateInitiated,
                  );

                  return (
                    <tr
                      key={item.id ?? idx}
                      className={`border-b border-[#f4f3f6] hover:bg-[#fafafa] transition-colors ${
                        isFetching ? "opacity-60" : ""
                      }`}
                    >
                      <td className="px-5 py-3.5 font-bold text-[#e91e8c] hover:underline cursor-pointer">
                        {campaignTitle}
                      </td>
                      <td className="px-4 py-3.5 font-medium text-[#1a1a2e]">
                        {brandName}
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center gap-2 font-semibold text-[#1a1a2e]">
                          <UserAvatar
                            avatarUrl={
                              item.creator?.avatar ?? item.creatorAvatar
                            }
                            initials={
                              creatorName && creatorName !== "—"
                                ? creatorName
                                    .split(" ")
                                    .map((part: string) => part[0])
                                    .join("")
                                    .slice(0, 2)
                                    .toUpperCase()
                                : "—"
                            }
                            size={24}
                          />
                          <span>{creatorName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3.5 font-extrabold text-[#1a1a2e]">
                        {fmtExact(item.amount)}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3.5 text-[#7a7a9a]">
                        {failureReason}
                      </td>
                      <td className="px-4 py-3.5 text-[#5a5a7a] font-medium">
                        {dateStr}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#f4f3f6] bg-white">
          <span className="text-xs text-[#7a7a9a] font-medium">
            Showing {Math.min((page - 1) * LIMIT + 1, total)}-
            {Math.min(page * LIMIT, total)} of {total}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e8e6f0] text-[#4a4a6a] disabled:opacity-40 hover:bg-[#f4f3f6] transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
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
                  className={`w-8 h-8 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    pg === page
                      ? "bg-[#e91e8c] text-white shadow-xs"
                      : "border border-[#e8e6f0] text-[#4a4a6a] hover:bg-[#f4f3f6]"
                  }`}
                >
                  {pg}
                </button>
              );
            })}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e8e6f0] text-[#4a4a6a] disabled:opacity-40 hover:bg-[#f4f3f6] transition-colors cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Brand Refunds Sub-Tab View ────────────────────────────────────────────────

function BrandRefundsView({ exportTrigger }: { exportTrigger?: number }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const LIMIT = 10;

  const { data, isLoading, isFetching } = useAdvertiserRefunds(page, LIMIT);

  const items = useMemo(() => data?.data ?? [], [data]);
  const total = data?.meta?.total ?? data?.total ?? items.length;
  const totalPages = data?.meta?.totalPages ?? Math.ceil(total / LIMIT);

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const brandName = (
        item.brand?.name ??
        item.advertiser?.name ??
        item.advertiserName ??
        ""
      ).toLowerCase();
      const campaign = (
        item.campaign?.title ??
        item.campaignTitle ??
        ""
      ).toLowerCase();

      const q = search.toLowerCase();
      const matchesSearch =
        !search || brandName.includes(q) || campaign.includes(q);

      const normalizedStatus = (item.status ?? "").toLowerCase();
      const selected = statusFilter.toLowerCase();
      const matchesStatus =
        selected === "all" ||
        (selected === "successful" &&
          ["successful", "refunded"].includes(normalizedStatus)) ||
        (selected === "pending" &&
          ["pending", "processing"].includes(normalizedStatus)) ||
        (selected === "on_hold" &&
          ["onhold", "on_hold", "held"].includes(normalizedStatus)) ||
        normalizedStatus === selected;
      const itemDateStr =
        item.lastUpdated ??
        item.updatedAt ??
        item.refundedAt ??
        item.createdAt ??
        item.dateInitiated;
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

      return matchesSearch && matchesStatus && matchesDateRange;
    });
  }, [items, search, statusFilter, fromDate, toDate]);

  // Export CSV handler
  useMemo(() => {
    if (!exportTrigger) return;
    const headers = [
      "Campaign",
      "Amount",
      "Status",
      "Reason",
      "Date Initiated",
    ];
    const rows = filtered.map((item) => [
      item.campaign?.title ?? item.campaignTitle ?? "",
      item.amount ?? 0,
      item.status ?? "pending",
      item.failureReason ?? item.reason ?? "—",
      item.lastUpdated ??
        item.updatedAt ??
        item.refundedAt ??
        item.createdAt ??
        item.dateInitiated ??
        "",
    ]);
    downloadCsv(
      `Trendupp_Brand_Refunds_${new Date().toISOString().slice(0, 10)}`,
      headers,
      rows,
    );
    toast.success("Brand refunds exported");
  }, [exportTrigger, filtered]);

  const metrics = data?.metrics;

  const pendingCount =
    metrics?.pending?.count ??
    items.filter((i) => ["pending"].includes((i.status ?? "").toLowerCase()))
      .length;
  const pendingAmount =
    metrics?.pending?.totalAmount ??
    items
      .filter((i) => ["pending"].includes((i.status ?? "").toLowerCase()))
      .reduce((acc, i) => acc + (i.amount ?? 0), 0);

  const successfulCount =
    metrics?.successful?.count ??
    items.filter((i) =>
      ["successful", "refunded"].includes((i.status ?? "").toLowerCase()),
    ).length;
  const successfulAmount =
    metrics?.successful?.totalAmount ??
    items
      .filter((i) =>
        ["successful", "refunded"].includes((i.status ?? "").toLowerCase()),
      )
      .reduce((acc, i) => acc + (i.amount ?? 0), 0);

  const failedCount =
    metrics?.failed?.count ??
    items.filter((i) => ["failed"].includes((i.status ?? "").toLowerCase()))
      .length;
  const failedAmount =
    metrics?.failed?.totalAmount ??
    items
      .filter((i) => ["failed"].includes((i.status ?? "").toLowerCase()))
      .reduce((acc, i) => acc + (i.amount ?? 0), 0);

  const onHoldCount =
    metrics?.onHold?.count ??
    items.filter((i) =>
      ["onhold", "held", "on_hold"].includes((i.status ?? "").toLowerCase()),
    ).length;
  const onHoldAmount =
    metrics?.onHold?.totalAmount ??
    items
      .filter((i) =>
        ["onhold", "held", "on_hold"].includes((i.status ?? "").toLowerCase()),
      )
      .reduce((acc, i) => acc + (i.amount ?? 0), 0);

  return (
    <div className="flex flex-col gap-5">
      {/* 4 Brand Refund Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={<Clock size={16} />}
          iconBg="bg-amber-100/80 text-amber-600"
          label="Pending Refund"
          count={pendingCount}
          totalAmount={pendingAmount}
        />
        <MetricCard
          icon={<CheckCircle2 size={16} />}
          iconBg="bg-emerald-100/80 text-emerald-600"
          label="Successful Refund"
          count={successfulCount}
          totalAmount={successfulAmount}
        />
        <MetricCard
          icon={<XCircle size={16} />}
          iconBg="bg-rose-100/80 text-rose-600"
          label="Failed Refund"
          count={failedCount}
          totalAmount={failedAmount}
        />
        <MetricCard
          icon={<PauseCircle size={16} />}
          iconBg="bg-purple-100/80 text-purple-600"
          label="On Hold Refund"
          count={onHoldCount}
          totalAmount={onHoldAmount}
        />
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="relative min-w-[200px] flex-1">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9a99b0]"
          />
          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9 pr-3 py-2 text-xs border border-[#e8e6f0] rounded-xl bg-white text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-[#e91e8c]/30 w-full font-medium"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
          className="text-xs border border-[#e8e6f0] rounded-xl px-3 py-2 bg-white text-[#4a4a6a] font-semibold focus:outline-none cursor-pointer"
        >
          <option value="All">Status: All</option>
          <option value="pending">Pending</option>
          <option value="successful">Successful</option>
          <option value="failed">Failed</option>
          <option value="on_hold">On Hold</option>
        </select>

        {/* Date Range Inputs (From / To) */}
        <div className="flex items-center gap-1.5 text-xs text-[#7a7a9a] font-medium">
          <span className="font-semibold">From:</span>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => {
              setFromDate(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 text-xs border border-[#e8e6f0] rounded-xl bg-white text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-[#e91e8c]/30 font-semibold"
          />
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#7a7a9a] font-medium">
          <span className="font-semibold">To:</span>
          <input
            type="date"
            value={toDate}
            onChange={(e) => {
              setToDate(e.target.value);
              setPage(1);
            }}
            className="px-2.5 py-1.5 text-xs border border-[#e8e6f0] rounded-xl bg-white text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-[#e91e8c]/30 font-semibold"
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
            className="p-1.5 text-[#7a7a9a] hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Clear date filter"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Brand Refunds Table */}
      <div className="bg-white border border-[#e8e6f0]/70 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#e8e6f0]/60 bg-[#fafafa]">
                <th className="px-5 py-3.5 text-[11px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                  Campaign
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                  Reason
                </th>
                <th className="px-4 py-3.5 text-[11px] font-bold text-[#7a7a9a] uppercase tracking-wider">
                  Date (Last Updated)
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <tr key={i} className="border-b border-[#f4f3f6]">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} className="px-4 py-3.5">
                        <div className="h-3.5 bg-[#f4f3f6] rounded animate-pulse w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-12 text-center text-[#9a99b0] text-xs font-medium"
                  >
                    No refund records found
                  </td>
                </tr>
              ) : (
                filtered.map((item, idx) => {
                  const campaignTitle =
                    item.campaign?.title ?? item.campaignTitle ?? "—";
                  const failureReason =
                    item.failureReason ?? item.reason ?? "—";
                  const dateStr = fmtDate(
                    item.lastUpdated ??
                      item.updatedAt ??
                      item.refundedAt ??
                      item.createdAt ??
                      item.dateInitiated,
                  );

                  return (
                    <tr
                      key={item.id ?? idx}
                      className={`border-b border-[#f4f3f6] hover:bg-[#fafafa] transition-colors ${
                        isFetching ? "opacity-60" : ""
                      }`}
                    >
                      <td className="px-5 py-3.5 font-bold text-[#e91e8c] hover:underline cursor-pointer">
                        {campaignTitle}
                      </td>
                      <td className="px-4 py-3.5 font-extrabold text-[#1a1a2e]">
                        {fmtExact(item.amount)}
                      </td>
                      <td className="px-4 py-3.5">
                        <StatusBadge status={item.status} />
                      </td>
                      <td className="px-4 py-3.5 text-[#7a7a9a]">
                        {failureReason}
                      </td>
                      <td className="px-4 py-3.5 text-[#5a5a7a] font-medium">
                        {dateStr}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-5 py-4 border-t border-[#f4f3f6] bg-white">
          <span className="text-xs text-[#7a7a9a] font-medium">
            Showing {Math.min((page - 1) * LIMIT + 1, total)}-
            {Math.min(page * LIMIT, total)} of {total}
          </span>
          <div className="flex items-center gap-1.5">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e8e6f0] text-[#4a4a6a] disabled:opacity-40 hover:bg-[#f4f3f6] transition-colors cursor-pointer"
            >
              <ChevronLeft size={14} />
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
                  className={`w-8 h-8 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    pg === page
                      ? "bg-[#e91e8c] text-white shadow-xs"
                      : "border border-[#e8e6f0] text-[#4a4a6a] hover:bg-[#f4f3f6]"
                  }`}
                >
                  {pg}
                </button>
              );
            })}
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#e8e6f0] text-[#4a4a6a] disabled:opacity-40 hover:bg-[#f4f3f6] transition-colors cursor-pointer"
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main Payouts Tab Component ────────────────────────────────────────────────

type PayoutsSubTab = "creators" | "brands";

export default function EscrowPayoutsTab({
  summary: _summary,
}: {
  summary?: EscrowSummaryDto;
}) {
  const [subTab, setSubTab] = useState<PayoutsSubTab>("creators");
  const [exportTrigger, setExportTrigger] = useState(0);

  const handleExport = () => {
    setExportTrigger((prev) => prev + 1);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Sub-Tab Navigation Bar & Export Button */}
      <div className="flex items-center justify-between border-b border-[#e8e6f0]/80 pb-0">
        <div className="flex items-center gap-6">
          <button
            onClick={() => setSubTab("creators")}
            className={`flex items-center gap-2 pb-3 text-xs font-bold transition-all cursor-pointer -mb-px border-b-2 ${
              subTab === "creators"
                ? "border-[#e91e8c] text-[#e91e8c]"
                : "border-transparent text-[#7a7a9a] hover:text-[#1a1a2e]"
            }`}
          >
            <Users size={15} />
            <span>Creator Payouts</span>
          </button>

          <button
            onClick={() => setSubTab("brands")}
            className={`flex items-center gap-2 pb-3 text-xs font-bold transition-all cursor-pointer -mb-px border-b-2 ${
              subTab === "brands"
                ? "border-[#e91e8c] text-[#e91e8c]"
                : "border-transparent text-[#7a7a9a] hover:text-[#1a1a2e]"
            }`}
          >
            <Receipt size={15} />
            <span>Brand Refunds</span>
          </button>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2 bg-white border border-[#e8e6f0] rounded-xl text-xs font-bold text-[#1a1a2e] hover:bg-[#fafafa] flex items-center gap-2 shadow-xs cursor-pointer transition-colors mb-2"
        >
          <Download size={14} />
          <span>Export</span>
        </button>
      </div>

      {/* Sub-Tab View */}
      {subTab === "creators" ? (
        <CreatorPayoutsView exportTrigger={exportTrigger} />
      ) : (
        <BrandRefundsView exportTrigger={exportTrigger} />
      )}
    </div>
  );
}
