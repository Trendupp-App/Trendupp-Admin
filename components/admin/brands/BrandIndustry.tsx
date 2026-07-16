"use client";

interface IndustryItem {
  name: string;
  count: number;
  pct: number;
}

const INDUSTRIES: IndustryItem[] = [
  { name: "Tech", count: 1842, pct: 48 },
  { name: "Fashion", count: 1204, pct: 31 },
  { name: "Beauty", count: 687, pct: 18 },
  { name: "Food & Beverage", count: 114, pct: 3 },
  { name: "Finance", count: 114, pct: 3 },
];

export default function BrandIndustry() {
  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-4.5 h-full justify-center">
      <div>
        <h2 className="text-sm font-semibold text-[#1a1a2e]">Industry</h2>
        <span className="text-[10px] text-[#9a99b0] font-medium">
          5 Country
        </span>
      </div>

      <div className="flex flex-col gap-3.5">
        {INDUSTRIES.map((ind) => (
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
