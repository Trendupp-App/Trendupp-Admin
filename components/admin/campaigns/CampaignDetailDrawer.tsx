"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ExternalLink, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { Portal } from "@/components/ui/portal";
import { DrawerSkeleton } from "@/components/admin/DrawerSkeleton";
import { useCampaign } from "@/hooks/useCampaign";
import { AdminStatusBadge } from "../AdminStatusBadge";

// Sub-components
import CampaignDetailsTab from "./CampaignDetailsTab";
import CampaignApplicationsTab from "./CampaignApplicationsTab";
import SelectedCreatorsTab from "./SelectedCreatorsTab";
import CampaignDeliverablesTab from "./CampaignDeliverablesTab";
import CampaignAnalyticsTab from "./CampaignAnalyticsTab";
import CampaignTimelineTab from "./CampaignTimelineTab";
import CampaignActionsTab from "./CampaignActionsTab";
import CampaignAuditLogTab from "./CampaignAuditLogTab";
import CampaignCreatorDrawer, {
  type CreatorDrawerData,
} from "./CampaignCreatorDrawer";

interface CampaignDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string | null;
}

type TabType =
  | "Campaign Details"
  | "Applications"
  | "Selected Creators"
  | "Deliverables"
  | "Analytics"
  | "Activity Timeline"
  | "Admin Actions"
  | "Audit Log";

const TABS: TabType[] = [
  "Campaign Details",
  "Applications",
  "Selected Creators",
  "Deliverables",
  "Analytics",
  "Activity Timeline",
  "Admin Actions",
  "Audit Log",
];

export default function CampaignDetailDrawer({
  isOpen,
  onClose,
  campaignId,
}: CampaignDetailDrawerProps) {
  const [activeTab, setActiveTab] = useState<TabType>("Campaign Details");
  const [selectedCreatorForDrawer, setSelectedCreatorForDrawer] =
    useState<CreatorDrawerData | null>(null);

  const { data: campaignData, isLoading } = useCampaign(
    isOpen ? campaignId : null,
  );

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const campaign = campaignData || null;
  const rawObj = (campaign || {}) as Record<string, unknown>;

  const getBrandDisplayName = () => {
    if (!campaign?.brand) return "—";
    const b = campaign.brand as Record<string, unknown>;
    const brandName =
      (b.name as string) ||
      (b.companyName as string) ||
      (b.brandName as string);
    if (brandName) return brandName;
    const nameStr = `${b.firstName || ""} ${b.lastName || ""}`.trim();
    return nameStr || "—";
  };

  const getApplicationsCount = () => {
    if (!campaign) return 0;
    const count = rawObj.applicationsCount;
    if (typeof count === "number") return count;
    if (count && typeof count === "object" && "total" in count) {
      return (count as { total: number }).total || 0;
    }
    return 0;
  };

  const campaignBudget =
    (rawObj.budget as number) ?? campaign?.totalBudget ?? 0;
  const campaignDescription =
    (rawObj.description as string) ??
    campaign?.campaignBrief ??
    "No description provided.";
  const campaignEscrow =
    (rawObj.escrowStatus as string) ?? campaign?.paymentStatus ?? "";

  return (
    <Portal>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
          onClick={onClose}
        />

        {/* Drawer Panel */}
        <div className="relative w-full max-w-4xl h-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
          {/* Top Bar Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8e6f0]/60 bg-[#faf9fc]">
            <div className="flex items-center gap-3 min-w-0">
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl hover:bg-[#e8e6f0]/50 text-[#7a7a9a] hover:text-[#1a1a2e] transition-colors cursor-pointer"
                aria-label="Close drawer"
              >
                <X size={18} />
              </button>
              <div className="min-w-0">
                <h2 className="text-base font-bold text-[#1a1a2e] truncate">
                  {campaign?.title || "Campaign Details"}
                </h2>
                <p className="text-xs font-semibold text-[#7a7a9a] truncate">
                  Brand: {getBrandDisplayName()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {campaignId && (
                <Link
                  href={`/admin/campaigns/${campaignId}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#e8e6f0] text-xs font-bold text-[#1a1a2e] hover:bg-[#faf9fc] shadow-2xs transition-all"
                  title="Open full page view"
                >
                  <span>Full View</span>
                  <ExternalLink size={12} className="text-brand-pink" />
                </Link>
              )}
            </div>
          </div>

          {/* Body Content */}
          {isLoading ? (
            <div className="p-6">
              <DrawerSkeleton />
            </div>
          ) : !campaign ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-[#7a7a9a]">
              <Layers size={36} className="text-[#9a99b0] mb-2" />
              <p className="font-bold text-sm text-[#1a1a2e]">
                Campaign not found
              </p>
              <p className="text-xs text-[#9a99b0]">
                The requested campaign details could not be loaded.
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
              {/* Campaign Highlight Summary Header */}
              <div className="p-6 border-b border-[#e8e6f0]/60 bg-gradient-to-r from-rose-50/20 via-white to-purple-50/20">
                <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
                  <div>
                    <h1 className="text-lg font-bold text-[#1a1a2e]">
                      {campaign.title}
                    </h1>
                    <p className="text-xs text-[#7a7a9a] mt-0.5">
                      {campaignDescription}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <AdminStatusBadge status={campaign.status} />
                    {campaignEscrow && (
                      <AdminStatusBadge status={campaignEscrow} />
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#e8e6f0]/40 text-xs">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-[#9a99b0]">
                      Budget
                    </span>
                    <span className="font-bold text-[#1a1a2e] text-sm">
                      ₦{campaignBudget.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-[#9a99b0]">
                      Applications
                    </span>
                    <span className="font-bold text-[#1a1a2e] text-sm">
                      {getApplicationsCount()}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-[#9a99b0]">
                      Created Date
                    </span>
                    <span className="font-semibold text-[#5a5a7a]">
                      {campaign.createdAt
                        ? new Date(campaign.createdAt).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase text-[#9a99b0]">
                      End Date
                    </span>
                    <span className="font-semibold text-[#5a5a7a]">
                      {rawObj.endDate
                        ? new Date(
                            rawObj.endDate as string,
                          ).toLocaleDateString()
                        : "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs Header */}
              <div className="flex items-center gap-2 px-6 pt-3 border-b border-[#e8e6f0]/60 bg-white overflow-x-auto no-scrollbar shrink-0">
                {TABS.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "pb-2.5 px-3 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap shrink-0",
                      activeTab === tab
                        ? "border-brand-pink text-brand-pink"
                        : "border-transparent text-[#7a7a9a] hover:text-[#1a1a2e]",
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Tab Content View */}
              <div className="p-6 flex-1 bg-[#faf9fc]/50">
                {activeTab === "Campaign Details" && (
                  <CampaignDetailsTab campaignId={campaign.id} />
                )}
                {activeTab === "Applications" && (
                  <CampaignApplicationsTab
                    campaignId={campaign.id}
                    currency={campaign.currency}
                    onViewApplicationDetails={setSelectedCreatorForDrawer}
                  />
                )}
                {activeTab === "Selected Creators" && (
                  <SelectedCreatorsTab
                    campaignId={campaign.id}
                    currency={campaign.currency}
                    onViewApplicationDetails={setSelectedCreatorForDrawer}
                  />
                )}
                {activeTab === "Deliverables" && (
                  <CampaignDeliverablesTab
                    campaignId={campaign.id}
                    onViewDetails={(creatorData) =>
                      setSelectedCreatorForDrawer(creatorData)
                    }
                  />
                )}
                {activeTab === "Analytics" && (
                  <CampaignAnalyticsTab campaignId={campaign.id} />
                )}
                {activeTab === "Activity Timeline" && (
                  <CampaignTimelineTab campaignId={campaign.id} />
                )}
                {activeTab === "Admin Actions" && (
                  <CampaignActionsTab
                    campaignId={campaign.id}
                    campaignStatus={campaign.status}
                  />
                )}
                {activeTab === "Audit Log" && (
                  <CampaignAuditLogTab campaignId={campaign.id} />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <CampaignCreatorDrawer
        creator={selectedCreatorForDrawer}
        onClose={() => setSelectedCreatorForDrawer(null)}
      />
    </Portal>
  );
}
