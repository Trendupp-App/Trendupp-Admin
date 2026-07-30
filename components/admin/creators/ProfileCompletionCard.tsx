"use client";

import { useMemo } from "react";
import { useCreatorSummary } from "@/hooks/useAdminCreators";
import { CardFilterHeaderControls } from "./CardFilterHeaderControls";
import { CardDateRangeBar } from "./CardDateRangeBar";

interface CompletionItem {
  label: string;
  count: number;
  pct: number;
}

export default function ProfileCompletionCard() {
  const { data: summaryData, isLoading } = useCreatorSummary();

  const rawList = useMemo(() => {
    return summaryData?.profileCompletionDistribution;
  }, [summaryData]);

  const totalCreatorsCount = useMemo(() => {
    return summaryData?.summary.totalCreators ?? 1;
  }, [summaryData]);

  const items: CompletionItem[] = useMemo(() => {
    if (Array.isArray(rawList) && rawList.length > 0) {
      return rawList.map((item) => {
        const it = item as unknown as Record<string, unknown>;
        const label = String(
          it.percentageLabel ??
            it.percentage_label ??
            it.label ??
            it.stage ??
            it.percentage ??
            "100%",
        );
        const count = Number(it.count ?? it.value ?? it.total ?? 0);
        const pct = Math.round(
          it.percentage !== undefined || it.pct !== undefined
            ? Number(it.percentage ?? it.pct)
            : (count / Number(totalCreatorsCount)) * 100,
        );
        return {
          label:
            label.endsWith("%") || isNaN(Number(label)) ? label : `${label}%`,
          count,
          pct: isNaN(pct) ? 0 : pct,
        };
      });
    }

    if (summaryData?.summary) {
      const s = summaryData.summary as unknown as Record<string, number>;
      const total =
        Number(s.totalCreators ?? s.total_creators) || totalCreatorsCount || 1;
      const completed = Number(s.profileCompleted ?? s.profile_completed) || 0;
      const pending =
        Number(s.pendingProfileCompletion ?? s.pending_profile_completion) || 0;
      const completedPct = Math.round((completed / total) * 100);
      const pendingPct = Math.round((pending / total) * 100);

      return [
        {
          label: "100%",
          count: completed,
          pct: isNaN(completedPct) ? 0 : completedPct,
        },
        {
          label: "Pending",
          count: pending,
          pct: isNaN(pendingPct) ? 0 : pendingPct,
        },
      ];
    }

    return [];
  }, [rawList, summaryData, totalCreatorsCount]);

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4 shadow-xs">
      <div className="flex flex-col gap-3">
        <div>
          <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
            Profile Completion
          </h3>
          <span className="text-[10px] text-[#9a99b0] font-medium">
            Completion distribution
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

      <div className="flex flex-col gap-3.5">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-1.5 animate-pulse">
              <div className="flex justify-between items-center text-xs">
                <div className="w-10 h-3.5 rounded-md bg-[#e8e6f0]/60" />
                <div className="w-16 h-3.5 rounded-md bg-[#e8e6f0]/60" />
              </div>
              <div className="w-full h-1.5 bg-[#e8e6f0]/40 rounded-full" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#9a99b0]">
            No profile completion data available.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.label} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-[#fdf2f6] text-brand-pink">
                  {item.label}
                </span>
                <span className="font-bold text-[#1a1a2e]">
                  {item.count.toLocaleString()}{" "}
                  <span className="text-[#9a99b0] font-normal">
                    ({item.pct}%)
                  </span>
                </span>
              </div>

              <div className="w-full h-1.5 bg-[#f4f3f6] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-pink transition-all duration-500"
                  style={{ width: `${item.pct}%` }}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
