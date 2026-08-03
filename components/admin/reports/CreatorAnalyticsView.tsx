"use client";

import CreatorStats from "@/components/admin/creators/CreatorStats";
import SignupGrowthChart from "@/components/admin/creators/SignupGrowthChart";
import ActiveUsersChart from "@/components/admin/creators/ActiveUsersChart";
import TopCreators from "@/components/admin/creators/TopCreators";
import CreatorTiers from "@/components/admin/creators/CreatorTiers";
import CreatorGender from "@/components/admin/creators/CreatorGender";
import ProfileCompletionCard from "@/components/admin/creators/ProfileCompletionCard";
import {
  CreatorNicheCard,
  CreatorCountryCard,
} from "@/components/admin/creators/CreatorDistributions";

export default function CreatorAnalyticsView() {
  return (
    <div className="flex flex-col gap-6 text-left">
      {/* 4 Summary KPI Cards */}
      <CreatorStats />

      {/* Row 1: Signup Growth & Active Users Charts Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SignupGrowthChart />
        <ActiveUsersChart />
      </div>

      {/* Row 2: Top Creators (Left) & Tiers + Gender Breakdown (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-5 flex flex-col">
          <TopCreators />
        </div>
        <div className="lg:col-span-7 flex flex-col gap-6 justify-between">
          <CreatorTiers />
          <CreatorGender />
        </div>
      </div>

      {/* Row 3: Profile Completion & Niche Breakdown Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProfileCompletionCard />
        <CreatorNicheCard />
      </div>

      {/* Row 4: Country Location Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CreatorCountryCard />
      </div>
    </div>
  );
}
