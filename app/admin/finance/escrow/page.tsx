"use client";

import { useState } from "react";
import EscrowOverviewTab from "@/components/admin/escrow/EscrowOverviewTab";
import EscrowBalancesTab from "@/components/admin/escrow/EscrowBalancesTab";
import EscrowPayoutsTab from "@/components/admin/escrow/EscrowPayoutsTab";

type EscrowTab = "overview" | "escrow" | "payouts";

const TABS: { id: EscrowTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "escrow", label: "Escrow" },
  { id: "payouts", label: "Payouts" },
];

export default function EscrowPage() {
  const [activeTab, setActiveTab] = useState<EscrowTab>("overview");

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 animate-fade-in-up text-left">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a2e]">Escrow</h1>
          <p className="text-xs text-[#7a7a9a] mt-0.5">
            Monitor and manage campaign escrow funds, payouts, and refunds
          </p>
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-1 border-b border-[#e8e6f0]">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-semibold border-b-2 transition-colors -mb-px ${
              activeTab === tab.id
                ? "border-[#e91e8c] text-[#e91e8c]"
                : "border-transparent text-[#7a7a9a] hover:text-[#1a1a2e]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === "overview" && <EscrowOverviewTab />}
        {activeTab === "escrow" && <EscrowBalancesTab />}
        {activeTab === "payouts" && <EscrowPayoutsTab />}
      </div>
    </div>
  );
}
