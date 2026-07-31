"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ChevronDown,
} from "lucide-react";
import UserAvatar from "@/shared/UserAvatar";
import {
  useCreatorSummary,
  useTopCreators,
  useCreatorSignupGrowth,
  useCreatorActiveUsers,
  useCreatorTierDistribution,
  useCreatorGenderDistribution,
  useCreatorNicheBreakdown,
  useCreatorCountryBreakdown,
} from "@/hooks/useAdminCreators";
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

export default function CreatorAnalyticsView() {
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
  const { data: summaryRes, isLoading: isLoadingSummary } = useCreatorSummary();
  const { data: topCreators = [], isLoading: isLoadingTopCreators } =
    useTopCreators();

  // Pass active filters into growth hooks
  const { data: signupGrowth = [], isLoading: isLoadingSignup } =
    useCreatorSignupGrowth(
      signupPeriod.toLowerCase(),
      parseInt(signupYear),
      MONTH_MAP[signupMonth] || 7,
    );
  const { data: activeUsers = [], isLoading: isLoadingActive } =
    useCreatorActiveUsers(
      activePeriod === "Yearly" ? "yearly" : activePeriod.toLowerCase(),
      activePeriod === "Yearly" ? undefined : parseInt(activeYear),
      activePeriod === "Yearly" ? undefined : MONTH_MAP[activeMonth] || 7,
    );

  const { data: tierDistribution = [], isLoading: isLoadingTiers } =
    useCreatorTierDistribution();
  const { data: genderDistribution = [], isLoading: isLoadingGender } =
    useCreatorGenderDistribution();
  const { data: nicheBreakdown = [], isLoading: isLoadingNiche } =
    useCreatorNicheBreakdown();
  const { data: countryBreakdown = [], isLoading: isLoadingCountry } =
    useCreatorCountryBreakdown();

  const summary = summaryRes?.summary;
  const topMetrics = overviewRes?.topMetrics;

  const totalCreators =
    topMetrics?.totalCreators ?? summary?.totalCreators ?? 0;
  const activeCreators = summary?.profileCompleted ?? 0;
  const suspendedCreators = summary?.suspendedCreators ?? 0;
  const pendingCreators = summary?.pendingProfileCompletion ?? 0;

  // Retention Rate: active creators as % of total (live, not dummy)
  // Falls back to (active / total) if no dedicated field
  const retentionRate =
    (summary as { retentionRate?: number })?.retentionRate ??
    (totalCreators > 0
      ? Math.round((activeCreators / totalCreators) * 100)
      : null);

  // Month-over-month label: use prev month name dynamically
  const prevMonthLabel = new Date(
    new Date().getFullYear(),
    new Date().getMonth() - 1,
    1,
  ).toLocaleString("default", { month: "long" });

  // Profile completion stages
  const dist = summaryRes?.profileCompletionDistribution;
  const profileCompletionStages =
    dist && dist.length > 0
      ? dist.map((item, idx) => {
          const colors = [
            "bg-brand-pink",
            "bg-brand-pink/70",
            "bg-brand-pink/40",
            "bg-brand-pink/20",
          ];
          const numPct = parseInt(item.percentageLabel) || 100 - idx * 25;
          return {
            label: item.percentageLabel.includes("%")
              ? item.percentageLabel
              : `${item.percentageLabel}%`,
            percentage: numPct,
            count: `${item.count.toLocaleString()} creators`,
            color: colors[idx % colors.length],
          };
        })
      : [];

  // Connected socials
  const connectedSocials = summaryRes?.connectedSocials;
  const connectedSocialsList = connectedSocials
    ? [
        {
          name: "TikTok",
          count: `${(connectedSocials.tiktok ?? 0).toLocaleString()} users`,
          percentage: totalCreators
            ? Math.min(
                100,
                Math.round(
                  ((connectedSocials.tiktok ?? 0) / totalCreators) * 100,
                ),
              )
            : 0,
          color: "bg-[#000000]",
        },
        {
          name: "Instagram",
          count: `${(connectedSocials.instagram ?? 0).toLocaleString()} users`,
          percentage: totalCreators
            ? Math.min(
                100,
                Math.round(
                  ((connectedSocials.instagram ?? 0) / totalCreators) * 100,
                ),
              )
            : 0,
          color: "bg-[#e1306c]",
        },
        {
          name: "YouTube",
          count: `${(connectedSocials.youtube ?? 0).toLocaleString()} users`,
          percentage: totalCreators
            ? Math.min(
                100,
                Math.round(
                  ((connectedSocials.youtube ?? 0) / totalCreators) * 100,
                ),
              )
            : 0,
          color: "bg-[#ff0000]",
        },
        {
          name: "Twitter",
          count: `${(connectedSocials.twitter ?? 0).toLocaleString()} users`,
          percentage: totalCreators
            ? Math.min(
                100,
                Math.round(
                  ((connectedSocials.twitter ?? 0) / totalCreators) * 100,
                ),
              )
            : 0,
          color: "bg-[#1da1f2]",
        },
        {
          name: "Facebook",
          count: `${(connectedSocials.facebook ?? 0).toLocaleString()} users`,
          percentage: totalCreators
            ? Math.min(
                100,
                Math.round(
                  ((connectedSocials.facebook ?? 0) / totalCreators) * 100,
                ),
              )
            : 0,
          color: "bg-[#1877f2]",
        },
      ]
    : [];

  // Tier distribution colors
  const tierColors: Record<string, string> = {
    Nano: "#16a34a",
    Micro: "#2563eb",
    "Mid-Tier": "#8b5cf6",
    Macro: "#f59e0b",
    Mega: "#dc2626",
  };

  const genderColors: Record<string, string> = {
    Male: "#2563eb",
    Female: "#e11d48",
    Other: "#9a99b0",
  };

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
          Creator Analytics
        </h2>
        <p className="text-xs text-[#9a99b0] font-medium">
          Key metrics for creator growth, activity, and demographic distribution
          on Trendupp.
        </p>
      </div>

      {/* 4 Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Creators */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
              Total Creators
            </span>
            <span className="text-2xl font-extrabold text-[#1a1a2e]">
              {isLoadingStats || totalCreators === undefined ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                totalCreators.toLocaleString()
              )}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#eff6ff] text-[#2563eb] flex items-center justify-center">
            <Users size={18} />
          </div>
        </div>

        {/* Active Creators */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
              Active Creators
            </span>
            <span className="text-2xl font-extrabold text-[#1a1a2e]">
              {isLoadingStats || activeCreators === undefined ? (
                <Skeleton className="h-8 w-20" />
              ) : (
                activeCreators.toLocaleString()
              )}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center">
            <UserCheck size={18} />
          </div>
        </div>

        {/* Suspended */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
              Suspended
            </span>
            <span className="text-2xl font-extrabold text-[#1a1a2e]">
              {isLoadingStats || suspendedCreators === undefined ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                suspendedCreators.toLocaleString()
              )}
            </span>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#fef2f2] text-[#dc2626] flex items-center justify-center">
            <UserX size={18} />
          </div>
        </div>

        {/* Pending Verification */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex items-center justify-between shadow-xs">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
              Pending Verification
            </span>
            <span className="text-2xl font-extrabold text-[#1a1a2e]">
              {isLoadingStats || pendingCreators === undefined ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                pendingCreators.toLocaleString()
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
              Creator Retention Rate
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
          Percentage of creators remaining active and taking campaign
          opportunities month over month.
        </p>
      </div>

      {/* 2 Growth Charts Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CalibratedBarChart
          title="Signup growth"
          subtitle="How many creators registered per period"
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
          subtitle="Active creators"
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

      {/* Middle Row: Top Creators & Tier Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Creators Card */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-4 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#1a1a2e]">Top Creators</h3>
              <p className="text-[11px] text-[#9a99b0]">
                Highest performing creators by reach &amp; rating
              </p>
            </div>
            <Link
              href="/admin/users/creators"
              className="text-xs font-bold text-brand-pink hover:underline flex items-center gap-1"
            >
              View All <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="flex flex-col divide-y divide-[#e8e6f0]/40">
            {isLoadingTopCreators ? (
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
            ) : topCreators.length === 0 ? (
              <p className="py-6 text-center text-xs text-[#9a99b0]">
                No top creators found.
              </p>
            ) : (
              topCreators.slice(0, 5).map((cr, idx) => (
                <div
                  key={cr.id || idx}
                  className="py-3 flex items-center justify-between first:pt-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#9a99b0] w-4">
                      {idx + 1}
                    </span>
                    <UserAvatar
                      avatarUrl={cr.avatarUrl}
                      initials={
                        cr.name ? cr.name.slice(0, 2).toUpperCase() : "CR"
                      }
                      size={36}
                    />
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-[#1a1a2e]">
                        {cr.name}
                      </span>
                      <span className="text-[11px] text-[#9a99b0]">
                        {cr.handle || "@creator"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#eff6ff] text-[#2563eb]">
                      {cr.tier || "Micro"}
                    </span>
                    <span className="text-xs font-bold text-[#1a1a2e]">
                      {cr.completedCampaigns
                        ? `${cr.completedCampaigns} jobs`
                        : "—"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Tier Distribution & Gender Breakdown Card */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-xs">
          {/* Creator Tier Distribution */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#1a1a2e]">
                Creator Tier Distribution
              </h3>
              <span className="text-[10px] font-bold text-[#9a99b0] uppercase">
                This month
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {isLoadingTiers ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full rounded-md" />
                ))
              ) : tierDistribution.length === 0 ? (
                <p className="text-xs text-[#9a99b0]">
                  No tier data available.
                </p>
              ) : (
                tierDistribution.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#5a5a7a]">
                        {item.tier}
                      </span>
                      <span className="font-bold text-[#1a1a2e]">
                        {item.percentage}% ({item.count})
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#f4f3f6] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor: tierColors[item.tier] || "#2563eb",
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border-t border-[#e8e6f0]/60 pt-4">
            {/* Gender Breakdown */}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-[#1a1a2e]">
                Gender Breakdown
              </h3>
              <div className="flex items-center gap-1 text-[11px] text-[#7a7a9a] font-bold">
                October <ChevronDown size={12} />
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              {isLoadingGender ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-6 w-full rounded-md" />
                ))
              ) : genderDistribution.length === 0 ? (
                <p className="text-xs text-[#9a99b0]">
                  No gender distribution recorded.
                </p>
              ) : (
                genderDistribution.map((item, idx) => (
                  <div key={idx} className="flex flex-col gap-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-[#5a5a7a]">
                        {item.gender}
                      </span>
                      <span className="font-bold text-[#1a1a2e]">
                        {item.percentage}% ({item.count})
                      </span>
                    </div>
                    <div className="h-2 w-full bg-[#f4f3f6] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${item.percentage}%`,
                          backgroundColor:
                            genderColors[item.gender] || "#9a99b0",
                        }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Grid: 4 Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Profile Completion */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3 shadow-xs">
          <h4 className="text-xs font-bold text-[#1a1a2e]">
            Profile Completion
          </h4>
          <div className="flex flex-col gap-2.5">
            {isLoadingSummary ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full rounded-md" />
              ))
            ) : profileCompletionStages.length === 0 ? (
              <p className="text-xs text-[#9a99b0]">
                No profile stages recorded.
              </p>
            ) : (
              profileCompletionStages.map((st, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#1a1a2e]">{st.label}</span>
                    <span className="font-semibold text-[#7a7a9a]">
                      {st.count}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#f4f3f6] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${st.color}`}
                      style={{ width: `${st.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Connected Socials */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3 shadow-xs">
          <h4 className="text-xs font-bold text-[#1a1a2e]">
            Connected Socials
          </h4>
          <div className="flex flex-col gap-2.5">
            {isLoadingSummary ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full rounded-md" />
              ))
            ) : connectedSocialsList.length === 0 ? (
              <p className="text-xs text-[#9a99b0]">
                No social channels connected.
              </p>
            ) : (
              connectedSocialsList.map((soc, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#1a1a2e]">{soc.name}</span>
                    <span className="font-semibold text-[#7a7a9a]">
                      {soc.count}
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#f4f3f6] rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${soc.color}`}
                      style={{ width: `${soc.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Niche Breakdown */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3 shadow-xs">
          <h4 className="text-xs font-bold text-[#1a1a2e]">Niche Breakdown</h4>
          <div className="flex flex-col gap-2.5">
            {isLoadingNiche ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full rounded-md" />
              ))
            ) : nicheBreakdown.length === 0 ? (
              <p className="text-xs text-[#9a99b0]">No niches recorded.</p>
            ) : (
              nicheBreakdown.map((n, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#1a1a2e]">{n.niche}</span>
                    <span className="font-semibold text-[#7a7a9a]">
                      {n.count} creators
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#f4f3f6] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-brand-pink"
                      style={{ width: `${n.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Country Breakdown */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3 shadow-xs">
          <h4 className="text-xs font-bold text-[#1a1a2e]">
            Country Breakdown
          </h4>
          <div className="flex flex-col gap-2.5">
            {isLoadingCountry ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-5 w-full rounded-md" />
              ))
            ) : countryBreakdown.length === 0 ? (
              <p className="text-xs text-[#9a99b0]">No countries recorded.</p>
            ) : (
              countryBreakdown.map((c, idx) => (
                <div key={idx} className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#1a1a2e]">
                      {c.country}
                    </span>
                    <span className="font-semibold text-[#7a7a9a]">
                      {c.count} creators
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-[#f4f3f6] rounded-full overflow-hidden">
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
