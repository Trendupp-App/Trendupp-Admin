"use client";

import { useState } from "react";
import SocialStats from "@/components/admin/campaigns/SocialStats";
import SocialGrid from "@/components/admin/campaigns/SocialGrid";
import CreateCampaignWizard from "@/components/admin/campaigns/CreateCampaignWizard";

export default function SocialImpactCampaignsPage() {
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col text-left">
          <h1 className="text-xl font-bold text-[#1a1a2e]">
            Social Impact Campaigns
          </h1>
          <span className="text-[10px] text-[#9a99b0] font-semibold mt-0.5">
            5 campaigns total &mdash; token-based, non-paid
          </span>
        </div>
        <button
          onClick={() => setIsWizardOpen(true)}
          className="h-9.5 px-4.5 bg-brand-pink text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer"
        >
          + Create Campaign
        </button>
      </div>

      {/* KPI stats */}
      <SocialStats />

      {/* Grid of campaigns */}
      <SocialGrid />

      {/* Wizard */}
      <CreateCampaignWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
    </div>
  );
}
