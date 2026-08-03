"use client";

import BrandStats from "@/components/admin/brands/BrandStats";
import BrandSignupGrowthChart from "@/components/admin/brands/BrandSignupGrowthChart";
import BrandActiveUsersChart from "@/components/admin/brands/BrandActiveUsersChart";
import TopBrands from "@/components/admin/brands/TopBrands";
import BrandProfileCompletionCard from "@/components/admin/brands/BrandProfileCompletionCard";
import BrandDistributions from "@/components/admin/brands/BrandDistributions";

export default function AdvertiserAnalyticsView() {
  return (
    <div className="flex flex-col gap-6 text-left">
      {/* 4 KPI Summary Cards */}
      <BrandStats />

      {/* Signup Growth & Active Users Charts Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BrandSignupGrowthChart />
        <BrandActiveUsersChart />
      </div>

      {/* Top Advertisers & Profile Completion Cards Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopBrands />
        <BrandProfileCompletionCard />
      </div>

      {/* Industry Breakdown & Country Breakdown Side-by-Side */}
      <BrandDistributions />
    </div>
  );
}
