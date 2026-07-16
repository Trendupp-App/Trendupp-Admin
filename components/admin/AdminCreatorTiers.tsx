"use client";

const TIERS = [
  { name: "Nano", count: 1642, bar: "bg-[#16a34a]", pct: 100 },
  { name: "Micro", count: 1204, bar: "bg-brand-pink", pct: 73 },
  { name: "Macro", count: 687, bar: "bg-[#2f63eb]", pct: 42 },
  { name: "Mega", count: 114, bar: "bg-[#7c3aed]", pct: 7 },
];

export function AdminCreatorTiers() {
  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5">
      <div>
        <h2 className="text-sm font-semibold text-[#1a1a2e]">Creator Tiers</h2>
        <p className="text-[10px] text-[#9a99b0]">5,847 total registered</p>
      </div>

      <div className="flex flex-col gap-4">
        {TIERS.map(({ name, count, bar, pct }) => (
          <div key={name} className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <span className="text-xs font-medium text-[#1a1a2e]">{name}</span>
              <span className="text-xs font-semibold text-[#1a1a2e]">
                {count.toLocaleString()}
              </span>
            </div>
            <div className="w-full h-2 bg-[#f4f3f6] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${bar}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-[#e8e6f0]/60 pt-3 flex justify-between text-[10px]">
        <span className="text-[#7a7a9a]">Pending verification</span>
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#1a1a2e]">22</span>
          <span className="text-[#16a34a] font-semibold">+124</span>
        </div>
      </div>
    </section>
  );
}
