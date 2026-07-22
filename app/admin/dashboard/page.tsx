"use client";

import {
  Users,
  Megaphone,
  ShieldAlert,
  TrendingUp,
  Wallet,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { AdminKpiCard } from "@/components/admin/AdminKpiCard";
import { AdminCampaignOverview } from "@/components/admin/AdminCampaignOverview";
import { AdminGmvChart } from "@/components/admin/AdminGmvChart";
import { AdminCreatorTiers } from "@/components/admin/AdminCreatorTiers";
import { AdminRecentActivity } from "@/components/admin/AdminRecentActivity";
import { AdminTopCreators } from "@/components/admin/AdminTopCreators";
import { useAdminOverview } from "@/hooks/useAdminOverview";

export default function AdminDashboardPage() {
  const { data: overview, isLoading } = useAdminOverview();

  const topMetrics = overview?.topMetrics;
  const actionsRequired = overview?.actionsRequired;

  const row1 = [
    {
      value: topMetrics ? topMetrics.totalCreators.toLocaleString() : "3,847",
      label: "Creators",
      trend: overview?.creatorTiers?.newThisWeek
        ? `${overview.creatorTiers.newThisWeek} this week`
        : "124 this week",
      trendUp: true,
      icon: Users,
      iconBg: "bg-[#edf2fe]",
      iconColor: "text-[#2f63eb]",
    },
    {
      value: topMetrics ? topMetrics.totalBrands.toLocaleString() : "1,420",
      label: "Brands Registered",
      trend: "Active advertisers",
      trendUp: true,
      icon: TrendingUp,
      iconBg: "bg-[#f0fdf4]",
      iconColor: "text-[#16a34a]",
    },
    {
      value: topMetrics ? topMetrics.totalCampaigns.toLocaleString() : "284",
      label: "Total Campaigns",
      trend: "Across all statuses",
      trendUp: true,
      icon: Wallet,
      iconBg: "bg-[#fef9e7]",
      iconColor: "text-[#ca8a04]",
    },
    {
      value: topMetrics ? String(topMetrics.openDisputes) : "4",
      label: "Open Disputes",
      trend: "Requires review",
      trendUp: false,
      icon: ShieldAlert,
      iconBg: "bg-[#fdf2f6]",
      iconColor: "text-brand-pink",
    },
  ];

  const row2 = [
    {
      value: actionsRequired ? String(actionsRequired.unresolvedDisputes) : "4",
      label: "Unresolved Disputes",
      sublabel: "Pending admin review",
      icon: ShieldAlert,
      iconBg: "bg-[#fdf2f6]",
      iconColor: "text-brand-pink",
    },
    {
      value: actionsRequired ? String(actionsRequired.resolvedDisputes) : "12",
      label: "Resolved Disputes",
      sublabel: "Cases closed",
      icon: CheckCircle,
      iconBg: "bg-[#f0fdf4]",
      iconColor: "text-[#16a34a]",
    },
    {
      value: actionsRequired
        ? String(actionsRequired.creatorsAwaitingPayment)
        : "11",
      label: "Creators Awaiting Payout",
      sublabel: "Pending escrow release",
      icon: Megaphone,
      iconBg: "bg-[#fef9e7]",
      iconColor: "text-[#ca8a04]",
    },
    {
      value: overview?.creatorTiers?.pendingVerification
        ? String(overview.creatorTiers.pendingVerification)
        : "23",
      label: "Pending Verifications",
      sublabel: "Creator profiles queued",
      icon: Users,
      iconBg: "bg-[#edf2fe]",
      iconColor: "text-[#2f63eb]",
    },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-[#9a99b0] gap-2">
        <Loader2 className="animate-spin" size={24} />
        <span className="text-sm font-semibold">
          Loading dashboard metrics…
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 p-6 md:p-7 animate-fade-in-up">
      {/* KPI Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {row1.map((card) => (
          <AdminKpiCard key={card.label} {...card} />
        ))}
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {row2.map((card) => (
          <AdminKpiCard key={card.label} {...card} />
        ))}
      </div>

      {/* Campaign Overview */}
      <AdminCampaignOverview overview={overview?.campaignOverview} />

      {/* GMV Chart + Creator Tiers */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <AdminGmvChart />
        <AdminCreatorTiers creatorTiers={overview?.creatorTiers} />
      </div>

      {/* Recent Activity + Top Creators */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-5">
        <AdminRecentActivity activities={overview?.recentCampaignActivity} />
        <AdminTopCreators creators={overview?.topCreators} />
      </div>
    </div>
  );
}
