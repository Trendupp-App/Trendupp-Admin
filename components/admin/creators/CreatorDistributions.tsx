"use client";

import { useState } from "react";
import {
  useCreatorNicheBreakdown,
  useCreatorCountryBreakdown,
} from "@/hooks/useAdminCreators";

interface DistributionItem {
  label: string;
  count: number;
  pct: number;
}

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

interface CardProps {
  title: string;
  sub: string;
  items: DistributionItem[];
  badgeBg: string;
  badgeText: string;
  showPercentageText?: boolean;
  isLoading?: boolean;
  selectedMonth?: number;
  onMonthChange?: (month: number) => void;
}

function DistributionCard({
  title,
  sub,
  items,
  badgeBg,
  badgeText,
  showPercentageText = false,
  isLoading = false,
  selectedMonth,
  onMonthChange,
}: CardProps) {
  return (
    <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-5 flex flex-col gap-4 shadow-xs">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-xs font-bold text-[#1a1a2e] uppercase tracking-wider">
            {title}
          </h3>
          <span className="text-[10px] text-[#9a99b0] font-medium">{sub}</span>
        </div>

        {selectedMonth !== undefined && onMonthChange && (
          <select
            value={selectedMonth}
            onChange={(e) => onMonthChange(Number(e.target.value))}
            className="h-8 px-3 bg-[#faf9fc] border border-[#e8e6f0]/80 text-[#1a1a2e] text-xs font-bold rounded-xl outline-none cursor-pointer hover:bg-white transition-all shadow-2xs"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="flex flex-col gap-3.5 max-h-[260px] overflow-y-auto pr-1">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex flex-col gap-2 animate-pulse">
              <div className="flex justify-between items-center">
                <div className="w-16 h-4 rounded-md bg-[#e8e6f0]/60" />
                <div className="w-10 h-3.5 rounded-md bg-[#e8e6f0]/60" />
              </div>
              <div className="w-full h-1.5 bg-[#e8e6f0]/40 rounded-full" />
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="py-6 text-center text-xs text-[#9a99b0]">
            No data available.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.label} className="flex flex-col gap-1.5">
              <div className="flex justify-between items-center text-xs">
                <span
                  className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider ${badgeBg} ${badgeText}`}
                >
                  {item.label}
                </span>
                <span className="font-bold text-[#1a1a2e]">
                  {item.count.toLocaleString()}{" "}
                  <span className="text-[#9a99b0] font-normal">
                    ({item.pct}%)
                  </span>
                </span>
              </div>

              <div className="w-full h-1.5 bg-[#f4f3f6] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-brand-pink transition-all duration-500"
                  style={{ width: `${item.pct}%` }}
                />
              </div>

              {showPercentageText && (
                <span className="text-[8px] font-bold text-brand-pink -mt-0.5">
                  {item.pct}%
                </span>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function CreatorNicheCard() {
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth() + 1,
  );
  const selectedYear = new Date().getFullYear();

  const monthStr = String(selectedMonth).padStart(2, "0");
  const startDate = `${selectedYear}-${monthStr}-01`;
  const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
  const endDate = `${selectedYear}-${monthStr}-${String(lastDay).padStart(2, "0")}`;

  const { data: nicheData, isLoading: isLoadingNiche } =
    useCreatorNicheBreakdown({
      period: "monthly",
      year: selectedYear,
      month: selectedMonth,
      startDate,
      endDate,
    });

  const nichesList: DistributionItem[] = nicheData?.length
    ? nicheData.map((n) => ({
        label: n.niche,
        count: n.count,
        pct: Math.round(n.percentage),
      }))
    : [];

  return (
    <DistributionCard
      title="Niche"
      sub="5 Total Niches"
      items={nichesList}
      badgeBg="bg-[#fdf2f6]"
      badgeText="text-brand-pink"
      showPercentageText
      isLoading={isLoadingNiche}
      selectedMonth={selectedMonth}
      onMonthChange={setSelectedMonth}
    />
  );
}

export function CreatorCountryCard() {
  const { data: countryData, isLoading: isLoadingCountry } =
    useCreatorCountryBreakdown();

  const countriesList: DistributionItem[] = countryData?.length
    ? countryData.map((c) => ({
        label: c.country,
        count: c.count,
        pct: Math.round(c.percentage),
      }))
    : [
        { label: "Nigeria", count: 1842, pct: 48 },
        { label: "Ghana", count: 1204, pct: 31 },
        { label: "Kenya", count: 687, pct: 18 },
        { label: "Togo", count: 687, pct: 18 },
        { label: "Benin Republic", count: 687, pct: 18 },
        { label: "Uganda", count: 687, pct: 18 },
      ];

  return (
    <DistributionCard
      title="Country"
      sub="5 Total Country"
      items={countriesList}
      badgeBg="bg-[#fdf2f6]"
      badgeText="text-brand-pink"
      isLoading={isLoadingCountry}
    />
  );
}

export default function CreatorDistributions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <CreatorNicheCard />
      <CreatorCountryCard />
    </div>
  );
}
