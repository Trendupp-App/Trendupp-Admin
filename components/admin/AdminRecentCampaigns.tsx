"use client";

import Link from "next/link";
import { Megaphone, ExternalLink } from "lucide-react";
import { AdminDataTable, type AdminColumn } from "./AdminDataTable";
import { AdminStatusBadge } from "./AdminStatusBadge";

interface MockCampaign {
  id: string;
  title: string;
  brand: string;
  budget: string;
  status: string;
  date: string;
}

const MOCK: MockCampaign[] = [
  {
    id: "1",
    title: "Summer Glow Collection",
    brand: "Zaron Beauty",
    budget: "₦500,000",
    status: "live",
    date: "10 Jul 2026",
  },
  {
    id: "2",
    title: "Back to School Campaign",
    brand: "Konga Nigeria",
    budget: "₦250,000",
    status: "submitted",
    date: "09 Jul 2026",
  },
  {
    id: "3",
    title: "Naija Street Style",
    brand: "Ykone Africa",
    budget: "₦750,000",
    status: "active",
    date: "08 Jul 2026",
  },
  {
    id: "4",
    title: "Ramadan Promo 2026",
    brand: "Jumia Foods",
    budget: "₦180,000",
    status: "completed",
    date: "07 Jul 2026",
  },
  {
    id: "5",
    title: "Tech Creators Spotlight",
    brand: "Tecno Mobile",
    budget: "₦1,200,000",
    status: "live",
    date: "06 Jul 2026",
  },
  {
    id: "6",
    title: "Food & Lifestyle Collab",
    brand: "Chicken Republic",
    budget: "₦95,000",
    status: "draft",
    date: "05 Jul 2026",
  },
];

const COLS: AdminColumn<MockCampaign>[] = [
  {
    header: "Title",
    accessor: (c) => (
      <span className="font-medium text-[#1a1a2e]">{c.title}</span>
    ),
  },
  { header: "Brand", accessor: "brand" },
  { header: "Budget", accessor: "budget" },
  { header: "Status", accessor: (c) => <AdminStatusBadge status={c.status} /> },
  { header: "Date", accessor: "date", className: "whitespace-nowrap" },
  {
    header: "",
    accessor: (c) => (
      <Link
        href={`/admin/campaigns/${c.id}`}
        className="text-brand-pink hover:underline flex items-center gap-1 text-[10px] font-medium"
      >
        View <ExternalLink size={10} />
      </Link>
    ),
  },
];

export function AdminRecentCampaigns() {
  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[#edf2fe] flex items-center justify-center">
            <Megaphone size={15} className="text-[#2f63eb]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[#1a1a2e]">
              Recent Campaigns
            </h2>
            <p className="text-[10px] text-[#7a7a9a]">
              Latest submitted campaigns
            </p>
          </div>
        </div>
        <Link
          href="/admin/campaigns"
          className="text-[10px] text-brand-pink font-semibold hover:underline"
        >
          View all
        </Link>
      </div>
      <AdminDataTable
        columns={COLS}
        data={MOCK}
        isLoading={false}
        keyExtractor={(c) => c.id}
        emptyTitle="No campaigns yet"
      />
    </section>
  );
}
