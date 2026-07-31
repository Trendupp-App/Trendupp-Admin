"use client";

import { useState, useMemo } from "react";
import { ChevronRight } from "lucide-react";
import { useTopBrands } from "@/hooks/useAdminBrands";
import UserAvatar from "@/shared/UserAvatar";

import { CardDateRangeBar } from "../creators/CardDateRangeBar";

const PepsiLogo = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-9 h-9 rounded-full overflow-hidden shadow-xs shrink-0"
  >
    <path
      d="M 50,5 A 45,45 0 0 1 95,50 C 95,50 80,35 50,45 C 20,55 5,50 5,50 A 45,45 0 0 1 50,5 Z"
      fill="#E31837"
    />
    <path
      d="M 50,95 A 45,45 0 0 1 5,50 C 5,50 20,55 50,45 C 80,35 95,50 95,50 A 45,45 0 0 1 50,95 Z"
      fill="#004B87"
    />
    <path
      d="M 5,50 C 5,50 20,55 50,45 C 80,35 95,50 95,50 C 95,50 78,28 50,38 C 22,48 5,50 5,50 Z"
      fill="#FFFFFF"
    />
  </svg>
);

export default function TopBrands({ onViewAll }: { onViewAll?: () => void }) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const { data: apiData, isLoading } = useTopBrands({
    startDate: fromDate || undefined,
    endDate: toDate || undefined,
    limit: 5,
  });

  const brands = useMemo(() => {
    if (apiData && Array.isArray(apiData) && apiData.length > 0) {
      return apiData.map((b, idx) => {
        const formattedSpend =
          b.totalSpend >= 1000000
            ? `₦${(b.totalSpend / 1000000).toFixed(1)}M`
            : b.totalSpend >= 1000
              ? `₦${(b.totalSpend / 1000).toFixed(0)}K`
              : `₦${b.totalSpend}`;
        return {
          rank: idx + 1,
          name: b.brandName || "Brand",
          web: b.website || "www.brand.com",
          logoUrl: b.logoUrl,
          spend: formattedSpend,
          campaigns: b.campaignsCount || 0,
        };
      });
    }

    return [];
  }, [apiData]);

  const getRankBadgeClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-[#f59e0b] text-white";
      case 2:
        return "bg-[#fbbf24] text-white";
      case 3:
        return "bg-[#fcd34d] text-white";
      default:
        return "bg-[#e8e6f0] text-[#5a5a7a]";
    }
  };

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col justify-between gap-5 shadow-xs">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1a1a2e]">
              Top Advertisers
            </h3>
            <span className="text-[11px] text-[#9a99b0]">By total spend</span>
          </div>
        </div>

        {/* Date Range Toolbar */}
        <div className="pt-2 border-t border-[#f4f3f6] flex justify-start">
          <CardDateRangeBar
            onDateChange={(from, to) => {
              setFromDate(from);
              setToDate(to);
            }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-2 border-b border-[#e8e6f0]/30 animate-pulse"
            >
              <div className="w-5 h-5 rounded-full bg-[#e8e6f0]/60" />
              <div className="w-9 h-9 rounded-full bg-[#e8e6f0]/60 shrink-0" />
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="w-24 h-3.5 bg-[#e8e6f0]/60 rounded-md" />
                <div className="w-20 h-2.5 bg-[#e8e6f0]/40 rounded-md" />
              </div>
              <div className="w-14 h-4 bg-[#e8e6f0]/60 rounded-md" />
            </div>
          ))
        ) : brands.length === 0 ? (
          <div className="py-8 text-center text-xs text-[#9a99b0]">
            No top advertisers data available for the selected period.
          </div>
        ) : (
          brands.map((b) => (
            <div
              key={b.rank}
              className="flex items-center justify-between py-2 border-b border-[#e8e6f0]/30 last:border-0 text-xs hover:bg-[#faf9fc] rounded-xl px-2 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-extrabold shrink-0 ${getRankBadgeClass(b.rank)}`}
                >
                  {b.rank}
                </span>

                {b.name === "Pepsi" ? (
                  <PepsiLogo />
                ) : (
                  <UserAvatar
                    avatarUrl={b.logoUrl || undefined}
                    initials={b.name.slice(0, 2)}
                    size={36}
                  />
                )}

                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-[#1a1a2e] truncate">
                    {b.name}
                  </span>
                  <span className="text-[10px] text-[#9a99b0] truncate">
                    {b.web}
                  </span>
                </div>
              </div>

              <div className="flex flex-col items-end shrink-0 pl-2">
                <span className="font-bold text-brand-pink text-xs">
                  {b.spend}
                </span>
                <span className="text-[10px] text-[#9a99b0]">
                  {b.campaigns} campaigns
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {onViewAll && (
        <div className="pt-2 flex justify-end">
          <button
            onClick={onViewAll}
            className="h-7 px-3 bg-[#edf3ff] hover:bg-[#dbe9ff] text-[#2f63eb] text-xs font-bold rounded-xl flex items-center gap-1 transition-colors cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight size={13} className="stroke-[2.5]" />
          </button>
        </div>
      )}
    </div>
  );
}
