"use client";

import { useCreatorGenderDistribution } from "@/hooks/useAdminCreators";

export default function CreatorGender() {
  const { data: genderData } = useCreatorGenderDistribution();

  const items = genderData?.length
    ? genderData.map((g) => ({
        name: g.gender,
        count: g.count,
        pct: Math.round(g.percentage),
        color:
          g.gender.toLowerCase() === "male" ? "bg-[#2f63eb]" : "bg-brand-pink",
      }))
    : [
        { name: "Female", count: 2643, pct: 68.7, color: "bg-brand-pink" },
        { name: "Male", count: 1204, pct: 31.3, color: "bg-[#2f63eb]" },
      ];

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-4.5">
      <div>
        <h2 className="text-sm font-semibold text-[#1a1a2e]">Gender</h2>
      </div>

      <div className="flex flex-col gap-4">
        {items.map((g) => (
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
        ))}
      </div>
    </section>
  );
}
