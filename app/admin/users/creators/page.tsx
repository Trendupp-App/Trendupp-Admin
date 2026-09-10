"use client";

import { useState } from "react";
import CreatorStats from "@/components/admin/creators/CreatorStats";
import SignupGrowthChart from "@/components/admin/creators/SignupGrowthChart";
import ActiveUsersChart from "@/components/admin/creators/ActiveUsersChart";
import TopCreators from "@/components/admin/creators/TopCreators";
import CreatorTiers from "@/components/admin/creators/CreatorTiers";
import ProfileCompletionCard from "@/components/admin/creators/ProfileCompletionCard";
import { CreatorCountryCard } from "@/components/admin/creators/CreatorDistributions";
import CreatorTable from "@/components/admin/creators/CreatorTable";
import { cn } from "@/lib/utils";

type ViewMode = "Charts" | "Tables";

export default function CreatorManagementPage() {
  const [viewMode, setViewMode] = useState<ViewMode>("Charts");

  return (
    <div className="flex flex-col gap-6 p-6 md:p-8 animate-fade-in-up">
      {/* Title Header */}
      <div>
        <h1 className="text-xl font-bold text-[#1a1a2e]">Creator Management</h1>
        <p className="text-xs text-[#7a7a9a] mt-0.5">
          Manage and monitor all creators on the platform
        </p>
      </div>

      {/* 4 Summary KPI Cards */}
      <CreatorStats />

      {/* Charts / Tables Pill Tabs Toggle */}
      <div className="flex items-center gap-1.5 p-1 bg-white border border-[#e8e6f0]/60 rounded-2xl w-fit shadow-xs">
        {(["Charts", "Tables"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setViewMode(tab)}
            className={cn(
              "px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer",
              viewMode === tab
                ? "bg-brand-pink text-white shadow-xs"
                : "text-[#7a7a9a] hover:text-[#1a1a2e]",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Full Analytics Charts & Widgets (Displayed when mode is Charts) */}
      {viewMode === "Charts" ? (
        <div className="flex flex-col gap-6">
          {/* Row 1: Signup Growth & Active Users Charts Side-by-Side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SignupGrowthChart />
            <ActiveUsersChart />
          </div>

          {/* Row 2: Top Creators (Left) & Tiers (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-5 flex flex-col">
              <TopCreators />
            </div>
            <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
              <CreatorTiers />
            </div>
          </div>

          {/* Row 3: Profile Completion & Country Location Breakdown Side-by-Side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProfileCompletionCard />
            <CreatorCountryCard />
          </div>
        </div>
      ) : (
        /* Creator Directory Table (Displayed when mode is Tables) */
        <CreatorTable />
      )}
    </div>
  );
}
