"use client";

import { useState, useMemo } from "react";
import {
  useBrandIndustryBreakdown,
  useBrandCountryBreakdown,
} from "@/hooks/useAdminBrands";

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

export default function BrandDistributions() {
  const currentMonth = useMemo(() => new Date().getMonth() + 1, []);
  const [selectedIndustryMonth, setSelectedIndustryMonth] =
    useState<number>(currentMonth);
  const [selectedCountryMonth, setSelectedCountryMonth] =
    useState<number>(currentMonth);

  const selectedYear = useMemo(() => new Date().getFullYear(), []);

  // Compute Industry Query Params
  const indMonthStr = String(selectedIndustryMonth).padStart(2, "0");
  const indStartDate = `${selectedYear}-${indMonthStr}-01`;
  const indLastDay = new Date(selectedYear, selectedIndustryMonth, 0).getDate();
  const indEndDate = `${selectedYear}-${indMonthStr}-${String(indLastDay).padStart(2, "0")}`;

  const { data: industryData, isLoading: isLoadingIndustry } =
    useBrandIndustryBreakdown({
      period: "monthly",
      year: selectedYear,
      month: selectedIndustryMonth,
      startDate: indStartDate,
      endDate: indEndDate,
    });

  // Compute Country Query Params
  const cntMonthStr = String(selectedCountryMonth).padStart(2, "0");
  const cntStartDate = `${selectedYear}-${cntMonthStr}-01`;
  const cntLastDay = new Date(selectedYear, selectedCountryMonth, 0).getDate();
  const cntEndDate = `${selectedYear}-${cntMonthStr}-${String(cntLastDay).padStart(2, "0")}`;

  const { data: countryData, isLoading: isLoadingCountry } =
    useBrandCountryBreakdown({
      period: "monthly",
      year: selectedYear,
      month: selectedCountryMonth,
      startDate: cntStartDate,
      endDate: cntEndDate,
    });

  const industries = useMemo(() => {
    if (
      industryData &&
      Array.isArray(industryData) &&
      industryData.length > 0
    ) {
      return industryData.map((item) => ({
        label: item.industry,
        count: item.count,
        pct: Math.round(item.percentage),
      }));
    }
    return [];
  }, [industryData]);

  const countries = useMemo(() => {
    if (countryData && Array.isArray(countryData) && countryData.length > 0) {
      return countryData.map((item) => ({
        label: item.country,
        count: item.count,
        pct: Math.round(item.percentage),
      }));
    }
    return [];
  }, [countryData]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Industry Card */}
      <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#1a1a2e]">Industry</h3>
            <span className="text-[11px] text-[#9a99b0]">
              {industries.length} Industry Breakdown
            </span>
          </div>

          <select
            value={selectedIndustryMonth}
            onChange={(e) => setSelectedIndustryMonth(Number(e.target.value))}
            className="h-8 px-3 bg-[#faf9fc] border border-[#e8e6f0]/80 text-[#1a1a2e] text-xs font-bold rounded-xl outline-none cursor-pointer hover:bg-white transition-all shadow-2xs"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3.5 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
          {isLoadingIndustry ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5 animate-pulse">
                <div className="flex justify-between">
                  <div className="w-16 h-3.5 bg-[#e8e6f0]/60 rounded-md" />
                  <div className="w-12 h-3.5 bg-[#e8e6f0]/60 rounded-md" />
                </div>
                <div className="w-full h-1.5 bg-[#f4f3f6] rounded-full overflow-hidden" />
              </div>
            ))
          ) : industries.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#9a99b0]">
              No industry data available for this month.
            </div>
          ) : (
            industries.map((item) => (
              <div key={item.label} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-[#fdf2f6] text-brand-pink">
                    {item.label}
                  </span>
                  <span className="font-bold text-[#1a1a2e]">
                    {item.count.toLocaleString()}
                  </span>
                </div>

                <div className="w-full h-1.5 bg-[#f4f3f6] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-pink transition-all duration-500"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Country Card */}
      <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[#1a1a2e]">Country</h3>
            <span className="text-[11px] text-[#9a99b0]">
              {countries.length} Total Countries
            </span>
          </div>

          <select
            value={selectedCountryMonth}
            onChange={(e) => setSelectedCountryMonth(Number(e.target.value))}
            className="h-8 px-3 bg-[#faf9fc] border border-[#e8e6f0]/80 text-[#1a1a2e] text-xs font-bold rounded-xl outline-none cursor-pointer hover:bg-white transition-all shadow-2xs"
          >
            {MONTHS.map((m) => (
              <option key={m.value} value={m.value}>
                {m.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-3.5 max-h-[340px] overflow-y-auto pr-1 scrollbar-thin">
          {isLoadingCountry ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-1.5 animate-pulse">
                <div className="flex justify-between">
                  <div className="w-16 h-3.5 bg-[#e8e6f0]/60 rounded-md" />
                  <div className="w-12 h-3.5 bg-[#e8e6f0]/60 rounded-md" />
                </div>
                <div className="w-full h-1.5 bg-[#f4f3f6] rounded-full overflow-hidden" />
              </div>
            ))
          ) : countries.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#9a99b0]">
              No country data available for this month.
            </div>
          ) : (
            countries.map((item) => (
              <div key={item.label} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider bg-[#fdf2f6] text-brand-pink">
                    {item.label}
                  </span>
                  <span className="font-bold text-[#1a1a2e]">
                    {item.count.toLocaleString()}
                  </span>
                </div>

                <div className="w-full h-1.5 bg-[#f4f3f6] rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-brand-pink transition-all duration-500"
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
