"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Wallet, ShieldCheck, ArrowUpRight, RefreshCcw } from "lucide-react";
import { AdminKpiCard } from "@/components/admin/AdminKpiCard";
import { AdminStatusBadge } from "@/components/admin/AdminStatusBadge";
import { useEscrowOverview, useEscrowBalances } from "@/hooks/useAdminEscrow";
import type {
  EscrowRecentActivityItem,
  EscrowBalanceItem,
} from "@/types/adminEscrow";
import { downloadCsv } from "@/lib/exportUtils";
import { toast } from "sonner";

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmt(n?: number) {
  if (!n && n !== 0) return "₦—";
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(1)}K`;
  return `₦${n.toLocaleString()}`;
}

const PINK = "#e91e8c";
const PINK_LIGHT = "#fce4f3";

const chartTooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #e8e6f0",
  borderRadius: 8,
  fontSize: 11,
  color: "#1a1a2e",
};

// ── Mini Bar Chart ─────────────────────────────────────────────────────────────

interface MiniChartProps {
  data: { label: string; value: number }[];
  title: string;
  rate?: number;
  selectedYear: number;
  onYearChange: (y: number) => void;
  color?: string;
}

function MiniBarChart({
  data,
  title,
  rate = 15,
  selectedYear,
  onYearChange,
  color = PINK,
}: MiniChartProps) {
  const years = [2026, 2025, 2024];

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-5 flex flex-col gap-3 shadow-xs">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-[#1a1a2e]">{title}</p>
          <p className="text-[10px] text-[#7a7a9a] mt-0.5">
            Current platform rate:{" "}
            <span className="font-bold text-[#1a1a2e]">{rate}%</span>
          </p>
        </div>
        <select
          value={selectedYear}
          onChange={(e) => onYearChange(Number(e.target.value))}
          className="text-xs font-medium border border-[#e8e6f0] rounded-xl px-2.5 py-1 bg-white text-[#4a4a6a] focus:outline-none cursor-pointer"
        >
          {years.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
      <div className="h-36 pt-2">
        {data.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xs text-[#9a99b0]">
            No data available for {selectedYear}
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barCategoryGap="25%">
              <CartesianGrid
                vertical={false}
                stroke="#f4f3f6"
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 10, fill: "#7a7a9a" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={chartTooltipStyle}
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                formatter={(v: any) => [fmt(Number(v)), ""]}
                cursor={{ fill: PINK_LIGHT }}
              />
              <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}

// ── Recent Activity Row ────────────────────────────────────────────────────────

// ── Main Component ─────────────────────────────────────────────────────────────

export default function EscrowOverviewTab() {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState(currentYear);
  const [activitySearch, setActivitySearch] = useState("");

  const { data: overview, isLoading: loadingOverview } =
    useEscrowOverview(year);
  const { data: balancesData, isLoading: loadingBalances } = useEscrowBalances(
    1,
    10,
  );

  // Normalise overview summary fields from backend
  const summary = overview?.summary;

  const totalAdvertisersSpend =
    summary?.totalAdvertisersSpend ?? overview?.totalEscrowValue ?? 0;

  const totalAgencyCommission = summary?.totalAgencyCommission ?? 0;

  const totalCreatorPayout =
    summary?.totalCreatorPayout ?? overview?.totalPayouts ?? 0;

  const totalEscrowBalance =
    summary?.totalEscrowBalance ??
    overview?.totalEscrowValue ??
    summary?.totalInEscrow ??
    0;

  // Build chart data from overview.charts object or overview.monthlyChart array
  const charts = overview?.charts;
  const platformRate = charts?.platformRatePercentage ?? 15;
  const monthly = overview?.monthlyChart ?? [];

  const advertiserSpendData = charts?.advertisersSpend
    ? charts.advertisersSpend.map((item) => ({
        label: item.month,
        value: item.amount ?? 0,
      }))
    : monthly.map((m) => ({
        label: m.month,
        value: m.advertiserSpend ?? 0,
      }));

  const agencyCommissionData = charts?.agencyCommission
    ? charts.agencyCommission.map((item) => ({
        label: item.month,
        value: item.amount ?? 0,
      }))
    : monthly.map((m) => ({
        label: m.month,
        value: m.agencyCommission ?? 0,
      }));

  const creatorPayoutData = charts?.creatorPayout
    ? charts.creatorPayout.map((item) => ({
        label: item.month,
        value: item.amount ?? 0,
      }))
    : monthly.map((m) => ({
        label: m.month,
        value: m.creatorPayout ?? 0,
      }));

  const escrowBalanceData = charts?.escrowBalance
    ? charts.escrowBalance.map((item) => ({
        label: item.month,
        value: item.amount ?? 0,
      }))
    : monthly.map((m) => ({
        label: m.month,
        value: m.totalPayouts ?? 0,
      }));

  const rawRecentItems =
    overview?.recentActivity ?? balancesData?.data?.slice(0, 8) ?? [];

  const recentItems = rawRecentItems.filter(
    (item: EscrowRecentActivityItem | EscrowBalanceItem) => {
      if (!activitySearch) return true;
      const q = activitySearch.toLowerCase();
      const recentItem = item as EscrowRecentActivityItem;
      const balanceItem = item as EscrowBalanceItem;
      const title = (
        recentItem.campaignTitle ??
        balanceItem.campaignTitle ??
        balanceItem.campaign?.title ??
        ""
      ).toLowerCase();
      const brand = (
        recentItem.advertiser?.name ??
        balanceItem.brand?.name ??
        balanceItem.brandName ??
        ""
      ).toLowerCase();
      return title.includes(q) || brand.includes(q);
    },
  );

  if (loadingOverview || loadingBalances) {
    return (
      <div className="flex flex-col gap-4 animate-pulse">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#fafafa] border border-[#e8e6f0]/60 rounded-2xl h-24"
            />
          ))}
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-[#fafafa] border border-[#e8e6f0]/60 rounded-2xl h-44"
            />
          ))}
        </div>
        <div className="bg-[#fafafa] border border-[#e8e6f0]/60 rounded-2xl h-64" />
      </div>
    );
  }

  const handleExport = () => {
    const headers = [
      "Campaign Title",
      "Brand",
      "Total Funded",
      "Funding Status",
      "Campaign Status",
      "Last Updated",
    ];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = recentItems.map((item: any) => [
      item.campaignTitle ?? item.campaign?.title ?? "",
      item.advertiser?.name ?? item.brand?.name ?? item.brandName ?? "",
      item.totalFunded ?? item.totalAmount ?? item.amount ?? 0,
      item.fundingStatus ?? item.status ?? "",
      item.campaignStatus ?? item.campaign?.status ?? "",
      item.lastUpdated ?? item.updatedAt ?? item.createdAt ?? "",
    ]);
    downloadCsv(
      `Trendupp_Escrow_Recent_Activity_${new Date().toISOString().slice(0, 10)}`,
      headers,
      rows,
    );
    toast.success("Exported recent escrow activity report");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Title Header */}
      <div>
        <h2 className="text-base font-bold text-[#1a1a2e]">
          Financial Analytics
        </h2>
        <p className="text-xs text-[#7a7a9a] mt-0.5">
          Monthly budget, commission, and payout breakdown
        </p>
      </div>

      {/* KPI Cards matching backend summary structure */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AdminKpiCard
          value={fmt(totalAdvertisersSpend)}
          label="Total Advertisers Spend on Campaign"
          icon={Wallet}
          iconBg="bg-[#fce4f3]"
          iconColor="text-[#e91e8c]"
        />
        <AdminKpiCard
          value={fmt(totalAgencyCommission)}
          label="Total Agency Commission"
          icon={ShieldCheck}
          iconBg="bg-blue-50"
          iconColor="text-blue-600"
        />
        <AdminKpiCard
          value={fmt(totalCreatorPayout)}
label="Total Creator Payout"
          icon={ArrowUpRight}
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />
        <AdminKpiCard
          value={fmt(totalEscrowBalance)}
          label="Total Escrow Balance"
          icon={RefreshCcw}
          iconBg="bg-green-50"
          iconColor="text-green-600"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MiniBarChart
          title="Total Advertisers spend"
          rate={platformRate}
          selectedYear={year}
          onYearChange={setYear}
          data={advertiserSpendData}
          color="#e91e8c"
        />
        <MiniBarChart
          title="Total Agency Commission"
          rate={platformRate}
          selectedYear={year}
          onYearChange={setYear}
          data={agencyCommissionData}
          color="#e91e8c"
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <MiniBarChart
          title="Total Creator Payout"
          rate={platformRate}
          selectedYear={year}
          onYearChange={setYear}
          data={creatorPayoutData}
          color="#e91e8c"
        />
        <MiniBarChart
          title="Total Escrow"
          rate={platformRate}
          selectedYear={year}
          onYearChange={setYear}
          data={escrowBalanceData}
          color="#e91e8c"
        />
      </div>

      {/* Recent Escrow Activity */}
      <div className="bg-white border border-[#e8e6f0]/60 rounded-2xl overflow-hidden shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-[#e8e6f0]/60">
          <div>
            <p className="text-sm font-bold text-[#1a1a2e]">
              Recent Escrow Activity
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search by Campaign or Brand Name..."
              value={activitySearch}
              onChange={(e) => setActivitySearch(e.target.value)}
              className="px-3 py-1.5 text-xs border border-[#e8e6f0] rounded-xl bg-white focus:outline-none w-56 text-[#1a1a2e]"
            />
            <button className="px-3 py-1.5 text-xs font-semibold border border-[#e8e6f0] rounded-xl bg-white text-[#4a4a6a] hover:bg-[#fafafa]">
              Filters
            </button>
            <button
              onClick={handleExport}
              className="px-3 py-1.5 text-xs font-semibold border border-[#e8e6f0] rounded-xl bg-white text-[#4a4a6a] hover:bg-[#fafafa] transition-colors"
            >
              Export
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#f4f3f6] bg-[#fafafa]">
                <th className="px-5 py-3 text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wide">
                  Campaign
                </th>
                <th className="px-4 py-3 text-[10px] font-bold text-[#7a7a9a] uppercase tracking-wide">
                  Brand
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
              {recentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-10 text-center text-[#9a99b0] text-xs"
                  >
                    No escrow activity records found
                  </td>
                </tr>
              ) : (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                recentItems.map((item: any, idx: number) => {
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
                      className="border-b border-[#f4f3f6] hover:bg-[#fafafa] transition-colors"
                    >
                      <td className="px-5 py-3">
                        <span className="font-semibold text-[#1a1a2e] line-clamp-1">
                          {campaignTitle}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#4a4a6a]">{brandName}</td>
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
      </div>
    </div>
  );
}
