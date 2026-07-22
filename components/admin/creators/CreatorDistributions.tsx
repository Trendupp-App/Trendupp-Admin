"use client";

import {
  useCreatorNicheBreakdown,
  useCreatorCountryBreakdown,
} from "@/hooks/useAdminCreators";

interface DistributionItem {
  label: string;
  count: number;
  pct: number;
}

interface CardProps {
  title: string;
  sub: string;
  items: DistributionItem[];
  badgeBg: string;
  badgeText: string;
  showPercentageText?: boolean;
  isLoading?: boolean;
}

function DistributionCard({
  title,
  sub,
  items,
  badgeBg,
  badgeText,
  showPercentageText = false,
  isLoading = false,
}: CardProps) {
  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4 shadow-xs">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
            {title}
          </h3>
          <span className="text-[10px] text-[#9a99b0] font-medium">{sub}</span>
        </div>
        <select className="h-7 px-2 bg-[#faf9fc] border border-[#e8e6f0]/60 text-[#1a1a2e] text-[10px] font-semibold rounded-lg outline-none cursor-pointer">
          <option>This Month</option>
          <option>This Year</option>
        </select>
      </div>

      <div className="flex flex-col gap-3.5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="w-16 h-4 rounded-md bg-[#e8e6f0]/60" />
                <div className="w-10 h-3.5 rounded-md bg-[#e8e6f0]/60" />
              </div>
              <div className="w-full h-1.5 bg-[#e8e6f0]/40 rounded-full" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#9a99b0]">
            No data available.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.label} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span
                  className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${badgeBg} ${badgeText}`}
                >
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

              {showPercentageText && (
                <span className="text-[8px] font-bold text-brand-pink -mt-0.5">
                  {item.pct}%
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function CreatorDistributions() {
  const { data: nicheData, isLoading: isLoadingNiche } =
    useCreatorNicheBreakdown();
  const { data: countryData, isLoading: isLoadingCountry } =
    useCreatorCountryBreakdown();

  const nichesList: DistributionItem[] = nicheData?.length
    ? nicheData.map((n) => ({
        label: n.niche,
        count: n.count,
        pct: Math.round(n.percentage),
      }))
    : [
        { label: "Tech", count: 1842, pct: 48 },
        { label: "Fashion", count: 1204, pct: 31 },
        { label: "Beauty", count: 687, pct: 18 },
        { label: "Food & Beverage", count: 687, pct: 18 },
        { label: "Finance", count: 687, pct: 18 },
      ];

  const countriesList: DistributionItem[] = countryData?.length
    ? countryData.map((c) => ({
        label: c.country,
        count: c.count,
        pct: Math.round(c.percentage),
      }))
    : [
        { label: "Nigeria", count: 1842, pct: 48 },
        { label: "Ghana", count: 1204, pct: 31 },
        { label: "Kenya", count: 687, pct: 18 },
        { label: "Togo", count: 687, pct: 18 },
        { label: "Benin Republic", count: 687, pct: 18 },
        { label: "Uganda", count: 687, pct: 18 },
      ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <DistributionCard
        title="Niche"
        sub="5 Country"
        items={nichesList}
        badgeBg="bg-[#fdf2f6]"
        badgeText="text-brand-pink"
        showPercentageText
        isLoading={isLoadingNiche}
      />

      <DistributionCard
        title="Country"
        sub="5 Total Country"
        items={countriesList}
        badgeBg="bg-[#fdf2f6]"
        badgeText="text-brand-pink"
        isLoading={isLoadingCountry}
      />
    </div>
  );
}
