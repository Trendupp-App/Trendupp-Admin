"use client";

import { useState } from "react";
import { useCreatorGenderDistribution } from "@/hooks/useAdminCreators";

const MONTHS = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12 },
];

export default function CreatorGender() {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const selectedYear = new Date().getFullYear();

  const monthStr = String(selectedMonth).padStart(2, "0");
  const startDate = `${selectedYear}-${monthStr}-01`;
  const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
  const endDate = `${selectedYear}-${monthStr}-${String(lastDay).padStart(2, "0")}`;

  const { data: genderData, isLoading } = useCreatorGenderDistribution({
    period: "monthly",
    year: selectedYear,
    month: selectedMonth,
    startDate,
    endDate,
  });

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
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[#1a1a2e]">Gender</h2>
          <span className="text-[11px] text-[#9a99b0]">
            Distribution by gender
          </span>
        </div>

        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
          className="h-8 px-3 bg-[#faf9fc] border border-[#e8e6f0]/80 text-[#1a1a2e] text-xs font-bold rounded-xl outline-none cursor-pointer hover:bg-white transition-all shadow-2xs"
        >
          {MONTHS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
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
