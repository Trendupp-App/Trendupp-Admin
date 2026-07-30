"use client";

import { useCreatorGenderDistribution } from "@/hooks/useAdminCreators";
import { CardFilterHeaderControls } from "./CardFilterHeaderControls";
import { CardDateRangeBar } from "./CardDateRangeBar";

export default function CreatorGender() {
  const { data: genderData, isLoading } = useCreatorGenderDistribution();

  const items = genderData?.length
    ? genderData.map((g) => ({
        name: g.gender,
        count: g.count,
        pct: Math.round(g.percentage),
        color:
          g.gender.toLowerCase() === "male" ? "bg-[#2f63eb]" : "bg-brand-pink",
      }))
    : [];

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-4.5">
      <div className="flex flex-col gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[#1a1a2e]">Gender</h2>
          <span className="text-[11px] text-[#9a99b0]">
            Distribution by gender
          </span>
        </div>

        <div className="pt-0.5">
          <CardFilterHeaderControls />
        </div>

        {/* Date Range Selector Toolbar (From, To) */}
        <div className="pt-2 border-t border-[#f4f3f6] flex justify-start">
          <CardDateRangeBar />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {isLoading ? (
          Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="w-16 h-3.5 rounded-md bg-[#e8e6f0]/60" />
                <div className="w-12 h-3.5 rounded-md bg-[#e8e6f0]/60" />
              </div>
              <div className="w-full h-1.5 bg-[#e8e6f0]/40 rounded-full" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#9a99b0]">
            No gender data available.
          </div>
        ) : (
          items.map((g) => (
            <div key={g.name} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-semibold text-[#1a1a2e]">{g.name}</span>
                <span className="font-bold text-[#1a1a2e]">
                  {g.count.toLocaleString()}{" "}
                  <span className="text-[#9a99b0] font-normal">({g.pct}%)</span>
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#f4f3f6] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${g.color}`}
                  style={{ width: `${g.pct}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
