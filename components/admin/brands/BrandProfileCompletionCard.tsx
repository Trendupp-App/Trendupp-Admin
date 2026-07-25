"use client";

import { useMemo } from "react";
import { useBrandSummary } from "@/hooks/useAdminBrands";

export default function BrandProfileCompletionCard() {
  const { data: apiData, isLoading } = useBrandSummary();

  const stages = useMemo(() => {
    const rawList = apiData?.profileCompletionDistribution;
    if (rawList && Array.isArray(rawList) && rawList.length > 0) {
      const maxCount = Math.max(...rawList.map((item) => item.count || 1), 1);
      return rawList.map((item) => {
        const pctNumber =
          parseInt(item.percentageLabel?.replace("%", "") || "0", 10) || 50;
        const widthPct = Math.min(
          100,
          Math.max(10, Math.round((item.count / maxCount) * 100)),
        );
        return {
          label: item.percentageLabel || `${pctNumber}%`,
          count: item.count.toLocaleString(),
          widthPct: `${widthPct}%`,
        };
      });
    }

    return [];
  }, [apiData]);

  if (isLoading) {
    return (
      <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-4 animate-pulse">
        <div className="w-32 h-4 bg-[#e8e6f0]/60 rounded-md" />
        <div className="w-24 h-3 bg-[#e8e6f0]/40 rounded-md mb-2" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5">
              <div className="flex justify-between">
                <div className="w-12 h-3 bg-[#e8e6f0]/60 rounded-md" />
                <div className="w-10 h-3 bg-[#e8e6f0]/60 rounded-md" />
              </div>
              <div className="w-full h-2 bg-[#faf9fc] rounded-full overflow-hidden">
                <div className="h-full bg-[#e8e6f0]/60 rounded-full w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-xs">
      <div>
        <h3 className="text-sm font-bold text-[#1a1a2e]">Profile Completion</h3>
        <span className="text-[11px] text-[#9a99b0]">Completion</span>
      </div>

      <div className="flex flex-col gap-4">
        {stages.map((stage, idx) => (
          <div key={idx} className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#1a1a2e] text-[11px]">
                {stage.label}
              </span>
              <span className="font-bold text-[#1a1a2e] text-[11px]">
                {stage.count}
              </span>
            </div>
            <div className="w-full h-2 bg-[#f4f3f6] rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-pink rounded-full transition-all duration-500"
                style={{ width: stage.widthPct }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
