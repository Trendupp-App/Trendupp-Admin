"use client";

import { useState } from "react";
import { Calendar, Download, ChevronDown } from "lucide-react";

export type ReportTab =
  "creator" | "advertiser" | "paid_campaigns" | "social_campaigns" | "finance";

export type ModeType = "internal" | "external";

interface AnalyticsHeaderProps {
  activeTab: ReportTab;
  onTabChange: (tab: ReportTab) => void;
  activeMode: ModeType;
  onModeChange: (mode: ModeType) => void;
  dateRange: string;
  onDateRangeChange: (range: string) => void;
}

export default function AnalyticsHeader({
  activeTab,
  onTabChange,
  activeMode,
  onModeChange,
  dateRange,
  onDateRangeChange,
}: AnalyticsHeaderProps) {
  const [isDateOpen, setIsDateOpen] = useState(false);

  const tabs: { key: ReportTab; label: string; disabled?: boolean }[] = [
    { key: "creator", label: "Creator Analytics" },
    { key: "advertiser", label: "Advertiser Analytics" },
    { key: "paid_campaigns", label: "Paid Campaigns" },
    {
      key: "social_campaigns",
      label: "Social Impact Campaigns",
      disabled: true,
    },
    { key: "finance", label: "Financial Analytics", disabled: true },
  ];

  const dateOptions = [
    "Last 7 Days",
    "Last 30 Days",
    "Last 90 Days",
    "This Month",
    "Last Month",
  ];

  return (
    <div className="flex flex-col gap-5 text-left">
      {/* Top Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#1a1a2e]">Report Analytics</h1>
          <p className="text-xs text-[#9a99b0] font-medium mt-0.5">
            Track, measure, and analyze performance metrics across the platform.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Date Selector */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsDateOpen(!isDateOpen)}
              className="h-9.5 px-3.5 bg-white border border-[#e8e6f0] rounded-xl text-xs font-bold text-[#1a1a2e] flex items-center gap-2 hover:bg-[#faf9fc] transition-colors cursor-pointer"
            >
              <Calendar size={14} className="text-[#9a99b0]" />
              <span>{dateRange}</span>
              <ChevronDown size={14} className="text-[#9a99b0]" />
            </button>

            {isDateOpen && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-[#e8e6f0] rounded-2xl shadow-xl p-1 z-20 flex flex-col">
                {dateOptions.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => {
                      onDateRangeChange(opt);
                      setIsDateOpen(false);
                    }}
                    className={`px-3 py-2 rounded-xl text-xs font-semibold text-left transition-colors cursor-pointer ${
                      dateRange === opt
                        ? "bg-brand-pink-light text-brand-pink font-bold"
                        : "text-[#5a5a7a] hover:bg-[#faf9fc]"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Export Button */}
          <button
            type="button"
            className="h-9.5 px-4 bg-white border border-[#e8e6f0] rounded-xl text-xs font-bold text-[#1a1a2e] flex items-center gap-2 hover:bg-[#faf9fc] transition-colors cursor-pointer shadow-xs"
          >
            <Download size={14} className="text-[#5a5a7a]" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Mode Toggle Pills: Internal vs External */}
      <div className="flex items-center gap-2 bg-[#f4f3f6] p-1 rounded-2xl w-fit border border-[#e8e6f0]/60">
        <button
          onClick={() => onModeChange("internal")}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeMode === "internal"
              ? "bg-brand-pink text-white shadow-xs"
              : "text-[#5a5a7a] hover:text-[#1a1a2e]"
          }`}
        >
          Internal Analytics
        </button>
        <button
          onClick={() => onModeChange("external")}
          className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeMode === "external"
              ? "bg-brand-pink text-white shadow-xs"
              : "text-[#5a5a7a] hover:text-[#1a1a2e]"
          }`}
        >
          External Analytics
        </button>
      </div>

      {/* Sub-Tabs Navigation */}
      <div className="flex items-center gap-6 border-b border-[#e8e6f0]/80 overflow-x-auto scrollbar-none pt-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              disabled={tab.disabled}
              onClick={() => !tab.disabled && onTabChange(tab.key)}
              className={`pb-3 text-xs font-bold transition-all border-b-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? "border-brand-pink text-brand-pink"
                  : tab.disabled
                    ? "border-transparent text-[#b0aec8] cursor-not-allowed opacity-50"
                    : "border-transparent text-[#7a7a9a] hover:text-[#1a1a2e]"
              }`}
            >
              {tab.label}
              {tab.disabled && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-semibold bg-[#f4f3f6] text-[#9a99b0]">
                  Soon
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
