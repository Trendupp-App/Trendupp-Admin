"use client";

import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CampaignDetailsTab() {
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
              { label: "Campaign Title", val: "Summer Style Collection 2025" },
              { label: "Campaign ID", val: "TRD-1001" },
              { label: "Goal", val: "Create Content" },
              { label: "Niche", val: "Fashion" },
              { label: "Creator Tiers", val: "Micro, Macro" },
              { label: "Preferred Platforms", val: "Instagram" },
              { label: "Total Budget", val: "₦3,000,000", highlight: true },
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
            {[
              "Dramatic before and after revealing the collection's impact.",
              "Incorporate the hair styling seamlessly into your beauty routine.",
              "Step-by-step guide to achieving an effortless, elegant look.",
            ].map((dir, i) => (
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
            Zara Africa is launching a campaign to connect with authentic
            Nigerian creators and build brand awareness across key demographics.
          </p>
        </div>

        {/* Deliverables */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4">
          <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
            Deliverables
          </h3>
          <div className="flex flex-col gap-3.5 text-xs text-[#5a5a7a] leading-relaxed">
            {[
              "1 &times; Platform Reel (60 seconds)",
              "3 &times; Stories with product tag",
              "Caption in English or Pidgin",
            ].map((del, i) => (
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
              {[
                "Tag brand account and use campaign hashtag",
                "Show product in natural settings",
                "Include verbal CTA",
              ].map((doItem, i) => (
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

            <div className="flex flex-col gap-2.5 border-t border-[#e8e6f0]/40 pt-4">
              <span className="text-[10px] font-bold text-[#dc2626] uppercase tracking-wider">
                Don&apos;ts
              </span>
              {[
                "No competitor brands visible",
                "No misleading health claims",
              ].map((dontItem, i) => (
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
          </div>
        </div>

        {/* Success Looks Like */}
        <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3">
          <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
            Success Looks Like
          </h3>
          <p className="text-xs text-[#5a5a7a] leading-relaxed font-medium">
            We are looking for content that feels authentic, relatable, visually
            appealing, and inspires women to explore the new SWW Hair
            Collection. We are excited to collaborate with you and can&apos;t
            wait to see your creativity bring the SWW Hair Collection to life.
          </p>
        </div>
      </div>

      {/* Bottom Full-width: Usage Rights */}
      <div className="col-span-1 lg:col-span-12 bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-3">
        <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
          Usage Rights
        </h3>
        <p className="text-xs text-[#5a5a7a] leading-relaxed font-medium">
          By participating in this campaign, creators grant Zara Africa
          permission to repost and use campaign content across its digital
          platforms for marketing and promotional purposes.
        </p>
      </div>
    </div>
  );
}
