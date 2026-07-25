"use client";

import { AdminDataTable, type AdminColumn } from "./AdminDataTable";
import { AdminStatusBadge } from "./AdminStatusBadge";
import { RecentCampaignDto } from "@/types/adminOverview";

interface ActivityRow {
  id: string;
  campaignId: string;
  campaign: string;
  brand: string;
  status: string;
  budget: string;
  applications: number;
}

const COLS: AdminColumn<ActivityRow>[] = [
  {
    header: "ID",
    accessor: (r) => (
      <span className="font-mono text-[10px] text-[#7a7a9a]">
        {r.campaignId}
      </span>
    ),
  },
  {
    header: "Campaign",
    accessor: (r) => (
      <span className="font-medium text-[#1a1a2e]">{r.campaign}</span>
    ),
  },
  { header: "Brand", accessor: "brand" },
  { header: "Status", accessor: (r) => <AdminStatusBadge status={r.status} /> },
  { header: "Budget", accessor: "budget" },
  {
    header: "Apps",
    accessor: (r) => <span className="font-semibold">{r.applications}</span>,
  },
];

interface AdminRecentActivityProps {
  activities?: RecentCampaignDto[];
}

export function AdminRecentActivity({ activities }: AdminRecentActivityProps) {
  const rows: ActivityRow[] = activities?.length
    ? activities.map((item) => ({
        id: item.id,
        campaignId: item.id.length > 8 ? `TRD-${item.id.slice(0, 4)}` : item.id,
        campaign: item.title,
        brand: item.brandName,
        status: item.status,
        budget:
          item.budget >= 1_000_000
            ? `₦${(item.budget / 1_000_000).toFixed(1)}M`
            : item.budget >= 1_000
              ? `₦${(item.budget / 1_000).toFixed(0)}k`
              : `₦${item.budget.toLocaleString()}`,
        applications: item.applicationsCount ?? 0,
      }))
    : [];

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-[#1a1a2e]">
          Recent Campaign Activity
        </h2>
        <button className="text-[10px] text-brand-pink font-semibold hover:underline">
          View All ›
        </button>
      </div>
      <AdminDataTable
        columns={COLS}
        data={rows}
        isLoading={false}
        keyExtractor={(r) => r.id}
        emptyTitle="No activity yet"
      />
    </section>
  );
}
