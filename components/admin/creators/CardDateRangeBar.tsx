"use client";

import { useState } from "react";

interface CardDateRangeBarProps {
  onDateChange?: (from: string, to: string) => void;
  className?: string;
}

export function CardDateRangeBar({
  onDateChange,
  className = "",
}: CardDateRangeBarProps) {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newFrom = e.target.value;
    setFromDate(newFrom);
    onDateChange?.(newFrom, toDate);
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTo = e.target.value;
    setToDate(newTo);
    onDateChange?.(fromDate, newTo);
  };

  return (
    <div
      className={`flex items-center gap-2 bg-[#faf9fc] border border-[#e8e6f0]/60 rounded-xl p-1.5 text-[11px] font-semibold text-[#1a1a2e] ${className}`}
    >
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-[#9a99b0] font-bold uppercase pl-1">
          From:
        </span>
        <input
          type="date"
          value={fromDate}
          onChange={handleFromChange}
          className="h-7 px-2 bg-white border border-[#e8e6f0] rounded-lg text-[10px] font-medium outline-none text-[#1a1a2e] focus:border-brand-pink transition-colors"
        />
      </div>
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] text-[#9a99b0] font-bold uppercase">
          To:
        </span>
        <input
          type="date"
          value={toDate}
          onChange={handleToChange}
          className="h-7 px-2 bg-white border border-[#e8e6f0] rounded-lg text-[10px] font-medium outline-none text-[#1a1a2e] focus:border-brand-pink transition-colors"
        />
      </div>
    </div>
  );
}
