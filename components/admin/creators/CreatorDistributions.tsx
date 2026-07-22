"use client";

import {
  useCreatorNicheBreakdown,
  useCreatorCountryBreakdown,
  useCreatorSummary,
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
}

function DistributionCard({
  title,
  sub,
  items,
  badgeBg,
  badgeText,
  showPercentageText = false,
}: CardProps) {
  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4">
      <div>
        <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
          {title}
        </h3>
        <span className="text-[10px] text-[#9a99b0] font-medium">{sub}</span>
      </div>

      <div className="flex flex-col gap-3.5">
        {items.map((item) => (
          <div key={item.label} className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span
                className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${badgeBg} ${badgeText}`}
              >
                {item.label}
              </span>
              <span className="font-bold text-[#1a1a2e]">
                {item.count.toLocaleString()}
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
        ))}
      </div>
    </div>
  );
}

export default function CreatorDistributions() {
  const { data: nicheData } = useCreatorNicheBreakdown();
  const { data: countryData } = useCreatorCountryBreakdown();
  const { data: summaryData } = useCreatorSummary();

  const nichesList: DistributionItem[] = nicheData?.length
    ? nicheData.map((n) => ({
        label: n.niche,
        count: n.count,
        pct: Math.round(n.percentage),
      }))
    : [
        { label: "Tech", count: 1842, pct: 48 },
        { label: "Fashion", count: 1204, pct: 31 },
        { label: "Beauty", count: 887, pct: 18 },
        { label: "Food & Beverage", count: 114, pct: 3 },
        { label: "Finance", count: 114, pct: 3 },
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
        { label: "Togo", count: 114, pct: 3 },
        { label: "Benin Republic", count: 134, pct: 3.5 },
      ];

  const completionsList: DistributionItem[] = summaryData
    ?.profileCompletionDistribution?.length
    ? summaryData.profileCompletionDistribution.map((item) => ({
        label: item.percentageLabel,
        count: item.count,
        pct: Math.round(
          (item.count / (summaryData.summary.totalCreators || 1)) * 100,
        ),
      }))
    : [
        { label: "100%", count: 1842, pct: 48 },
        { label: "80%", count: 1204, pct: 31 },
        { label: "20%", count: 687, pct: 18 },
        { label: "40%", count: 114, pct: 3 },
        { label: "60%", count: 114, pct: 3 },
      ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DistributionCard
        title="Niche"
        sub="Category breakdown"
        items={nichesList}
        badgeBg="bg-[#f0fdf4]"
        badgeText="text-[#16a34a]"
        showPercentageText
      />

      <DistributionCard
        title="Country Location"
        sub="Geographic distribution"
        items={countriesList}
        badgeBg="bg-[#edf2fe]"
        badgeText="text-[#2f63eb]"
      />

      <DistributionCard
        title="Profile Completion Rate"
        sub="Completion stages"
        items={completionsList}
        badgeBg="bg-[#fdf2f6]"
        badgeText="text-[#d7176f]"
      />
    </div>
  );
}
