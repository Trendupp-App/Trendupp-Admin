"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Download,
  ChevronDown,
  Image as ImageIcon,
  AlertTriangle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useCampaign } from "@/hooks/useCampaign";

// Import refactored sub-components
import CampaignDetailsTab from "@/components/admin/campaigns/CampaignDetailsTab";
import CampaignApplicationsTab from "@/components/admin/campaigns/CampaignApplicationsTab";
import SelectedCreatorsTab from "@/components/admin/campaigns/SelectedCreatorsTab";
import CampaignDeliverablesTab from "@/components/admin/campaigns/CampaignDeliverablesTab";
import CampaignAnalyticsTab from "@/components/admin/campaigns/CampaignAnalyticsTab";
import CampaignTimelineTab from "@/components/admin/campaigns/CampaignTimelineTab";
import CampaignActionsTab from "@/components/admin/campaigns/CampaignActionsTab";
import CampaignAuditLogTab from "@/components/admin/campaigns/CampaignAuditLogTab";
import CampaignCreatorDrawer, {
  type CreatorDrawerData,
} from "@/components/admin/campaigns/CampaignCreatorDrawer";
import { Portal } from "@/components/ui/portal";

type TabType =
  | "Campaign Details"
  | "Applications"
  | "Selected Creators"
  | "Deliverables"
  | "Published content"
  | "Analytics"
  | "Activity Timeline"
  | "Admin Actions"
  | "Admin Action"
  | "Audit Log";

const MOCK_SOCIAL_CAMPAIGNS = [
  {
    id: "d1",
    title: "Jollof Cook-off Promo",
    niche: "Food & Lifestyle",
    status: "Draft",
  },
  {
    id: "d2",
    title: "Summer Style Collection",
    niche: "Lifestyle",
    status: "Draft",
  },
  {
    id: "d3",
    title: "New Year Skincare Push",
    niche: "Beauty",
    status: "Draft",
  },
  {
    id: "l1",
    title: "Clean Nigeria Initiative",
    niche: "Trendupp",
    status: "Live",
  },
  {
    id: "l2",
    title: "Clean Nigeria Initiative",
    niche: "Trendupp",
    status: "Live",
  },
  {
    id: "l3",
    title: "Clean Nigeria Initiative",
    niche: "Trendupp",
    status: "Live",
  },
  {
    id: "c1",
    title: "Easter Egg Hunt Special",
    niche: "Community",
    status: "Completed",
  },
  {
    id: "c2",
    title: "Christmas Charity Drive 2025",
    niche: "Charity",
    status: "Completed",
  },
  {
    id: "c3",
    title: "Back to School Giveaway",
    niche: "Education",
    status: "Completed",
  },
];

const getSocialCampaign = (id: string) => {
  const social = MOCK_SOCIAL_CAMPAIGNS.find((c) => c.id === id);
  if (social) return social;
  if (id.startsWith("a-")) {
    const idx = parseInt(id.replace("a-", ""), 10);
    return {
      id,
      title: `Active Brand Push Campaign ${isNaN(idx) ? 1 : idx + 1}`,
      niche: idx % 2 === 0 ? "Retail" : "Healthcare",
      status: "Active",
    };
  }
  return null;
};

const INITIAL_MOCK_CREATORS: CreatorDrawerData[] = [
  {
    id: "AO",
    name: "Adaeze Obi",
    handle: "@adaeze_eats",
    rating: "4.9",
    location: "Lagos, Nigeria",
    role: "Impact Advocate",
    initials: "AO",
    pitch:
      "I'll create a warm iftar unboxing video featuring KFC's new sharing bucket — opening it with family just as the adhan sounds.",
    contentIdea:
      "A 60-second reel showcasing the collection in everyday Lagos street style, blending high fashion with local culture and authentic storytelling.",
    platforms: "Instagram, TikTok",
    questionComment:
      "leaned into the 'summer breeze' aesthetic as requested in the brief. The second option is my personal favorite.",
  },
  {
    id: "CN",
    name: "Chisom Nwosu",
    handle: "@chisom.ng",
    rating: "4.9",
    location: "Abuja, Nigeria",
    role: "Impact Advocate",
    initials: "CN",
    pitch:
      "A 'day in my Ramadan' vlog that features KFC as the iftar meal of choice — authentic, personal, low-key.",
    contentIdea:
      "Vlog format showing my daily routine with a subtle integration of the summer fest collection outfits.",
    platforms: "Instagram",
    questionComment:
      "Can we get access to high-res brand logos for the video overlay?",
  },
  {
    id: "EC",
    name: "Emeka Chukwu",
    handle: "@chef_emeka",
    rating: "4.9",
    location: "Enugu, Nigeria",
    role: "Impact Advocate",
    initials: "EC",
    pitch:
      "I'll create a warm iftar unboxing video featuring KFC's new sharing bucket — opening it with family just as the adhan sounds.",
    contentIdea:
      "Cooking session styling while wearing the new collection and reviewing the fabric quality.",
    platforms: "Instagram, YouTube",
    questionComment:
      "Are there any specific colors we should focus on in the video styling?",
  },
  {
    id: "FG",
    name: "Fatima Garba",
    handle: "@fatima.foods",
    rating: "4.9",
    location: "Kano, Nigeria",
    role: "Impact Advocate",
    initials: "FG",
    pitch:
      "I'll create a warm iftar unboxing video featuring KFC's new sharing bucket — opening it with family just as the adhan sounds.",
    contentIdea:
      "A transition video matching the clothing colors to the food prep colors.",
    platforms: "TikTok",
    questionComment:
      "Would love to know the campaign timeline guidelines for content post approval.",
  },
];

export default function CampaignDetailsPage() {
  const params = useParams();
  const id = (params?.id as string) || "";
  const socialCampaign = getSocialCampaign(id);
  const isSocial = !!socialCampaign;
  const { data: campaign } = useCampaign(!isSocial && id ? id : null);

  const [activeTab, setActiveTab] = useState<TabType>("Campaign Details");
  const [selectedCreatorForDrawer, setSelectedCreatorForDrawer] =
    useState<CreatorDrawerData | null>(null);

  // Social Flow States
  const [creatorsList, setCreatorsList] = useState<CreatorDrawerData[]>(
    INITIAL_MOCK_CREATORS,
  );
  const [selectedCreatorIds, setSelectedCreatorIds] = useState<string[]>([]);
  const [confirmedCreatorIds, setConfirmedCreatorIds] = useState<string[]>([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deliverableStatus, setDeliverableStatus] = useState<
    "Awaiting" | "Approved"
  >("Awaiting");

  const handleToggleSelectCreator = (creatorId: string) => {
    setSelectedCreatorIds((prev) =>
      prev.includes(creatorId)
        ? prev.filter((cid) => cid !== creatorId)
        : [...prev, creatorId],
    );
  };

  const handleRejectCreator = (creatorId: string) => {
    setSelectedCreatorIds((prev) => prev.filter((cid) => cid !== creatorId));
    setConfirmedCreatorIds((prev) => prev.filter((cid) => cid !== creatorId));
  };

  const handleApproveSelections = () => {
    setConfirmedCreatorIds((prev) => [
      ...new Set([...prev, ...selectedCreatorIds]),
    ]);
    setSelectedCreatorIds([]);
    setShowConfirmModal(false);
  };

  const handleDrawerReply = (creatorId: string, replyText: string) => {
    setCreatorsList((prev) =>
      prev.map((c) =>
        c.id === creatorId
          ? {
              ...c,
              isResponded: true,
              responseMessage: replyText,
            }
          : c,
      ),
    );
    if (selectedCreatorForDrawer && selectedCreatorForDrawer.id === creatorId) {
      setSelectedCreatorForDrawer((prev) =>
        prev
          ? {
              ...prev,
              isResponded: true,
              responseMessage: replyText,
            }
          : null,
      );
    }
  };

  const applicationsCount = isSocial
    ? 47
    : (campaign?.applicationsCount?.total ??
      campaign?.applications?.length ??
      0);

  const tabs: { key: TabType; label: string }[] = isSocial
    ? [
        { key: "Campaign Details", label: "Campaign Details" },
        {
          key: "Applications",
          label: `Applications (${applicationsCount})`,
        },
        { key: "Selected Creators", label: "Selected Creators" },
        { key: "Deliverables", label: "Deliverables" },
        { key: "Published content", label: "Published content" },
        { key: "Analytics", label: "Analytics" },
        { key: "Admin Action", label: "Admin Action" },
      ]
    : [
        { key: "Campaign Details", label: "Campaign Details" },
        {
          key: "Applications",
          label: `Applications (${applicationsCount})`,
        },
        { key: "Deliverables", label: "Deliverables" },
        { key: "Analytics", label: "Analytics" },
        { key: "Activity Timeline", label: "Activity Timeline" },
        { key: "Admin Actions", label: "Admin Actions" },
        { key: "Audit Log", label: "Audit Log" },
      ];

  const STATUS_LABELS: Record<string, string> = {
    draft: "Draft",
    submitted: "Submitted",
    live: "Live",
    active: "Active",
    completed: "Completed",
  };
  const brandName = campaign?.brand
    ? `${campaign.brand.firstName ?? ""} ${campaign.brand.lastName ?? ""}`.trim()
    : "";
  const formatHeaderDate = (dateStr?: string | null) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const title = socialCampaign
    ? socialCampaign.title
    : (campaign?.title ?? "Campaign");
  const status = socialCampaign
    ? socialCampaign.status
    : campaign
      ? (STATUS_LABELS[campaign.status] ?? campaign.status)
      : "Draft";
  const niche = socialCampaign
    ? socialCampaign.niche
    : brandName || campaign?.creatorNiche?.name || "";
  const subtitle = socialCampaign
    ? `TRD-1001 • ${niche} • Created Jun 1, 2026`
    : [
        niche,
        campaign?.createdAt &&
          `Created ${formatHeaderDate(campaign.createdAt)}`,
      ]
        .filter(Boolean)
        .join(" • ");

  // Get selected creator names for warning modal
  const selectedCreatorNames = creatorsList
    .filter((c) => selectedCreatorIds.includes(c.id))
    .map((c) => c.name);

  let confirmText = "";
  if (selectedCreatorNames.length === 1) {
    confirmText = selectedCreatorNames[0];
  } else if (selectedCreatorNames.length === 2) {
    confirmText = `${selectedCreatorNames[0]} and ${selectedCreatorNames[1]}`;
  } else if (selectedCreatorNames.length > 2) {
    const last = selectedCreatorNames[selectedCreatorNames.length - 1];
    const rest = selectedCreatorNames.slice(0, -1).join(", ");
    confirmText = `${rest} and ${last}`;
  }

  const handleOpenDrawer = (creatorId: string) => {
    const found = creatorsList.find((c) => c.id === creatorId);
    if (found) {
      setSelectedCreatorForDrawer(found);
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 relative min-h-screen animate-fade-in-up">
      {/* Header */}
      <div className="flex justify-between items-start gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={isSocial ? "/admin/campaigns/social" : "/admin/campaigns"}
            className="p-2 hover:bg-[#f4f3f6] rounded-xl text-[#7a7a9a] hover:text-[#1a1a2e] transition-colors shrink-0"
          >
            <ArrowLeft size={16} />
          </Link>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base font-bold text-[#1a1a2e]">{title}</h1>
              <span
                className={cn(
                  "px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1 border",
                  status === "Live"
                    ? "bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]"
                    : status === "Active" || status === "In Progress"
                      ? "bg-[#eff6ff] text-[#2563eb] border-[#dbeafe]"
                      : "bg-[#fff1f2] text-[#e11d48] border-[#ffe4e6]",
                )}
              >
                <span
                  className={cn(
                    "w-1.5 h-1.5 rounded-full",
                    status === "Live"
                      ? "bg-[#16a34a]"
                      : status === "Active" || status === "In Progress"
                        ? "bg-[#2563eb]"
                        : "bg-[#e11d48]",
                  )}
                />
                {status === "Active" ? "In Progress" : status}
              </span>
            </div>
            <span className="text-[10px] text-[#9a99b0] font-medium mt-0.5">
              {subtitle}
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
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={cn(
              "px-4 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap",
              activeTab === key
                ? "border-brand-pink text-brand-pink font-bold"
                : "border-transparent text-[#9a99b0] hover:text-[#1a1a2e]",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="flex-1 flex flex-col gap-6">
        {activeTab === "Campaign Details" && (
          <CampaignDetailsTab isSocial={isSocial} campaignId={id} />
        )}
        {activeTab === "Applications" && (
          <CampaignApplicationsTab
            isSocial={isSocial}
            campaignId={id}
            currency={campaign?.currency}
            creators={creatorsList}
            selectedIds={selectedCreatorIds}
            confirmedIds={confirmedCreatorIds}
            onToggleSelect={handleToggleSelectCreator}
            onReject={handleRejectCreator}
            onConfirm={() => setShowConfirmModal(true)}
            onViewDetails={handleOpenDrawer}
            onViewApplicationDetails={setSelectedCreatorForDrawer}
          />
        )}
        {activeTab === "Selected Creators" && (
          <SelectedCreatorsTab
            confirmedIds={confirmedCreatorIds}
            creators={creatorsList}
            onViewDetails={handleOpenDrawer}
            onReject={handleRejectCreator}
          />
        )}
        {activeTab === "Deliverables" && (
          <CampaignDeliverablesTab
            isSocial={isSocial}
            campaignId={id}
            deliverableStatus={deliverableStatus}
            onApprove={() => setDeliverableStatus("Approved")}
            onRequestRevision={() => setDeliverableStatus("Awaiting")}
            onViewDetails={setSelectedCreatorForDrawer}
          />
        )}
        {activeTab === "Published content" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-4 flex flex-col gap-3"
              >
                <div className="h-48 bg-slate-100 rounded-2xl flex items-center justify-center text-[#9a99b0]">
                  <ImageIcon size={24} />
                </div>
                <span className="text-[10px] font-bold text-[#5a5a7a]">
                  Instagram Reel
                </span>
              </div>
            ))}
          </div>
        )}
        {activeTab === "Analytics" && <CampaignAnalyticsTab />}
        {activeTab === "Activity Timeline" && (
          <CampaignTimelineTab campaignId={id} />
        )}
        {(activeTab === "Admin Actions" || activeTab === "Admin Action") && (
          <CampaignActionsTab
            campaignId={id}
            campaignStatus={campaign?.status}
          />
        )}
        {activeTab === "Audit Log" && <CampaignAuditLogTab />}
      </div>

      {/* Creator Details Drawer */}
      <CampaignCreatorDrawer
        creator={selectedCreatorForDrawer}
        onClose={() => setSelectedCreatorForDrawer(null)}
        isSocial={isSocial}
        selectedIds={selectedCreatorIds}
        confirmedIds={confirmedCreatorIds}
        onToggleSelect={handleToggleSelectCreator}
        onReject={handleRejectCreator}
        onSendReply={(replyText) => {
          if (selectedCreatorForDrawer) {
            handleDrawerReply(selectedCreatorForDrawer.id, replyText);
          }
        }}
      />

      {/* Selections Confirmation Modal */}
      {showConfirmModal && (
        <Portal>
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setShowConfirmModal(false)}
            />
            <div className="relative z-10 w-full max-w-[400px] bg-white rounded-3xl p-6 shadow-2xl flex flex-col items-center gap-4 text-center">
              <div className="w-12 h-12 rounded-full bg-[#fef3c7] flex items-center justify-center text-[#d97706]">
                <AlertTriangle size={24} />
              </div>
              <p className="text-sm font-bold text-[#1a1a2e] leading-snug">
                Are you sure you want to accept {confirmText}?
              </p>
              <div className="flex gap-3 w-full mt-2">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 h-11 bg-[#f4f3f6] hover:bg-[#e8e6f0] text-xs font-bold text-[#5a5a7a] rounded-xl transition-all cursor-pointer"
                >
                  No, go back
                </button>
                <button
                  onClick={handleApproveSelections}
                  className="flex-1 h-11 bg-brand-pink text-white hover:opacity-90 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  Yes, approve
                </button>
              </div>
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}
