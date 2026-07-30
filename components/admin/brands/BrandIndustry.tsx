"use client";

import { useBrandIndustryBreakdown } from "@/hooks/useAdminBrands";
import { CardFilterHeaderControls } from "../creators/CardFilterHeaderControls";
import { CardDateRangeBar } from "../creators/CardDateRangeBar";

export default function BrandIndustry() {
  const { data, isLoading } = useBrandIndustryBreakdown();

  const industries = (data ?? []).map((i) => ({
    name: i.industry,
    count: i.count,
    pct: Math.min(100, Math.round(i.percentage)),
  }));

  if (isLoading) {
    return (
      <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-4.5 animate-pulse">
        <div className="w-24 h-4 bg-[#e8e6f0]/60 rounded-md" />
        <div className="flex flex-col gap-3.5">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-full h-6 bg-[#faf9fc] rounded-xl" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-xs">
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[#1a1a2e]">Industry</h2>
          <span className="text-[10px] text-[#9a99b0] font-medium">
            {industries.length} industr{industries.length === 1 ? "y" : "ies"}
          </span>
        </div>

        <div className="pt-0.5">
          <CardFilterHeaderControls />
        </div>

        {/* Date Range Toolbar */}
        <div className="pt-2 border-t border-[#f4f3f6] flex justify-start">
          <CardDateRangeBar />
        </div>
      </div>

      {industries.length === 0 && (
        <p className="text-xs text-[#9a99b0] text-center py-6">
          No industry data yet.
        </p>
      )}

      <div className="flex flex-col gap-3.5 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
        {industries.map((ind) => (
          <div key={ind.name} className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-[#fdf2f6] text-brand-pink">
                {ind.name}
              </span>
              <span className="font-bold text-[#1a1a2e]">
                {ind.count.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#f4f3f6] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-pink transition-all duration-500"
                style={{ width: `${ind.pct}%` }}
              />
            </div>
            <span className="text-[8px] font-bold text-brand-pink -mt-0.5">
              {ind.pct}%
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
