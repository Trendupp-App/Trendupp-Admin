"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type CardPeriod = "daily" | "weekly" | "monthly" | "yearly";

interface CardFilterHeaderControlsProps {
  /** Controlled value — when provided the component is controlled */
  period?: CardPeriod;
  /** Controlled value — when provided the component is controlled */
  selectedYear?: number;
  onPeriodChange?: (period: CardPeriod) => void;
  onYearChange?: (year: number) => void;
  /** Uncontrolled initial value (ignored when `period` prop is supplied) */
  defaultPeriod?: CardPeriod;
  /** Uncontrolled initial value (ignored when `selectedYear` prop is supplied) */
  defaultYear?: number;
}

const PERIOD_LABELS: Record<CardPeriod, string> = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  yearly: "Yearly",
};

export function CardFilterHeaderControls({
  period: controlledPeriod,
  selectedYear: controlledYear,
  onPeriodChange,
  onYearChange,
  defaultPeriod = "monthly",
  defaultYear = new Date().getFullYear(),
}: CardFilterHeaderControlsProps) {
  const [internalPeriod, setInternalPeriod] =
    useState<CardPeriod>(defaultPeriod);
  const [internalYear, setInternalYear] = useState<number>(defaultYear);

  // Use controlled values when provided, otherwise fall back to internal state
  const period = controlledPeriod ?? internalPeriod;
  const selectedYear = controlledYear ?? internalYear;

  const handlePeriodClick = (p: CardPeriod) => {
    if (controlledPeriod === undefined) setInternalPeriod(p);
    onPeriodChange?.(p);
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const yr = Number(e.target.value);
    if (controlledYear === undefined) setInternalYear(yr);
    onYearChange?.(yr);
  };

  return (
    <div className="flex items-center gap-2.5 flex-wrap shrink-0">
      {/* Period Pills */}
      <div className="flex items-center p-1 bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-xl flex-wrap">
        {(["daily", "weekly", "monthly", "yearly"] as const).map((p) => (
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

      {/* Year Dropdown — hidden when yearly (all years shown on x-axis) */}
      {period !== "yearly" && (
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
      )}
    </div>
  );
}
