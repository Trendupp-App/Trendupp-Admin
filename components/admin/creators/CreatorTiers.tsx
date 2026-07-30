"use client";

import { useCreatorTierDistribution } from "@/hooks/useAdminCreators";
import { CardFilterHeaderControls } from "./CardFilterHeaderControls";
import { CardDateRangeBar } from "./CardDateRangeBar";

interface TierItem {
  name: string;
  range: string;
  count: number;
  pct: number;
  color: string;
}

const TIER_RANGES: Record<string, string> = {
  Nano: "1K-10K",
  Micro: "10K-200K",
  Macro: "200K-1M",
  Mega: "1M+",
};

const TIER_COLORS: Record<string, string> = {
  Nano: "bg-[#16a34a]",
  Micro: "bg-[#7c3aed]",
  Macro: "bg-[#2f63eb]",
  Mega: "bg-[#ea580c]",
};

export default function CreatorTiers() {
  const { data: tierData, isLoading } = useCreatorTierDistribution();

  const tiers: TierItem[] = tierData?.length
    ? tierData.map((t) => ({
        name: t.tier,
        range: TIER_RANGES[t.tier] || "Followers",
        count: t.count,
        pct: Math.round(t.percentage),
        color: TIER_COLORS[t.tier] || "bg-[#7c3aed]",
      }))
    : [];

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold text-[#1a1a2e]">
              Creator Tiers
            </h2>
            <span className="text-xs text-[#9a99b0]">
              Distribution by follower count
            </span>
          </div>
          <CardFilterHeaderControls />
        </div>

        {/* Date Range Selector Toolbar (From, To) */}
        <div className="pt-2 border-t border-[#f4f3f6] flex justify-start">
          <CardDateRangeBar />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="w-20 h-3.5 rounded-md bg-[#e8e6f0]/60" />
                <div className="w-12 h-3.5 rounded-md bg-[#e8e6f0]/60" />
              </div>
              <div className="w-full h-2 bg-[#e8e6f0]/40 rounded-full" />
            </div>
          ))
        ) : tiers.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#9a99b0]">
            No tier data available.
          </div>
        ) : (
          tiers.map((t) => (
            <div key={t.name} className="flex flex-col gap-2">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#1a1a2e]">{t.name}</span>
                  <span className="text-[#9a99b0] text-[11px]">
                    ({t.range})
                  </span>
                </div>
                <span className="font-bold text-[#1a1a2e]">
                  {t.count.toLocaleString()}{" "}
                  <span className="text-[#9a99b0] font-normal">({t.pct}%)</span>
                </span>
              </div>
              <div className="w-full h-2 bg-[#f4f3f6] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${t.color}`}
                  style={{ width: `${t.pct}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
