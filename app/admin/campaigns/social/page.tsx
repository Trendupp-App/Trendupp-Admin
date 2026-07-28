"use client";

import { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import SocialStats from "@/components/admin/campaigns/SocialStats";
import SocialGrid from "@/components/admin/campaigns/SocialGrid";

export default function SocialImpactCampaignsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 animate-fade-in-up">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col text-left">
          <h1 className="text-xl font-bold text-[#1a1a2e]">
            Social Impact Campaigns
          </h1>
          <span className="text-[10px] text-[#9a99b0] font-semibold mt-0.5">
            Token-based, non-paid community campaigns
          </span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9a99b0]"
            />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-9.5 pl-9 pr-3 text-xs bg-white border border-[#e8e6f0] rounded-xl text-[#1a1a2e] focus:outline-none focus:border-brand-pink transition-colors"
            />
          </div>

          <Link
            href="/admin/campaigns/social/create"
            className="h-9.5 px-4 bg-brand-pink text-white text-xs font-bold rounded-xl hover:opacity-90 transition-all cursor-pointer flex items-center justify-center select-none shrink-0"
          >
            + Create Campaign
          </Link>
        </div>
      </div>

      {/* KPI stats */}
      <SocialStats />

      {/* Grid of campaigns */}
      <SocialGrid searchQuery={searchQuery} />
    </div>
  );
}
