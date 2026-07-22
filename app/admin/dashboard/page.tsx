"use client";

import { Users, ShieldAlert, TrendingUp, Wallet, Loader2 } from "lucide-react";
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

  const topKpis = [
    {
      value: topMetrics ? topMetrics.totalCreators.toLocaleString() : "3,847",
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
      value: topMetrics
        ? topMetrics.totalBrands >= 1000
          ? `${(topMetrics.totalBrands / 1000).toFixed(1)}k`
          : topMetrics.totalBrands.toLocaleString()
        : "142k",
      trend: "+12M vs last month",
      trendUp: true,
      icon: TrendingUp,
      iconBg: "bg-[#f0fdf4]",
      iconColor: "text-[#16a34a]",
    },
    {
      value: topMetrics
        ? topMetrics.totalCampaigns >= 1000
          ? `${(topMetrics.totalCampaigns / 1000).toFixed(1)}k`
          : topMetrics.totalCampaigns.toLocaleString()
        : "28.4k",
      trend: "Across 62 campaigns",
      trendUp: true,
      icon: Wallet,
      iconBg: "bg-[#fef9e7]",
      iconColor: "text-[#ca8a04]",
    },
    {
      value: topMetrics ? String(topMetrics.openDisputes) : "4",
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
      <div className="flex items-center justify-center min-h-[400px] text-[#9a99b0] gap-2">
        <Loader2 className="animate-spin" size={24} />
        <span className="text-sm font-semibold">
          Loading dashboard overview…
        </span>
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
