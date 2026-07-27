"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export interface ChartDataItem {
  label: string;
  count: number;
}

interface CalibratedBarChartProps {
  title: string;
  subtitle: string;
  data?: ChartDataItem[];
  isLoading?: boolean;
  period?: "Daily" | "Weekly" | "Monthly";
  onPeriodChange?: (period: "Daily" | "Weekly" | "Monthly") => void;
  year?: string;
  onYearChange?: (year: string) => void;
  month?: string;
  onMonthChange?: (month: string) => void;
  highlightIndex?: number;
}

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const DAYS_IN_MONTH: Record<string, number> = {
  January: 31,
  February: 28,
  March: 31,
  April: 30,
  May: 31,
  June: 30,
  July: 31,
  August: 31,
  September: 30,
  October: 31,
  November: 30,
  December: 31,
};

/**
 * Dynamic Y-axis tick calculation based on max data count
 */
function getDynamicYCalibrations(maxCount: number) {
  if (maxCount <= 50) {
    return [
      { label: "50", value: 50 },
      { label: "40", value: 40 },
      { label: "30", value: 30 },
      { label: "20", value: 20 },
      { label: "10", value: 10 },
      { label: "0kg", value: 0 },
    ];
  }
  if (maxCount <= 100) {
    return [
      { label: "100", value: 100 },
      { label: "80", value: 80 },
      { label: "60", value: 60 },
      { label: "40", value: 40 },
      { label: "20", value: 20 },
      { label: "0kg", value: 0 },
    ];
  }
  if (maxCount <= 200) {
    return [
      { label: "200", value: 200 },
      { label: "150", value: 150 },
      { label: "100", value: 100 },
      { label: "50", value: 50 },
      { label: "20", value: 20 },
      { label: "0kg", value: 0 },
    ];
  }
  if (maxCount <= 1000) {
    return [
      { label: "1000", value: 1000 },
      { label: "800", value: 800 },
      { label: "500", value: 500 },
      { label: "200", value: 200 },
      { label: "100", value: 100 },
      { label: "0kg", value: 0 },
    ];
  }
  if (maxCount <= 5000) {
    return [
      { label: "5000", value: 5000 },
      { label: "3000", value: 3000 },
      { label: "2000", value: 2000 },
      { label: "1000", value: 1000 },
      { label: "200", value: 200 },
      { label: "0kg", value: 0 },
    ];
  }
  if (maxCount <= 10000) {
    return [
      { label: "10000", value: 10000 },
      { label: "5000", value: 5000 },
      { label: "2000", value: 2000 },
      { label: "1000", value: 1000 },
      { label: "200", value: 200 },
      { label: "0kg", value: 0 },
    ];
  }
  const top = Math.ceil(maxCount / 5000) * 5000;
  return [
    { label: `${top}`, value: top },
    { label: `${Math.round(top * 0.5)}`, value: Math.round(top * 0.5) },
    { label: `${Math.round(top * 0.2)}`, value: Math.round(top * 0.2) },
    { label: `${Math.round(top * 0.1)}`, value: Math.round(top * 0.1) },
    { label: `${Math.round(top * 0.02)}`, value: Math.round(top * 0.02) },
    { label: "0kg", value: 0 },
  ];
}

/**
 * Piecewise linear interpolation calculating exact bar height percentage (0% - 100%)
 * matching the Y-axis tick mark lines precisely.
 */
function getBarHeightPct(count: number, ticks: { value: number }[]) {
  if (count <= 0) return 0;

  const t1 = ticks[4].value; // e.g. 20 / 100 / 200
  const t2 = ticks[3].value; // e.g. 40 / 200 / 1000
  const t3 = ticks[2].value; // e.g. 60 / 500 / 2000
  const t4 = ticks[1].value; // e.g. 80 / 800 / 5000
  const t5 = ticks[0].value; // e.g. 100 / 1000 / 10000

  if (count <= t1) {
    return (count / (t1 || 1)) * 20;
  }
  if (count <= t2) {
    return 20 + ((count - t1) / (t2 - t1 || 1)) * 20;
  }
  if (count <= t3) {
    return 40 + ((count - t2) / (t3 - t2 || 1)) * 20;
  }
  if (count <= t4) {
    return 60 + ((count - t3) / (t4 - t3 || 1)) * 20;
  }
  if (count <= t5) {
    return 80 + ((count - t4) / (t5 - t4 || 1)) * 20;
  }
  return 100;
}

export default function CalibratedBarChart({
  title,
  subtitle,
  data = [],
  isLoading = false,
  period: controlledPeriod,
  onPeriodChange,
  year: controlledYear,
  onYearChange,
  month: controlledMonth,
  onMonthChange,
  highlightIndex,
}: CalibratedBarChartProps) {
  const [internalPeriod, setInternalPeriod] = useState<
    "Daily" | "Weekly" | "Monthly"
  >("Monthly");
  const [internalYear, setInternalYear] = useState("2026");
  const [internalMonth, setInternalMonth] = useState("July");

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const period = controlledPeriod ?? internalPeriod;
  const year = controlledYear ?? internalYear;
  const month = controlledMonth ?? internalMonth;

  const handlePeriodClick = (p: "Daily" | "Weekly" | "Monthly") => {
    setSelectedIndex(null);
    setHoveredIndex(null);
    if (onPeriodChange) onPeriodChange(p);
    else setInternalPeriod(p);
  };

  const handleYearSelect = (y: string) => {
    setSelectedIndex(null);
    setHoveredIndex(null);
    if (onYearChange) onYearChange(y);
    else setInternalYear(y);
  };

  const handleMonthSelect = (m: string) => {
    setSelectedIndex(null);
    setHoveredIndex(null);
    if (onMonthChange) onMonthChange(m);
    else setInternalMonth(m);
  };

  // Generate fallback period items if empty
  let displayData: ChartDataItem[] = data;
  if (displayData.length === 0) {
    if (period === "Daily") {
      const daysCount = DAYS_IN_MONTH[month] || 30;
      displayData = Array.from({ length: daysCount }).map((_, i) => ({
        label: `Day ${i + 1}`,
        count: i === 5 ? 45 : 0,
      }));
    } else if (period === "Weekly") {
      displayData = [
        { label: "Week 1", count: 15 },
        { label: "Week 2", count: 45 },
        { label: "Week 3", count: 0 },
        { label: "Week 4", count: 0 },
      ];
    } else {
      displayData = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ].map((m, idx) => ({
        label: m,
        count: idx === 5 ? 200 : 0,
      }));
    }
  }

  // Calculate dynamic ticks based on highest value
  const maxCount = displayData.reduce((max, d) => Math.max(max, d.count), 0);
  const yCalibrations = getDynamicYCalibrations(maxCount);

  // Default active highlight index
  const defaultHighlightIdx =
    highlightIndex !== undefined
      ? highlightIndex
      : displayData.findIndex((d) => d.count === maxCount && maxCount > 0);

  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-xs text-left">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-sm font-bold text-[#1a1a2e]">{title}</h3>
          <p className="text-[11px] text-[#9a99b0] font-medium">{subtitle}</p>
        </div>

        {/* Controls: Period Pills + Year & Month Dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Period Pills */}
          <div className="flex items-center bg-white border border-[#e8e6f0] p-0.5 rounded-full">
            {(["Daily", "Weekly", "Monthly"] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => handlePeriodClick(p)}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  period === p
                    ? "bg-[#d92662] text-white shadow-xs"
                    : "text-[#7a7a9a] hover:text-[#1a1a2e]"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Year Dropdown */}
          <div className="relative">
            <select
              value={year}
              onChange={(e) => handleYearSelect(e.target.value)}
              className="h-8 px-3 pr-7 bg-white border border-[#e8e6f0] rounded-xl text-xs font-semibold text-[#5a5a7a] appearance-none focus:outline-none cursor-pointer"
            >
              <option value="2026">2026</option>
              <option value="2025">2025</option>
              <option value="2024">2024</option>
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2.5 top-2.5 text-[#9a99b0] pointer-events-none"
            />
          </div>

          {/* Month Dropdown */}
          <div className="relative">
            <select
              value={month}
              onChange={(e) => handleMonthSelect(e.target.value)}
              className="h-8 px-3 pr-7 bg-white border border-[#e8e6f0] rounded-xl text-xs font-semibold text-[#5a5a7a] appearance-none focus:outline-none cursor-pointer"
            >
              {MONTH_NAMES.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2.5 top-2.5 text-[#9a99b0] pointer-events-none"
            />
          </div>
        </div>
      </div>

      {/* Main Chart Canvas Grid Container */}
      <div className="relative w-full flex items-stretch pt-6">
        {/* Fixed Y-Axis Column (Strictly h-48 to match bars grid) */}
        <div className="w-11 shrink-0 h-48 flex flex-col justify-between text-right pr-2.5 bg-white z-20">
          {yCalibrations.map((cal) => (
            <span
              key={cal.label}
              className="text-[10px] text-[#9a99b0] font-normal leading-none"
            >
              {cal.label}
            </span>
          ))}
        </div>

        {/* Scrollable Canvas for Bars & Labels */}
        <div className="flex-1 relative overflow-x-auto scrollbar-thin">
          {/* Horizontal Dashed Grid Lines */}
          <div className="absolute inset-x-0 top-0 h-48 flex flex-col justify-between pointer-events-none">
            {yCalibrations.map((cal) => (
              <div
                key={cal.label}
                className="w-full border-b border-dashed border-[#e8e6f0]"
              />
            ))}
          </div>

          {/* Canvas Content Container: Bars Grid (h-48) + Labels Row (h-8) */}
          <div
            className={`flex flex-col ${period === "Daily" ? "min-w-[1350px] px-4" : "min-w-full px-2"}`}
          >
            {/* Bars Row (Sits directly on bottom-0 baseline line) */}
            <div className="h-48 flex items-end justify-between gap-3 relative z-10">
              {isLoading
                ? Array.from({ length: period === "Daily" ? 15 : 7 }).map(
                    (_, idx) => (
                      <div
                        key={idx}
                        className="flex-1 flex flex-col items-center h-full justify-end"
                      >
                        <Skeleton className="w-full max-w-[28px] h-36 rounded-t-sm" />
                      </div>
                    ),
                  )
                : displayData.map((item, idx) => {
                    const heightPct = getBarHeightPct(
                      item.count,
                      yCalibrations,
                    );
                    const isHovered = hoveredIndex === idx;
                    const isSelected = selectedIndex === idx;
                    const isDefaultHighlight =
                      selectedIndex === null &&
                      hoveredIndex === null &&
                      (defaultHighlightIdx >= 0
                        ? idx === defaultHighlightIdx
                        : idx === 0);
                    const isActive =
                      isHovered || isSelected || isDefaultHighlight;

                    return (
                      <div
                        key={idx}
                        onClick={() =>
                          setSelectedIndex(idx === selectedIndex ? null : idx)
                        }
                        onMouseEnter={() => setHoveredIndex(idx)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        className="flex-1 min-w-[32px] h-full flex items-end justify-center group cursor-pointer relative"
                      >
                        {/* Bar Fill */}
                        <div
                          className="relative w-full max-w-[38px] flex flex-col justify-end"
                          style={{ height: `${heightPct}%` }}
                        >
                          {/* Floating Tooltip directly above bar */}
                          {(isHovered || isSelected) && (
                            <div className="absolute bottom-[calc(100%+6px)] left-1/2 -translate-x-1/2 z-30 flex flex-col items-center animate-fade-in pointer-events-none">
                              <div className="bg-[#1a1a2e] text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-xl whitespace-nowrap flex items-center gap-1.5 border border-white/10">
                                <span className="text-[#9a99b0]">
                                  {item.label}:
                                </span>
                                <span className="text-[#f472b6] font-extrabold">
                                  {item.count.toLocaleString()}
                                </span>
                              </div>
                              <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-[#1a1a2e]" />
                            </div>
                          )}

                          <div
                            className={`w-full h-full rounded-t-sm transition-all duration-200 ${
                              isActive
                                ? "bg-[#d92662] shadow-md"
                                : item.count > 0
                                  ? "bg-[#fce7f3] hover:bg-[#fbcfe8]"
                                  : "bg-[#fce7f3]/50 hover:bg-[#fce7f3]"
                            }`}
                          />
                        </div>
                      </div>
                    );
                  })}
            </div>

            {/* X-Axis Labels Row (Sits directly BELOW the h-48 baseline line) */}
            <div className="h-8 pt-2.5 flex items-center justify-between gap-3 relative z-10">
              {isLoading
                ? Array.from({ length: period === "Daily" ? 15 : 7 }).map(
                    (_, idx) => (
                      <div
                        key={idx}
                        className="flex-1 min-w-[32px] flex justify-center"
                      >
                        <Skeleton className="h-3 w-6" />
                      </div>
                    ),
                  )
                : displayData.map((item, idx) => {
                    const isHovered = hoveredIndex === idx;
                    const isSelected = selectedIndex === idx;
                    const isDefaultHighlight =
                      selectedIndex === null &&
                      hoveredIndex === null &&
                      (defaultHighlightIdx >= 0
                        ? idx === defaultHighlightIdx
                        : idx === 0);
                    const isActive =
                      isHovered || isSelected || isDefaultHighlight;

                    return (
                      <div
                        key={idx}
                        className="flex-1 min-w-[32px] text-center"
                      >
                        <span
                          className={`text-[10px] whitespace-nowrap transition-colors tracking-tight ${
                            isActive
                              ? "font-bold text-[#d92662]"
                              : "font-medium text-[#9a99b0] group-hover:text-[#1a1a2e]"
                          }`}
                        >
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
