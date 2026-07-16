"use client";

import {
  Users,
  Megaphone,
  ShieldAlert,
  TrendingUp,
  Wallet,
  CheckCircle,
} from "lucide-react";
import { AdminKpiCard } from "@/components/admin/AdminKpiCard";
import { AdminCampaignOverview } from "@/components/admin/AdminCampaignOverview";
import { AdminGmvChart } from "@/components/admin/AdminGmvChart";
import { AdminCreatorTiers } from "@/components/admin/AdminCreatorTiers";
import { AdminRecentActivity } from "@/components/admin/AdminRecentActivity";
import { AdminTopCreators } from "@/components/admin/AdminTopCreators";

const ROW1 = [
  {
    value: "3,847",
    label: "Creators",
    trend: "124 this week",
    trendUp: true,
    icon: Users,
    iconBg: "bg-[#edf2fe]",
    iconColor: "text-[#2f63eb]",
  },
  {
    value: "₦142M",
    label: "GMV This Month",
    trend: "₦12M vs last month",
    trendUp: true,
    icon: TrendingUp,
    iconBg: "bg-[#f0fdf4]",
    iconColor: "text-[#16a34a]",
  },
  {
    value: "₦28.4M",
    label: "Escrow Balance",
    trend: "Across 62 campaigns",
    trendUp: true,
    icon: Wallet,
    iconBg: "bg-[#fef9e7]",
    iconColor: "text-[#ca8a04]",
  },
  {
    value: "4",
    label: "Open Disputes",
    trend: "2 this week",
    trendUp: false,
    icon: ShieldAlert,
    iconBg: "bg-[#fdf2f6]",
    iconColor: "text-brand-pink",
  },
];

const ROW2 = [
  {
    value: "₦21.3M",
    label: "Total Platform Revenue",
    sublabel: "15% commission collected",
    icon: TrendingUp,
    iconBg: "bg-[#fdf2f6]",
    iconColor: "text-brand-pink",
  },
  {
    value: "₦[x]M",
    label: "Escrow Held",
    sublabel: "Across 18 active campaigns",
    icon: Wallet,
    iconBg: "bg-[#f0fdf4]",
    iconColor: "text-[#16a34a]",
  },
  {
    value: "₦4.7M",
    label: "Pending Payouts",
    sublabel: "11 creators awaiting release",
    icon: Megaphone,
    iconBg: "bg-[#fef9e7]",
    iconColor: "text-[#ca8a04]",
  },
  {
    value: "₦92.1M",
    label: "Paid Out This Month",
    sublabel: "To 184 verified creators",
    icon: CheckCircle,
    iconBg: "bg-[#f0fdf4]",
    iconColor: "text-[#16a34a]",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="flex flex-col gap-5 p-6 md:p-7">
      {/* KPI Row 1 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ROW1.map((card) => (
          <AdminKpiCard key={card.label} {...card} />
        ))}
      </div>

      {/* KPI Row 2 */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {ROW2.map((card) => (
          <AdminKpiCard key={card.label} {...card} />
        ))}
      </div>

      {/* Campaign Overview */}
      <AdminCampaignOverview />

      {/* GMV Chart + Creator Tiers */}
      <div className="grid lg:grid-cols-[1fr_320px] gap-5">
        <AdminGmvChart />
        <AdminCreatorTiers />
      </div>

      {/* Recent Activity + Top Creators */}
      <div className="grid lg:grid-cols-[1fr_360px] gap-5">
        <AdminRecentActivity />
        <AdminTopCreators />
      </div>
    </div>
  );
}
