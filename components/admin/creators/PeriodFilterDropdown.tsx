"use client";

import { useState, useRef, useEffect } from "react";
import { Calendar, ChevronDown } from "lucide-react";

export type PeriodOption =
  | "All Time"
  | "Today"
  | "This Week"
  | "This Month"
  | "This Year"
  | "Custom Range";

interface PeriodFilterDropdownProps {
  value?: string;
  onChange?: (
    period: string,
    customRange?: { from: string; to: string },
  ) => void;
}

export function PeriodFilterDropdown({
  value = "All Time",
  onChange,
}: PeriodFilterDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(value);
  const [showCustomInputs, setShowCustomInputs] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowCustomInputs(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const options: PeriodOption[] = [
    "All Time",
    "Today",
    "This Week",
    "This Month",
    "This Year",
    "Custom Range",
  ];

  const handleSelect = (opt: PeriodOption) => {
    if (opt === "Custom Range") {
      setShowCustomInputs(true);
    } else {
      setSelectedPeriod(opt);
      setShowCustomInputs(false);
      setIsOpen(false);
      onChange?.(opt);
    }
  };

  const handleApplyCustom = () => {
    if (fromDate && toDate) {
      const label = `${fromDate} to ${toDate}`;
      setSelectedPeriod(label);
      setIsOpen(false);
      setShowCustomInputs(false);
      onChange?.("Custom Range", { from: fromDate, to: toDate });
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-7 px-2.5 bg-[#faf9fc] border border-[#e8e6f0]/80 text-[#1a1a2e] text-[10px] font-bold rounded-xl hover:bg-white hover:border-[#d5d3e2] transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
      >
        <Calendar size={12} className="text-[#7a7a9a]" />
        <span className="truncate max-w-[120px]">{selectedPeriod}</span>
        <ChevronDown size={11} className="text-[#7a7a9a] shrink-0" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-48 bg-white border border-[#e8e6f0] rounded-2xl shadow-xl p-1.5 z-30 flex flex-col gap-0.5 animate-fade-in-up">
          <div className="px-2.5 py-1 text-[9px] font-bold text-[#9a99b0] uppercase tracking-wider">
            Filter by Period
          </div>

          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => handleSelect(opt)}
              className={`w-full px-2.5 py-1.5 rounded-xl text-[11px] font-semibold text-left transition-colors cursor-pointer flex items-center justify-between ${
                selectedPeriod === opt ||
                (opt === "Custom Range" && showCustomInputs)
                  ? "bg-brand-pink-light text-brand-pink font-bold"
                  : "text-[#4a4a68] hover:bg-[#faf9fc] hover:text-[#1a1a2e]"
              }`}
            >
              <span>{opt}</span>
              {selectedPeriod === opt && (
                <span className="w-1.5 h-1.5 rounded-full bg-brand-pink" />
              )}
            </button>
          ))}

          {showCustomInputs && (
            <div className="mt-1 pt-2 border-t border-[#e8e6f0]/60 flex flex-col gap-2 p-1.5 bg-[#faf9fc] rounded-xl">
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-[#7a7a9a]">
                  From
                </label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="h-6.5 px-2 bg-white border border-[#e8e6f0] rounded-lg text-[10px] font-medium outline-none text-[#1a1a2e]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[9px] font-bold text-[#7a7a9a]">
                  To
                </label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="h-6.5 px-2 bg-white border border-[#e8e6f0] rounded-lg text-[10px] font-medium outline-none text-[#1a1a2e]"
                />
              </div>
              <button
                type="button"
                disabled={!fromDate || !toDate}
                onClick={handleApplyCustom}
                className="h-6.5 mt-0.5 w-full bg-brand-pink hover:bg-brand-pink/90 disabled:opacity-50 text-white text-[10px] font-bold rounded-lg transition-colors cursor-pointer flex items-center justify-center"
              >
                Apply Range
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
