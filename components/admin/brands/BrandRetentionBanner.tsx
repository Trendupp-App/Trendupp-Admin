"use client";

import { TrendingUp } from "lucide-react";
import { useBrandSummary } from "@/hooks/useAdminBrands";

export default function BrandRetentionBanner() {
  const { isLoading } = useBrandSummary();

  if (isLoading) {
    return (
      <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex items-center justify-between animate-pulse shadow-xs">
        <div className="flex flex-col gap-2">
          <div className="w-36 h-3 rounded-md bg-[#e8e6f0]/60" />
          <div className="w-20 h-8 rounded-lg bg-[#e8e6f0]/60" />
          <div className="w-48 h-3 rounded-md bg-[#e8e6f0]/40" />
        </div>
        <div className="w-28 h-7 rounded-full bg-[#e8e6f0]/60" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex items-center justify-between shadow-xs">
      <div className="flex flex-col gap-1">
        <span className="text-[11px] font-semibold text-[#7a7a9a]">
          Advertisers Retention Rate
        </span>
        <h2 className="text-3xl font-black text-[#1a1a2e]">68%</h2>
        <span className="text-[11px] text-[#9a99b0]">
          Advertisers returning from previous period
        </span>
      </div>

      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0fdf4] text-[#16a34a] border border-[#bbf7d0] text-xs font-bold shrink-0">
        <TrendingUp size={13} />
        <span>4% vs last period</span>
      </div>
    </div>
  );
}
