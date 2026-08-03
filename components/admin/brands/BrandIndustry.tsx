"use client";

import { useState, useMemo } from "react";
import { useBrandIndustryBreakdown } from "@/hooks/useAdminBrands";

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

export default function BrandIndustry() {
  const currentMonth = useMemo(() => new Date().getMonth() + 1, []);
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth);
  const selectedYear = useMemo(() => new Date().getFullYear(), []);

  const monthStr = String(selectedMonth).padStart(2, "0");
  const startDate = `${selectedYear}-${monthStr}-01`;
  const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
  const endDate = `${selectedYear}-${monthStr}-${String(lastDay).padStart(2, "0")}`;

  const { data, isLoading } = useBrandIndustryBreakdown({
    period: "monthly",
    year: selectedYear,
    month: selectedMonth,
    startDate,
    endDate,
  });

  const industries = (data ?? []).map((i) => ({
    name: i.industry,
    count: i.count,
    pct: Math.min(100, Math.round(i.percentage)),
  }));

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-[#1a1a2e]">Industry</h2>
          <span className="text-[10px] text-[#9a99b0] font-medium">
            {industries.length} industr{industries.length === 1 ? "y" : "ies"}
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

      {isLoading ? (
        <div className="flex flex-col gap-3.5 animate-pulse py-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-full h-6 bg-[#faf9fc] rounded-xl" />
          ))}
        </div>
      ) : industries.length === 0 ? (
        <p className="text-xs text-[#9a99b0] text-center py-6">
          No industry data available for this month.
        </p>
      ) : (
        <div className="flex flex-col gap-3.5 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
          {industries.map((ind) => (
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
      )}
    </section>
  );
}
