"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface CampaignDetailsTabProps {
  isSocial?: boolean;
  campaignId?: string;
  campaignName?: string;
  nicheName?: string;
}

const MOCK_CAMPAIGN_DETAILS: Record<
  string,
  {
    title: string;
    niche: string;
    tokens: string;
    id: string;
    brief: string;
    deliverables: string[];
    doItems: string[];
    dontItems: string[];
    directions: string[];
    success: string;
    usageRights: string;
  }
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

const getDetails = (id: string, _isSocial: boolean) => {
  const explicit = MOCK_CAMPAIGN_DETAILS[id];
  if (explicit) return explicit;

  if (id.startsWith("a-")) {
    const idx = parseInt(id.replace("a-", ""), 10);
    const titleVal = `Active Brand Push Campaign ${isNaN(idx) ? 1 : idx + 1}`;
    const nicheVal = idx % 2 === 0 ? "Retail" : "Healthcare";
    return {
      title: titleVal,
      niche: nicheVal,
      tokens: "24,500 Tokens",
      id: `TRD-${id.toUpperCase()}`,
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
      id: `TRD-${id.toUpperCase()}`,
    };
  }

  // Paid Campaign Default
  return {
    title: "Summer Style Collection 2025",
    niche: "Fashion",
    tokens: "₦3,000,000",
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
  };
};

export default function CampaignDetailsTab({
  isSocial,
  campaignId = "",
}: CampaignDetailsTabProps) {
  const details = getDetails(campaignId, !!isSocial);

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
              { label: "Goal", val: "Create Content" },
              { label: "Niche", val: details.niche },
              { label: "Creator Tiers", val: "Micro, Macro" },
              { label: "Preferred Platforms", val: "Instagram" },
              {
                label: isSocial ? "Tokens Distributed" : "Total Budget",
                val: details.tokens,
                highlight: true,
              },
              { label: "Escrow Status", val: "Funded", status: true },
              { label: "Date Created", val: "Jun 1, 2026" },
              { label: "Application Closing", val: "Jun 3, 2026" },
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
