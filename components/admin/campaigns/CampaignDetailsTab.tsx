"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCampaign } from "@/hooks/useCampaign";
import type { Campaign } from "@/types/campaign";

interface CampaignDetailsTabProps {
  isSocial?: boolean;
  campaignId?: string;
  campaignName?: string;
  nicheName?: string;
}

interface CampaignDetailsData {
  title: string;
  niche: string;
  tokens: string;
  id: string;
  goal: string;
  creatorTiers: string;
  platforms: string;
  escrowStatus: string;
  dateCreated: string;
  applicationClosing: string;
  brief: string;
  deliverables: string[];
  doItems: string[];
  dontItems: string[];
  directions: string[];
  success: string;
  usageRights: string;
}

const MOCK_CAMPAIGN_DETAILS: Record<
  string,
  Omit<
    CampaignDetailsData,
    | "goal"
    | "creatorTiers"
    | "platforms"
    | "escrowStatus"
    | "dateCreated"
    | "applicationClosing"
  >
> = {
  l1: {
    title: "Clean Nigeria Initiative",
    niche: "Trendupp",
    tokens: "100 Tokens",
    id: "TRD-1001",
    brief:
      "Zara Africa is launching a campaign to connect with authentic Nigerian creators and build brand awareness across key demographics.",
    deliverables: [
      "1 &times; Platform Reel (60 seconds)",
      "3 &times; Stories with product tag",
      "Caption in English or Pidgin",
    ],
    doItems: [
      "Tag brand account and use campaign hashtag",
      "Show product in natural settings",
      "Include verbal CTA",
    ],
    dontItems: ["No competitor brands visible", "No misleading health claims"],
    directions: [
      "Dramatic before and after revealing the collection's impact.",
      "Incorporate the hair styling seamlessly into your beauty routine.",
      "Step-by-step guide to achieving an effortless, elegant look.",
    ],
    success:
      "We are looking for content that feels authentic, relatable, visually appealing, and inspires women to explore the new SWW Hair Collection. We are excited to collaborate with you and can't wait to see your creativity bring the SWW Hair Collection to life.",
    usageRights:
      "By participating in this campaign, creators grant Zara Africa permission to repost and use campaign content across its digital platforms for marketing and promotional purposes.",
  },
};

const MOCK_DEFAULTS = {
  goal: "Create Content",
  creatorTiers: "Micro, Macro",
  platforms: "Instagram",
  escrowStatus: "Funded",
  dateCreated: "Jun 1, 2026",
  applicationClosing: "Jun 3, 2026",
};

const getDetails = (id: string, _isSocial: boolean): CampaignDetailsData => {
  const explicit = MOCK_CAMPAIGN_DETAILS[id];
  if (explicit) return { ...explicit, ...MOCK_DEFAULTS };

  if (id.startsWith("a-")) {
    const idx = parseInt(id.replace("a-", ""), 10);
    const titleVal = `Active Brand Push Campaign ${isNaN(idx) ? 1 : idx + 1}`;
    const nicheVal = idx % 2 === 0 ? "Retail" : "Healthcare";
    return {
      title: titleVal,
      niche: nicheVal,
      tokens: "24,500 Tokens",
      id: `TRD-${id.toUpperCase()}`,
      ...MOCK_DEFAULTS,
      brief:
        "A local retail campaign to push brand visibility across micro creators.",
      deliverables: [
        "1 &times; Platform Reel (30 seconds)",
        "2 &times; Stories with product tag",
      ],
      doItems: [
        "Tag brand account and use campaign hashtag",
        "Show product in natural settings",
      ],
      dontItems: ["No competitor brands visible"],
      directions: ["Film in warm, golden-hour lighting"],
      success:
        "High-quality engagements and organic reach among the target demographics.",
      usageRights:
        "Creators grant permission to reuse the content in paid advertising for 30 days.",
    };
  }

  // Fallback for Completed c1, c2, c3
  if (id.startsWith("c")) {
    const titleVal =
      id === "c1"
        ? "Easter Egg Hunt Special"
        : id === "c2"
          ? "Christmas Charity Drive 2025"
          : "Back to School Giveaway";
    const nicheVal =
      id === "c1" ? "Community" : id === "c2" ? "Charity" : "Education";
    const tokenVal =
      id === "c1"
        ? "85,000 Tokens"
        : id === "c2"
          ? "150,000 Tokens"
          : "98,000 Tokens";
    return {
      title: titleVal,
      niche: nicheVal,
      tokens: tokenVal,
      id: `TRD-${id.toUpperCase()}`,
      ...MOCK_DEFAULTS,
      brief:
        "A community social impact initiative to distribute tokens and drive student outreach.",
      deliverables: [
        "1 &times; Post sharing event details",
        "1 &times; Story with event hashtag",
      ],
      doItems: [
        "Ensure clear event details are visible",
        "Use official hashtags",
      ],
      dontItems: ["No negative commentary", "No competitor logos"],
      directions: [
        "Capture the joy of families and kids participating in the program.",
      ],
      success: "High event registration numbers and positive social sentiment.",
      usageRights: "Permission to repost creator content on official channels.",
    };
  }

  // Fallback for drafts
  if (id.startsWith("d")) {
    const titleVal =
      id === "d1"
        ? "Jollof Cook-off Promo"
        : id === "d2"
          ? "Summer Style Collection"
          : "New Year Skincare Push";
    const nicheVal =
      id === "d1" ? "Food & Lifestyle" : id === "d2" ? "Lifestyle" : "Beauty";
    return {
      title: titleVal,
      niche: nicheVal,
      tokens: "700,000 Tokens",
      id: `TRD-${id.toUpperCase()}`,
      ...MOCK_DEFAULTS,
      brief: "Draft campaign details. Complete setup to publish.",
      deliverables: ["1 &times; Video", "2 &times; Stories"],
      doItems: ["Follow setup instructions"],
      dontItems: ["No incomplete sections"],
      directions: ["Incorporate brand identity guidelines."],
      success: "Successfully publish and launch campaign.",
      usageRights: "Standard creator license agreements.",
    };
  }

  // If l2/l3 are accessed, return l1 copy but with correct title/id
  if (id.startsWith("l")) {
    return {
      ...MOCK_CAMPAIGN_DETAILS.l1,
      ...MOCK_DEFAULTS,
      id: `TRD-${id.toUpperCase()}`,
    };
  }

  return {
    title: "Campaign",
    niche: "",
    tokens: "—",
    id,
    ...MOCK_DEFAULTS,
    brief: "",
    deliverables: [],
    doItems: [],
    dontItems: [],
    directions: [],
    success: "",
    usageRights: "",
  };
};

const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const mapCampaignToDetails = (
  campaign: Campaign | undefined,
): CampaignDetailsData => {
  if (!campaign) {
    return {
      title: "",
      niche: "",
      tokens: "—",
      id: "",
      goal: "—",
      creatorTiers: "—",
      platforms: "—",
      escrowStatus: "—",
      dateCreated: "—",
      applicationClosing: "—",
      brief: "",
      deliverables: [],
      doItems: [],
      dontItems: [],
      directions: [],
      success: "",
      usageRights: "",
    };
  }

  const brandName = campaign.brand
    ? `${campaign.brand.firstName ?? ""} ${campaign.brand.lastName ?? ""}`.trim()
    : "";
  const currencySymbol = campaign.currency === "USD" ? "$" : "₦";
  const applicationWindowEnd =
    campaign.timeline?.stage1_application_window?.endedDate;

  return {
    title: campaign.title,
    niche: campaign.creatorNiche?.name || brandName || "—",
    tokens: `${currencySymbol}${(campaign.totalBudget ?? 0).toLocaleString()}`,
    id: campaign.id,
    goal: campaign.goal || "—",
    creatorTiers: campaign.creatorCategory?.name || "—",
    platforms:
      campaign.preferredPlatforms?.map((p) => p.name).join(", ") || "—",
    escrowStatus: campaign.paymentStatus === "paid" ? "Funded" : "Not Funded",
    dateCreated: formatDate(campaign.createdAt),
    applicationClosing: applicationWindowEnd
      ? formatDate(applicationWindowEnd)
      : "—",
    brief: campaign.campaignBrief || "No campaign brief provided.",
    deliverables: campaign.deliverables?.length
      ? campaign.deliverables
      : ["No deliverables specified."],
    doItems: campaign.contentGuidelines?.dos ?? [],
    dontItems: campaign.contentGuidelines?.donts ?? [],
    directions: campaign.contentDirection?.length
      ? campaign.contentDirection
      : ["No content direction specified."],
    success: campaign.successLooksLike || "Not specified.",
    usageRights: campaign.usageRights || "Not specified.",
  };
};

export default function CampaignDetailsTab({
  isSocial,
  campaignId = "",
}: CampaignDetailsTabProps) {
  const { data: campaign, isLoading } = useCampaign(
    !isSocial && campaignId ? campaignId : null,
  );

  const details = isSocial
    ? getDetails(campaignId, true)
    : mapCampaignToDetails(campaign);

  if (!isSocial && isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="lg:col-span-6 bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 h-40 animate-pulse"
          >
            <div className="w-24 h-3 bg-[#e8e6f0]/60 rounded-md mb-4" />
            <div className="w-full h-3 bg-[#e8e6f0]/40 rounded-md mb-2.5" />
            <div className="w-3/4 h-3 bg-[#e8e6f0]/40 rounded-md" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
      {/* Left section */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        {/* Campaign Info */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
            Campaign Info
          </h3>
          <div className="flex flex-col gap-3 text-xs">
            {[
              { label: "Campaign Title", val: details.title },
              { label: "Campaign ID", val: details.id },
              { label: "Goal", val: details.goal },
              { label: "Niche", val: details.niche },
              { label: "Creator Tiers", val: details.creatorTiers },
              { label: "Preferred Platforms", val: details.platforms },
              {
                label: isSocial ? "Tokens Distributed" : "Total Budget",
                val: details.tokens,
                highlight: true,
              },
              {
                label: "Escrow Status",
                val: details.escrowStatus,
                status: true,
              },
              { label: "Date Created", val: details.dateCreated },
              { label: "Application Closing", val: details.applicationClosing },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center py-0.5">
                <span className="font-medium text-[#7a7a9a]">{row.label}</span>
                <span
                  className={cn(
                    "font-semibold text-[#1a1a2e]",
                    row.highlight ? "text-brand-pink font-bold" : "",
                    row.status ? "text-[#16a34a] font-bold" : "",
                  )}
                >
                  {row.val}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Content Direction */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
            Content Direction
          </h3>
          <div className="flex flex-col gap-3.5 text-xs text-[#5a5a7a] leading-relaxed">
            {details.directions.map((dir, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-brand-pink font-bold shrink-0">
                  {i + 1}.
                </span>
                <span>{dir}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right section */}
      <div className="lg:col-span-6 flex flex-col gap-6">
        {/* Campaign Brief */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3">
          <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
            Campaign Brief
          </h3>
          <p className="text-xs text-[#5a5a7a] leading-relaxed font-medium">
            {details.brief}
          </p>
        </div>

        {/* Deliverables */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
            Deliverables
          </h3>
          <div className="flex flex-col gap-3.5 text-xs text-[#5a5a7a] leading-relaxed">
            {details.deliverables.map((del, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <span className="text-brand-pink font-bold shrink-0">
                  {i + 1}.
                </span>
                <span dangerouslySetInnerHTML={{ __html: del }} />
              </div>
            ))}
          </div>
        </div>

        {/* Content Guidelines */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
            Content Guidelines
          </h3>
          <div className="flex flex-col gap-4 text-xs">
            <div className="flex flex-col gap-2.5">
              <span className="text-[10px] font-bold text-[#16a34a] uppercase tracking-wider">
                Do&apos;s
              </span>
              {details.doItems.map((doItem, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2.5 text-[#5a5a7a]"
                >
                  <div className="w-4 h-4 rounded-full bg-[#f0fdf4] text-[#16a34a] flex items-center justify-center shrink-0 border border-[#dcfce7]">
                    <Check size={9} className="stroke-[3]" />
                  </div>
                  <span className="font-medium">{doItem}</span>
                </div>
              ))}
            </div>

            {details.dontItems.length > 0 && (
              <div className="flex flex-col gap-2.5 border-t border-[#e8e6f0]/40 pt-4">
                <span className="text-[10px] font-bold text-[#dc2626] uppercase tracking-wider">
                  Don&apos;ts
                </span>
                {details.dontItems.map((dontItem, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 text-[#5a5a7a]"
                  >
                    <div className="w-4 h-4 rounded-full bg-[#fef2f2] text-[#dc2626] flex items-center justify-center shrink-0 border border-[#fee2e2]">
                      <X size={9} className="stroke-[3]" />
                    </div>
                    <span className="font-medium">{dontItem}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Success Looks Like */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3">
          <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
            Success Looks Like
          </h3>
          <p className="text-xs text-[#5a5a7a] leading-relaxed font-medium">
            {details.success}
          </p>
        </div>
      </div>

      {/* Bottom Full-width: Usage Rights */}
      <div className="col-span-1 lg:col-span-12 bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3">
        <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
          Usage Rights
        </h3>
        <p className="text-xs text-[#5a5a7a] leading-relaxed font-medium">
          {details.usageRights}
        </p>
      </div>
    </div>
  );
}
