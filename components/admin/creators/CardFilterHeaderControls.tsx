"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type CardPeriod = "all_time" | "daily" | "weekly" | "monthly" | "yearly";

interface CardFilterHeaderControlsProps {
  onPeriodChange?: (period: CardPeriod) => void;
  onYearChange?: (year: number) => void;
  defaultPeriod?: CardPeriod;
  defaultYear?: number;
}

const PERIOD_LABELS: Record<CardPeriod, string> = {
  all_time: "All Time",
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

export function CardFilterHeaderControls({
  onPeriodChange,
  onYearChange,
  defaultPeriod = "all_time",
  defaultYear = 2026,
}: CardFilterHeaderControlsProps) {
  const [period, setPeriod] = useState<CardPeriod>(defaultPeriod);
  const [selectedYear, setSelectedYear] = useState<number>(defaultYear);

  const handlePeriodClick = (p: CardPeriod) => {
    setPeriod(p);
    onPeriodChange?.(p);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const yr = Number(e.target.value);
    setSelectedYear(yr);
    onYearChange?.(yr);
  };

  return (
    <div className="flex items-center gap-2.5 flex-wrap shrink-0">
      {/* Frequency Toggle Buttons: All Time | Daily | Weekly | Monthly */}
      <div className="flex items-center p-1 bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-xl">
        {(["all_time", "daily", "weekly", "monthly"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => handlePeriodClick(p)}
            className={cn(
              "px-2.5 py-1 text-[11px] font-bold rounded-lg capitalize transition-all cursor-pointer",
              period === p
                ? "bg-brand-pink text-white shadow-xs"
                : "text-[#7a7a9a] hover:text-[#1a1a2e]",
            )}
          >
            {PERIOD_LABELS[p]}
          </button>
        ))}
      </div>

      {/* Year Filter Dropdown */}
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-bold text-[#9a99b0] uppercase">
          Year:
        </span>
        <select
          value={selectedYear}
          onChange={handleYearChange}
          className="h-8 px-3 bg-[#faf9fc] border border-[#e8e6f0]/80 text-[#1a1a2e] text-[11px] font-bold rounded-xl outline-none cursor-pointer hover:bg-white transition-all shadow-2xs"
        >
          <option value={2026}>2026</option>
          <option value={2025}>2025</option>
          <option value={2024}>2024</option>
        </select>
      </div>
    </div>
  );
}
