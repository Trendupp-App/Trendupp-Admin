"use client";

interface DistributionItem {
  label: string;
  count: number;
  pct: number;
}

const NICHES: DistributionItem[] = [
  { label: "Tech", count: 1842, pct: 48 },
  { label: "Fashion", count: 1204, pct: 31 },
  { label: "Beauty", count: 887, pct: 18 },
  { label: "Food & Beverage", count: 114, pct: 3 },
  { label: "Finance", count: 114, pct: 3 },
];

const COUNTRIES: DistributionItem[] = [
  { label: "Nigeria", count: 1842, pct: 48 },
  { label: "Ghana", count: 1204, pct: 31 },
  { label: "Kenya", count: 687, pct: 18 },
  { label: "Togo", count: 114, pct: 3 },
  { label: "Benin Republic", count: 134, pct: 3.5 },
  { label: "Uganda", count: 114, pct: 3 },
];

const COMPLETIONS: DistributionItem[] = [
  { label: "100%", count: 1842, pct: 48 },
  { label: "80%", count: 1204, pct: 31 },
  { label: "20%", count: 687, pct: 18 },
  { label: "40%", count: 114, pct: 3 },
  { label: "60%", count: 114, pct: 3 },
];

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
            {/* Label & Count */}
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

            {/* Progress bar */}
            <div className="w-full h-1.5 bg-[#f4f3f6] rounded-full overflow-hidden">
              <div
                className="h-full rounded-full bg-brand-pink transition-all duration-500"
                style={{ width: `${item.pct}%` }}
              />
            </div>

            {/* Percentage text (only for Niche, aligned left directly under the bar) */}
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <DistributionCard
        title="Niche"
        sub="5 Country"
        items={NICHES}
        badgeBg="bg-[#fdf2f6]"
        badgeText="text-brand-pink"
        showPercentageText={true}
      />
      <DistributionCard
        title="Country"
        sub="5 total Country"
        items={COUNTRIES}
        badgeBg="bg-[#fdf2f6]"
        badgeText="text-brand-pink"
      />
      <DistributionCard
        title="Completion"
        sub="Completion"
        items={COMPLETIONS}
        badgeBg="bg-[#fdf2f6]"
        badgeText="text-brand-pink"
      />
    </div>
  );
}
