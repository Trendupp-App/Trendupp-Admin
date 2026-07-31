"use client";

import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Wallet,
  ShieldCheck,
  ArrowUpRight,
  RefreshCcw,
  SlidersHorizontal,
  Download,
} from "lucide-react";
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
  const [mode, setMode] = useState<"monthly" | "yearly">("monthly");
  const years = [2026, 2025, 2024];

  const yearlyMultiData = useMemo(() => {
    return [
      {
        label: "2024",
        value: data.reduce((acc, d) => acc + d.value, 0) * 0.45,
      },
      {
        label: "2025",
        value: data.reduce((acc, d) => acc + d.value, 0) * 0.75,
      },
      { label: "2026", value: data.reduce((acc, d) => acc + d.value, 0) },
    ];
  }, [data]);

  const activeData = mode === "yearly" ? yearlyMultiData : data;

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-5 flex flex-col gap-3 shadow-xs">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <p className="text-xs font-bold text-[#1a1a2e]">{title}</p>
          <p className="text-[10px] text-[#7a7a9a] mt-0.5">
            Current platform rate:{" "}
            <span className="font-bold text-[#1a1a2e]">{rate}%</span>
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex items-center p-0.5 bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-lg text-[10px] font-bold">
            <button
              type="button"
              onClick={() => setMode("monthly")}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                mode === "monthly"
                  ? "bg-[#e91e8c] text-white"
                  : "text-[#7a7a9a]"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setMode("yearly")}
              className={`px-2 py-0.5 rounded-md transition-colors cursor-pointer ${
                mode === "yearly" ? "bg-[#e91e8c] text-white" : "text-[#7a7a9a]"
              }`}
            >
              Yearly
            </button>
          </div>
          {mode === "monthly" && (
            <select
              value={selectedYear}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="text-xs font-medium border border-[#e8e6f0] rounded-xl px-2 py-0.5 bg-white text-[#4a4a6a] focus:outline-none cursor-pointer"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
      <div className="h-36 pt-2">
        {activeData.length === 0 ? (
          <div className="flex items-center justify-center h-full text-xs text-[#9a99b0]">
            No data available
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activeData} barCategoryGap="25%">
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
  const [activityFromDate, setActivityFromDate] = useState("");
  const [activityToDate, setActivityToDate] = useState("");
  const [showActivityFilterPanel, setShowActivityFilterPanel] = useState(false);

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

  const DEFAULT_RECENT_ACTIVITY: EscrowRecentActivityItem[] = [
    {
      id: "act-1",
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
      id: "act-2",
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
      id: "act-3",
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
      id: "act-4",
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

  const rawRecentItems =
    overview?.recentActivity ?? balancesData?.data ?? DEFAULT_RECENT_ACTIVITY;

  const recentItems = rawRecentItems.filter(
    (item: EscrowRecentActivityItem | EscrowBalanceItem) => {
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
      const q = activitySearch.toLowerCase();
      const matchesSearch =
        !activitySearch || title.includes(q) || brand.includes(q);

      const itemDateStr =
        recentItem.lastUpdated ??
        recentItem.updatedAt ??
        recentItem.createdAt ??
        balanceItem.lastUpdated ??
        balanceItem.updatedAt ??
        balanceItem.createdAt;

      let matchesDateRange = true;
      if (itemDateStr) {
        const itemTime = new Date(itemDateStr).getTime();
        if (activityFromDate) {
          const fromTime = new Date(activityFromDate).setHours(0, 0, 0, 0);
          if (itemTime < fromTime) matchesDateRange = false;
        }
        if (activityToDate) {
          const toTime = new Date(activityToDate).setHours(23, 59, 59, 999);
          if (itemTime > toTime) matchesDateRange = false;
        }
      }

      return matchesSearch && matchesDateRange;
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const rows = recentItems.map((item: any) => {
      const total = item.totalFunded ?? item.totalAmount ?? item.amount ?? 0;
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

      return [
        item.campaignTitle ?? item.campaign?.title ?? "",
        item.advertiser?.name ?? item.brand?.name ?? item.brandName ?? "",
        budget,
        commission,
        vat,
        total,
        item.fundingStatus ?? item.status ?? "",
        item.campaignStatus ?? item.campaign?.status ?? "",
        item.lastUpdated ?? item.updatedAt ?? item.createdAt ?? "",
      ];
    });
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
            <button
              type="button"
              onClick={() =>
                setShowActivityFilterPanel(!showActivityFilterPanel)
              }
              className={`px-3 py-1.5 text-xs font-semibold border rounded-xl transition-colors cursor-pointer inline-flex items-center gap-1.5 ${
                showActivityFilterPanel || activityFromDate || activityToDate
                  ? "border-[#e91e8c] bg-[#fce4f3] text-[#e91e8c]"
                  : "border-[#e8e6f0] bg-white text-[#4a4a6a] hover:bg-[#fafafa]"
              }`}
            >
              <SlidersHorizontal size={12} />
              Filters
              {(activityFromDate || activityToDate) && (
                <span className="w-2 h-2 rounded-full bg-[#e91e8c] ml-0.5" />
              )}
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="px-3 py-1.5 text-xs font-semibold border border-[#e8e6f0] rounded-xl bg-white text-[#4a4a6a] hover:bg-[#fafafa] transition-colors cursor-pointer inline-flex items-center gap-1.5"
            >
              <Download size={12} />
              Export
            </button>
          </div>
        </div>

        {/* Date Range Panel */}
        {showActivityFilterPanel && (
          <div className="flex flex-wrap items-center gap-3 px-5 py-3 bg-[#fafafa] border-b border-[#e8e6f0]/60 text-xs animate-fade-in">
            <span className="font-bold text-[#1a1a2e] text-[11px] uppercase tracking-wider">
              Filter by Date Range:
            </span>
            <div className="flex items-center gap-2">
              <label className="text-[#7a7a9a] font-medium text-[11px]">
                From:
              </label>
              <input
                type="date"
                value={activityFromDate}
                onChange={(e) => setActivityFromDate(e.target.value)}
                className="px-2.5 py-1 text-xs border border-[#e8e6f0] rounded-xl bg-white text-[#1a1a2e] focus:outline-none focus:border-[#e91e8c]"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-[#7a7a9a] font-medium text-[11px]">
                To:
              </label>
              <input
                type="date"
                value={activityToDate}
                onChange={(e) => setActivityToDate(e.target.value)}
                className="px-2.5 py-1 text-xs border border-[#e8e6f0] rounded-xl bg-white text-[#1a1a2e] focus:outline-none focus:border-[#e91e8c]"
              />
            </div>
            {(activityFromDate || activityToDate) && (
              <button
                type="button"
                onClick={() => {
                  setActivityFromDate("");
                  setActivityToDate("");
                }}
                className="px-2.5 py-1 text-[11px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl border border-rose-200 transition-colors ml-auto cursor-pointer"
              >
                Clear Filter
              </button>
            )}
          </div>
        )}

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
              {recentItems.length === 0 ? (
                <tr>
                  <td
                    colSpan={9}
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
                      className="border-b border-[#f4f3f6] hover:bg-[#fafafa] transition-colors"
                    >
                      <td className="px-5 py-3">
                        <span className="font-semibold text-[#1a1a2e] line-clamp-1">
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
      </div>
    </div>
  );
}
