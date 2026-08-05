"use client";

import { useState } from "react";
import { TrendingUp, ShieldCheck, Wallet, CheckCircle2 } from "lucide-react";
import EscrowOverviewTab from "@/components/admin/escrow/EscrowOverviewTab";
import EscrowBalancesTab from "@/components/admin/escrow/EscrowBalancesTab";
import EscrowPayoutsTab from "@/components/admin/escrow/EscrowPayoutsTab";
import AccessDenied from "@/components/admin/AccessDenied";
import { usePermission } from "@/hooks/usePermission";
import { useEscrowOverview } from "@/hooks/useAdminEscrow";
import type { EscrowSummaryDto } from "@/types/adminEscrow";

type EscrowTab = "overview" | "escrow" | "payouts";

const TABS: { id: EscrowTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "escrow", label: "Escrow" },
  { id: "payouts", label: "Payout" },
];

function fmt(n?: number) {
  if (!n && n !== 0) return "₦—";
  if (n >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `₦${(n / 1_000).toFixed(1)}K`;
  return `₦${n.toLocaleString()}`;
}

export function TopEscrowSummaryCards({
  summary,
}: {
  summary?: EscrowSummaryDto;
}) {
  const cards = [
    {
      label: "Total Advertisers Spend on Campaign",
      value: fmt(summary?.totalAdvertisersSpend),
      icon: TrendingUp,
      iconBg: "bg-rose-100/70 text-[#e91e8c]",
    },
    {
      label: "Total Agency Commission",
      value: fmt(summary?.totalAgencyCommission),
      icon: ShieldCheck,
      iconBg: "bg-blue-100/70 text-blue-600",
    },
    {
      label: "Total Creator payout",
      value: fmt(summary?.totalCreatorPayout),
      icon: Wallet,
      iconBg: "bg-amber-100/70 text-amber-600",
    },
    {
      label: "Total Escrow Balance",
      value: fmt(summary?.totalEscrowBalance),
      icon: CheckCircle2,
      iconBg: "bg-emerald-100/70 text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className="bg-white border border-[#e8e6f0]/70 rounded-2xl p-4 flex items-center gap-3.5 shadow-xs"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${card.iconBg}`}
            >
              <Icon size={18} />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-lg md:text-xl font-extrabold text-[#1a1a2e] truncate">
                {card.value}
              </span>
              <span className="text-xs font-semibold text-[#7a7a9a] truncate">
                {card.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function EscrowPage() {
  const canAccess = usePermission("page.finance");
  const [activeTab, setActiveTab] = useState<EscrowTab>("payouts");

  const { data: overviewData } = useEscrowOverview();
  const summary = overviewData?.summary;

  if (!canAccess) return <AccessDenied />;

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 animate-fade-in-up text-left">
      {/* 4 Top Summary KPI Cards */}
      <TopEscrowSummaryCards summary={summary} />

      {/* Main Tab Pills Bar */}
      <div className="bg-white border border-[#e8e6f0]/60 rounded-2xl p-1.5 inline-flex items-center gap-1 shadow-xs w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === tab.id
                ? "bg-[#e91e8c] text-white shadow-xs"
                : "text-[#7a7a9a] hover:text-[#1a1a2e]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Page Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold text-[#1a1a2e]">
          {activeTab === "payouts"
            ? "Payouts"
            : activeTab === "escrow"
              ? "Escrow Balances"
              : "Escrow Overview"}
        </h1>
        <p className="text-xs text-[#7a7a9a] mt-1 font-medium">
          {activeTab === "payouts"
            ? "View and monitor all creator payouts and brand refunds."
            : activeTab === "escrow"
              ? "Monitor and manage campaign escrow balances."
              : "Overview of platform escrow metrics and analytics."}
        </p>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "overview" && <EscrowOverviewTab />}
        {activeTab === "escrow" && <EscrowBalancesTab />}
        {activeTab === "payouts" && <EscrowPayoutsTab summary={summary} />}
      </div>
    </div>
  );
}
