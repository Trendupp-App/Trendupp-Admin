"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Building2,
  CheckCircle2,
  AlertOctagon,
  Clock,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";
import UserAvatar from "@/shared/UserAvatar";
import {
  useBrandSummary,
  useTopBrands,
  useBrandSignupGrowth,
  useBrandActiveUsers,
  useBrandIndustryBreakdown,
  useBrandCountryBreakdown,
} from "@/hooks/useAdminBrands";
import { useAdminOverview } from "@/hooks/useAdminOverview";
import { Skeleton } from "@/components/ui/skeleton";
import CalibratedBarChart from "./CalibratedBarChart";

const MONTH_MAP: Record<string, number> = {
  January: 1,
  February: 2,
  March: 3,
  April: 4,
  May: 5,
  June: 6,
  July: 7,
  August: 8,
  September: 9,
  October: 10,
  November: 11,
  December: 12,
};

export default function AdvertiserAnalyticsView() {
  // Always default to today's year/month — never hardcoded
  const NOW_YEAR = String(new Date().getFullYear());
  const NOW_MONTH = new Date().toLocaleString("default", { month: "long" });

  // Signup Growth Filters State
  const [signupPeriod, setSignupPeriod] = useState<
    "Daily" | "Weekly" | "Monthly" | "Yearly"
  >("Monthly");
  const [signupYear, setSignupYear] = useState(NOW_YEAR);
  const [signupMonth, setSignupMonth] = useState(NOW_MONTH);

  // Active Users Filters State
  const [activePeriod, setActivePeriod] = useState<
    "Daily" | "Weekly" | "Monthly" | "Yearly"
  >("Monthly");
  const [activeYear, setActiveYear] = useState(NOW_YEAR);
  const [activeMonth, setActiveMonth] = useState(NOW_MONTH);

  const { data: overviewRes, isLoading: isLoadingOverview } =
    useAdminOverview();
  const { data: summaryRes, isLoading: isLoadingSummary } = useBrandSummary();
  const { data: topBrands = [], isLoading: isLoadingTopBrands } =
    useTopBrands();

  // Pass active filters into growth hooks
  const { data: signupGrowth = [], isLoading: isLoadingSignup } =
    useBrandSignupGrowth(
      signupPeriod === "Yearly" ? "yearly" : signupPeriod.toLowerCase(),
      signupPeriod === "Yearly" ? undefined : parseInt(signupYear),
      signupPeriod === "Yearly" ? undefined : MONTH_MAP[signupMonth] || 7,
    );
  const { data: activeUsers = [], isLoading: isLoadingActive } =
    useBrandActiveUsers(
      activePeriod === "Yearly" ? "yearly" : activePeriod.toLowerCase(),
      activePeriod === "Yearly" ? undefined : parseInt(activeYear),
      activePeriod === "Yearly" ? undefined : MONTH_MAP[activeMonth] || 7,
    );

  const { data: industryBreakdown = [], isLoading: isLoadingIndustry } =
    useBrandIndustryBreakdown();
  const { data: countryBreakdown = [], isLoading: isLoadingCountry } =
    useBrandCountryBreakdown();

  const summary = summaryRes?.summary;
  const topMetrics = overviewRes?.topMetrics;

  const totalAdvertisers =
    topMetrics?.totalBrands ??
    summary?.totalAdvertisers ??
    summary?.totalBrands ??
    0;
  const activeAdvertisers = summary?.profileCompleted ?? 0;
  const suspendedAdvertisers =
    summary?.suspendedAdvertisers ?? summary?.suspendedBrands ?? 0;
  const pendingAdvertisers = summary?.pendingProfileCompletion ?? 0;

  // Retention Rate: live derived from active/total — no hardcoded fallback
  const retentionRate =
    (summary as { retentionRate?: number })?.retentionRate ??
    (totalAdvertisers > 0
      ? Math.round((activeAdvertisers / totalAdvertisers) * 100)
      : null);

  // Dynamic previous month label
  const prevMonthLabel = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 1,
    1,
  ).toLocaleString("default", { month: "long" });

  const signupChartData = signupGrowth.map((s) => ({
    label: s.label,
    count: s.count,
  }));
  const activeChartData = activeUsers.map((a) => ({
    label: a.label,
    count: a.count,
  }));

  const isLoadingStats = isLoadingSummary || isLoadingOverview;

  return (
    <div className="flex flex-col gap-6 text-left animate-fade-in-up">
      {/* Subtitle */}
      <div>
        <h2 className="text-base font-bold text-[#1a1a2e]">
          Advertiser Analytics
        </h2>
        <p className="text-xs text-[#9a99b0] font-medium">
          Advertiser activity, campaign spend, and account performance metrics
          across Trendupp.
        </p>
      </div>

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Advertisers */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
              Total Advertisers
            </span>
            <span className="text-2xl font-extrabold text-[#1a1a2e]">
              {isLoadingStats || totalAdvertisers === undefined ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                totalAdvertisers.toLocaleString()
              )}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#eff6ff] text-[#2563eb] flex items-center justify-center">
            <Building2 size={18} />
          </div>
        </div>

        {/* Active Advertisers */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
              Active Advertisers
            </span>
            <span className="text-2xl font-extrabold text-[#1a1a2e]">
              {isLoadingStats || activeAdvertisers === undefined ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                activeAdvertisers.toLocaleString()
              )}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center">
            <CheckCircle2 size={18} />
          </div>
        </div>

        {/* Suspended */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
              Suspended
            </span>
            <span className="text-2xl font-extrabold text-[#1a1a2e]">
              {isLoadingStats || suspendedAdvertisers === undefined ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                suspendedAdvertisers.toLocaleString()
              )}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#fef2f2] text-[#dc2626] flex items-center justify-center">
            <AlertOctagon size={18} />
          </div>
        </div>

        {/* Pending Verification */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
              Pending Verification
            </span>
            <span className="text-2xl font-extrabold text-[#1a1a2e]">
              {isLoadingStats || pendingAdvertisers === undefined ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                pendingAdvertisers.toLocaleString()
              )}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#fff7ed] text-[#ea580c] flex items-center justify-center">
            <Clock size={18} />
          </div>
        </div>
      </div>

      {/* Retention Rate Banner Card */}
      <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
              Advertiser Retention Rate
            </span>
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold text-[#1a1a2e]">
                {isLoadingStats ? (
                  <Skeleton className="h-9 w-20" />
                ) : retentionRate !== null && retentionRate !== undefined ? (
                  `${retentionRate}%`
                ) : (
                  <span className="text-sm text-[#9a99b0] font-semibold">
                    No data yet
                  </span>
                )}
              </span>
              {retentionRate !== null && retentionRate !== undefined && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f0fdf4] text-[#16a34a] border border-[#dcfce7] flex items-center gap-1">
                  <ArrowUpRight size={12} /> vs {prevMonthLabel}
                </span>
              )}
            </div>
          </div>
          <div className="w-11 h-11 rounded-2xl bg-brand-pink-light text-brand-pink flex items-center justify-center">
            <TrendingUp size={20} />
          </div>
        </div>
        <p className="text-xs text-[#7a7a9a] font-medium">
          Percentage of advertisers running campaigns and allocating budget
          month over month.
        </p>
      </div>

      {/* 2 Growth Charts Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CalibratedBarChart
          title="Signup growth"
          subtitle="How many advertisers registered per period"
          data={signupChartData}
          isLoading={isLoadingSignup}
          period={signupPeriod}
          onPeriodChange={setSignupPeriod}
          year={signupYear}
          onYearChange={setSignupYear}
          month={signupMonth}
          onMonthChange={setSignupMonth}
        />
        <CalibratedBarChart
          title="Active users"
          subtitle="Active advertisers"
          data={activeChartData}
          isLoading={isLoadingActive}
          period={activePeriod}
          onPeriodChange={setActivePeriod}
          year={activeYear}
          onYearChange={setActiveYear}
          month={activeMonth}
          onMonthChange={setActiveMonth}
        />
      </div>

      {/* Middle Row: Top Advertisers & Spend Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Advertisers Card */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#1a1a2e]">
                Top Advertisers
              </h3>
              <p className="text-[11px] text-[#9a99b0]">
                Highest spending brands on Trendupp
              </p>
            </div>
            <Link
              href="/admin/users/brands"
              className="text-xs font-bold text-brand-pink hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="flex flex-col divide-y divide-[#e8e6f0]/40">
            {isLoadingTopBrands ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Skeleton className="w-9 h-9 rounded-full" />
                    <div className="flex flex-col gap-1">
                      <Skeleton className="w-24 h-3.5" />
                      <Skeleton className="w-16 h-3" />
                    </div>
                  </div>
                  <Skeleton className="w-12 h-5 rounded-full" />
                </div>
              ))
            ) : topBrands.length === 0 ? (
              <p className="py-6 text-center text-xs text-[#9a99b0]">
                No top advertisers found.
              </p>
            ) : (
              topBrands.slice(0, 5).map((b, idx) => (
                <div
                  key={b.id || idx}
                  className="py-3 flex items-center justify-between first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#9a99b0] w-4">
                      {idx + 1}
                    </span>
                    <UserAvatar
                      avatarUrl={b.logoUrl}
                      initials={
                        b.brandName
                          ? b.brandName.slice(0, 2).toUpperCase()
                          : "BR"
                      }
                      size={36}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#1a1a2e]">
                        {b.brandName || "Brand Partner"}
                      </span>
                      <span className="text-[11px] text-[#9a99b0]">
                        {b.campaignsCount
                          ? `${b.campaignsCount} campaigns`
                          : "—"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#16a34a]">
                      {b.totalSpend
                        ? `₦${(b.totalSpend / 1000000).toFixed(1)}M`
                        : "—"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Industry Breakdown */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-4 shadow-xs">
          <h4 className="text-xs font-bold text-[#1a1a2e]">
            Industry Breakdown
          </h4>
          <div className="flex flex-col gap-3">
            {isLoadingIndustry ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full rounded-md" />
              ))
            ) : industryBreakdown.length === 0 ? (
              <p className="py-4 text-xs text-[#9a99b0]">
                No industry breakdown available.
              </p>
            ) : (
              industryBreakdown.map((ind, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1a1a2e]">
                      {ind.industry}
                    </span>
                    <span className="font-semibold text-[#7a7a9a]">
                      {ind.count} brands
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#f4f3f6] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-pink"
                      style={{ width: `${ind.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Country Breakdown */}
      <div className="grid grid-cols-1 gap-6">
        {/* Country Breakdown */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-4 shadow-xs">
          <h4 className="text-xs font-bold text-[#1a1a2e]">
            Country Breakdown
          </h4>
          <div className="flex flex-col gap-3">
            {isLoadingCountry ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-full rounded-md" />
              ))
            ) : countryBreakdown.length === 0 ? (
              <p className="py-4 text-xs text-[#9a99b0]">
                No country breakdown recorded.
              </p>
            ) : (
              countryBreakdown.map((c, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1a1a2e]">
                      {c.country}
                    </span>
                    <span className="font-semibold text-[#7a7a9a]">
                      {c.count} brands
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#f4f3f6] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#2563eb]"
                      style={{ width: `${c.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
