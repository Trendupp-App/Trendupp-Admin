"use client";

import { Users, ShieldAlert, TrendingUp, Wallet } from "lucide-react";
import { AdminKpiCard } from "@/components/admin/AdminKpiCard";
import { AdminActionsRequired } from "@/components/admin/AdminActionsRequired";
import { AdminCampaignOverview } from "@/components/admin/AdminCampaignOverview";
import { AdminCreatorTiers } from "@/components/admin/AdminCreatorTiers";
import { AdminRecentActivity } from "@/components/admin/AdminRecentActivity";
import { AdminTopCreators } from "@/components/admin/AdminTopCreators";
import { useAdminOverview } from "@/hooks/useAdminOverview";

export default function AdminDashboardPage() {
  const { data: overview, isLoading } = useAdminOverview();

  const topMetrics = overview?.topMetrics;

  const formatMetricValue = (val: number | undefined, fallback: string) => {
    if (val === undefined || val === null) return fallback;
    if (val >= 100000) {
      return `${(val / 1000).toFixed(1)}k`;
    }
    return val.toLocaleString();
  };

  const topKpis = [
    {
      value: formatMetricValue(topMetrics?.totalCreators, "3,847"),
      label: "Total Creators",
      trend: overview?.creatorTiers?.newThisWeek
        ? `+${overview.creatorTiers.newThisWeek} this week`
        : "+124 this week",
      trendUp: true,
      icon: Users,
      iconBg: "bg-[#edf2fe]",
      iconColor: "text-[#2f63eb]",
    },
    {
      value: formatMetricValue(topMetrics?.totalBrands, "0"),
      label: "Total Advertisers",
      trend: "+12M vs last month",
      trendUp: true,
      icon: TrendingUp,
      iconBg: "bg-[#f0fdf4]",
      iconColor: "text-[#16a34a]",
    },
    {
      value: formatMetricValue(topMetrics?.totalCampaigns, "0"),
      label: "Total Campaigns",
      trend: "Across 62 campaigns",
      trendUp: true,
      icon: Wallet,
      iconBg: "bg-[#fef9e7]",
      iconColor: "text-[#ca8a04]",
    },
    {
      value: formatMetricValue(topMetrics?.openDisputes, "0"),
      label: "Open Disputes",
      trend: "+2 this week",
      trendUp: false,
      icon: ShieldAlert,
      iconBg: "bg-[#fdf2f6]",
      iconColor: "text-brand-pink",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6 p-6 md:p-7 animate-fade-in-up">
        {/* Top 4 KPI Cards Shimmer */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-4 flex flex-col gap-3 animate-pulse shadow-xs"
            >
              <div className="flex items-center justify-between">
                <div className="w-8 h-8 rounded-xl bg-[#e8e6f0]/60" />
                <div className="w-16 h-3 bg-[#e8e6f0]/40 rounded-md" />
              </div>
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="w-20 h-7 bg-[#e8e6f0]/60 rounded-lg" />
                <div className="w-24 h-3 bg-[#e8e6f0]/40 rounded-md" />
              </div>
            </div>
          ))}
        </div>

        {/* Actions Required Callout Section Shimmer */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 animate-pulse flex flex-col gap-3 shadow-xs">
          <div className="w-40 h-4 bg-[#e8e6f0]/60 rounded-md" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-1">
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-20 bg-[#faf9fc] rounded-2xl p-4 flex flex-col gap-2"
              >
                <div className="w-24 h-3 bg-[#e8e6f0]/60 rounded-md" />
                <div className="w-16 h-6 bg-[#e8e6f0]/60 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Campaign Overview Section Shimmer */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 animate-pulse flex flex-col gap-4 shadow-xs">
          <div className="w-48 h-4 bg-[#e8e6f0]/60 rounded-md" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-[#faf9fc] rounded-2xl p-3 flex flex-col justify-between"
              >
                <div className="w-16 h-3 bg-[#e8e6f0]/60 rounded-md" />
                <div className="w-12 h-6 bg-[#e8e6f0]/60 rounded-md" />
              </div>
            ))}
          </div>
        </div>

        {/* Creator Tiers Section Shimmer */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 animate-pulse flex flex-col gap-4 shadow-xs">
          <div className="w-36 h-4 bg-[#e8e6f0]/60 rounded-md" />
          <div className="h-40 bg-[#faf9fc] rounded-2xl" />
        </div>

        {/* Bottom Grid: Recent Activity + Top Creators Shimmer */}
        <div className="grid lg:grid-cols-[1fr_360px] gap-6">
          <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 animate-pulse h-80 flex flex-col gap-4 shadow-xs">
            <div className="w-40 h-4 bg-[#e8e6f0]/60 rounded-md" />
            <div className="w-full h-full bg-[#faf9fc] rounded-2xl" />
          </div>
          <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 animate-pulse h-80 flex flex-col gap-4 shadow-xs">
            <div className="w-32 h-4 bg-[#e8e6f0]/60 rounded-md" />
            <div className="w-full h-full bg-[#faf9fc] rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:p-7 animate-fade-in-up">
      {/* Top 4 KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {topKpis.map((card) => (
          <AdminKpiCard key={card.label} {...card} />
        ))}
      </div>

      {/* Actions Required Callout Section */}
      <AdminActionsRequired actionsRequired={overview?.actionsRequired} />

      {/* Campaign Overview Section (6 Cards) */}
      <AdminCampaignOverview overview={overview?.campaignOverview} />

      {/* Creator Tiers Section (Full Width) */}
      <AdminCreatorTiers creatorTiers={overview?.creatorTiers} />

      {/* Bottom Grid: Recent Activity + Top Creators */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <AdminRecentActivity activities={overview?.recentCampaignActivity} />
        <AdminTopCreators creators={overview?.topCreators} />
      </div>
    </div>
  );
}
