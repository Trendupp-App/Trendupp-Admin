"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

// Import refactored sub-components
import CampaignDetailsTab from "@/components/admin/campaigns/CampaignDetailsTab";
import CampaignApplicationsTab from "@/components/admin/campaigns/CampaignApplicationsTab";
import CampaignDeliverablesTab from "@/components/admin/campaigns/CampaignDeliverablesTab";
import CampaignAnalyticsTab from "@/components/admin/campaigns/CampaignAnalyticsTab";
import CampaignTimelineTab from "@/components/admin/campaigns/CampaignTimelineTab";
import CampaignActionsTab from "@/components/admin/campaigns/CampaignActionsTab";
import CampaignAuditLogTab from "@/components/admin/campaigns/CampaignAuditLogTab";
import CampaignCreatorDrawer from "@/components/admin/campaigns/CampaignCreatorDrawer";
import AdminActionModal from "@/components/admin/campaigns/AdminActionModal";

type TabType =
  | "Campaign Details"
  | "Applications (47)"
  | "Deliverables"
  | "Analytics"
  | "Activity Timeline"
  | "Admin Actions"
  | "Audit Log";

interface CreatorDrawerData {
  name: string;
  handle: string;
  rating: string;
  location: string;
  status: string;
  initials: string;
}

export default function CampaignDetailsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("Campaign Details");
  const [selectedCreatorForDrawer, setSelectedCreatorForDrawer] =
    useState<CreatorDrawerData | null>(null);
  const [activeAdminAction, setActiveAdminAction] = useState<string | null>(
    null,
  );

  const handleConfirmAdminAction = (reason: string) => {
    setActiveAdminAction(null);
    alert(`Administrative action successfully recorded: "${reason}"`);
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 relative min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/campaigns"
            className="p-2 hover:bg-[#f4f3f6] rounded-xl text-[#7a7a9a] hover:text-[#1a1a2e] transition-colors shrink-0"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-[#1a1a2e]">
                Summer Style Collection 2025
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-[#fff1f2] text-[#e11d48] border border-[#ffe4e6] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#e11d48]" />
                Live
              </span>
            </div>
            <span className="text-[10px] text-[#9a99b0] font-medium mt-0.5">
              TRD-1001 &bull; Zara Africa &bull; Created Jun 1, 2026
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button className="h-9 px-4 border border-[#e8e6f0] text-xs font-bold text-[#5a5a7a] rounded-xl hover:bg-[#faf9fc] transition-colors cursor-pointer flex items-center gap-1.5">
            <Download size={13} /> Export
          </button>
          <button className="h-9 px-4 bg-brand-pink text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer flex items-center gap-1">
            Admin Actions <ChevronDown size={13} />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#e8e6f0]/40 overflow-x-auto shrink-0 scrollbar-none">
        {[
          "Campaign Details",
          "Applications (47)",
          "Deliverables",
          "Analytics",
          "Activity Timeline",
          "Admin Actions",
          "Audit Log",
        ].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as TabType)}
            className={cn(
              "px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap",
              activeTab === tab
                ? "border-brand-pink text-brand-pink font-bold"
                : "border-transparent text-[#9a99b0] hover:text-[#1a1a2e]",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 flex flex-col gap-6">
        {activeTab === "Campaign Details" && <CampaignDetailsTab />}
        {activeTab === "Applications (47)" && <CampaignApplicationsTab />}
        {activeTab === "Deliverables" && (
          <CampaignDeliverablesTab
            onViewDetails={setSelectedCreatorForDrawer}
          />
        )}
        {activeTab === "Analytics" && <CampaignAnalyticsTab />}
        {activeTab === "Activity Timeline" && <CampaignTimelineTab />}
        {activeTab === "Admin Actions" && (
          <CampaignActionsTab onSelectAction={setActiveAdminAction} />
        )}
        {activeTab === "Audit Log" && <CampaignAuditLogTab />}
      </div>

      {/* Creator Details Drawer */}
      <CampaignCreatorDrawer
        creator={selectedCreatorForDrawer}
        onClose={() => setSelectedCreatorForDrawer(null)}
      />

      {/* Admin Action Confirmation Modal */}
      <AdminActionModal
        action={activeAdminAction}
        onClose={() => setActiveAdminAction(null)}
        onConfirm={handleConfirmAdminAction}
      />
    </div>
  );
}
