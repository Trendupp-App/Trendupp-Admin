"use client";

interface TierItem {
  name: string;
  range: string;
  count: number;
  pct: number;
  color: string;
}

const TIERS: TierItem[] = [
  {
    name: "Nano",
    range: "1K-10K",
    count: 1842,
    pct: 48,
    color: "bg-[#16a34a]",
  },
  {
    name: "Micro",
    range: "10K-200K",
    count: 1204,
    pct: 31,
    color: "bg-[#7c3aed]",
  },
  {
    name: "Macro",
    range: "200K-1M",
    count: 687,
    pct: 18,
    color: "bg-[#2f63eb]",
  },
  { name: "Mega", range: "1M+", count: 114, pct: 3, color: "bg-[#ea580c]" },
];

export default function CreatorTiers() {
  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-4.5 h-full justify-center">
      <div>
        <h2 className="text-sm font-semibold text-[#1a1a2e]">
          Creator Tier Distribution
        </h2>
      </div>

      <div className="flex flex-col gap-3.5">
        {TIERS.map((t) => (
          <div key={t.name} className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-[#1a1a2e]">
                {t.name}{" "}
                <span className="text-[#7a7a9a] font-normal">({t.range})</span>
              </span>
              <span className="font-bold text-[#1a1a2e]">
                {t.count.toLocaleString()}{" "}
                <span className="text-[#9a99b0] font-normal">({t.pct}%)</span>
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#f4f3f6] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${t.color}`}
                style={{ width: `${t.pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
