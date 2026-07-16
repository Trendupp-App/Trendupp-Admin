"use client";

import CreatorStats from "@/components/admin/creators/CreatorStats";
import CreatorTiers from "@/components/admin/creators/CreatorTiers";
import CreatorGender from "@/components/admin/creators/CreatorGender";
import TopCreators from "@/components/admin/creators/TopCreators";
import CreatorDistributions from "@/components/admin/creators/CreatorDistributions";
import CreatorTable from "@/components/admin/creators/CreatorTable";

export default function CreatorManagementPage() {
  return (
    <div className="flex flex-col gap-6 p-6 md:p-8">
      <div>
        <h1 className="text-xl font-semibold text-[#1a1a2e]">
          Creator Management
        </h1>
        <p className="text-xs text-[#7a7a9a] mt-0.5">
          Manage and monitor all creators on the platform
        </p>
      </div>

      {/* 4 Stats Cards */}
      <CreatorStats />

      {/* Top Creators and Tiers/Gender Distribution side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5">
          <TopCreators />
        </div>
        <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
          <CreatorTiers />
          <CreatorGender />
        </div>
      </div>

      {/* Niche, Country, Completion distributions */}
      <CreatorDistributions />

      {/* Creators Table Card */}
      <CreatorTable />
    </div>
  );
}
