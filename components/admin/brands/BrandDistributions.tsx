"use client";

import { useMemo } from "react";
import {
  useBrandIndustryBreakdown,
  useBrandCountryBreakdown,
} from "@/hooks/useAdminBrands";

export default function BrandDistributions() {
  const { data: industryData, isLoading: isLoadingIndustry } =
    useBrandIndustryBreakdown();
  const { data: countryData, isLoading: isLoadingCountry } =
    useBrandCountryBreakdown();

  const industries = useMemo(() => {
    if (
      industryData &&
      Array.isArray(industryData) &&
      industryData.length > 0
    ) {
      return industryData.map((item) => ({
        label: item.industry,
        count: item.count,
        pct: item.percentage,
      }));
    }
    return [
      { label: "Tech", count: 1842, pct: 48 },
      { label: "Fashion", count: 1204, pct: 31 },
      { label: "Beauty", count: 687, pct: 18 },
      { label: "Food & Beverage", count: 114, pct: 3 },
      { label: "Finance", count: 114, pct: 3 },
    ];
  }, [industryData]);

  const countries = useMemo(() => {
    if (countryData && Array.isArray(countryData) && countryData.length > 0) {
      return countryData.map((item) => ({
        label: item.country,
        count: item.count,
        pct: item.percentage,
      }));
    }
    return [
      { label: "Nigeria", count: 1842, pct: 48 },
      { label: "Ghana", count: 1204, pct: 31 },
      { label: "Kenya", count: 687, pct: 18 },
      { label: "Togo", count: 114, pct: 3 },
      { label: "Benin Republic", count: 134, pct: 3.5 },
      { label: "Uganda", count: 114, pct: 3 },
    ];
  }, [countryData]);

  if (isLoadingIndustry || isLoadingCountry) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, idx) => (
          <div
            key={idx}
            className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-4 animate-pulse"
          >
            <div className="w-28 h-4 bg-[#e8e6f0]/60 rounded-md" />
            <div className="w-20 h-3 bg-[#e8e6f0]/40 rounded-md mb-2" />
            <div className="flex flex-col gap-3.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-1.5">
                  <div className="flex justify-between">
                    <div className="w-16 h-3.5 bg-[#e8e6f0]/60 rounded-md" />
                    <div className="w-12 h-3.5 bg-[#e8e6f0]/60 rounded-md" />
                  </div>
                  <div className="w-full h-2 bg-[#f4f3f6] rounded-full overflow-hidden">
                    <div className="h-full bg-[#e8e6f0]/60 rounded-full w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Industry Card */}
      <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1a1a2e]">Industry</h3>
            <span className="text-[11px] text-[#9a99b0]">5 Industry</span>
          </div>
          <div className="flex items-center gap-2">
            <select className="h-8 px-2.5 bg-[#faf9fc] border border-[#e8e6f0]/60 text-[#1a1a2e] text-[11px] font-semibold rounded-xl outline-none cursor-pointer">
              <option>Custom</option>
            </select>
            <div className="h-8 px-3 bg-[#faf9fc] border border-[#e8e6f0]/60 text-[#5a5a7a] text-[11px] font-semibold rounded-xl flex items-center gap-1.5">
              📅 1 Jun, 2025 - 30 Jun, 2025
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3.5">
          {industries.map((item) => (
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
          ))}
        </div>
      </div>

      {/* Country Card */}
      <div className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#1a1a2e]">Country</h3>
            <span className="text-[11px] text-[#9a99b0]">5 Total Country</span>
          </div>
          <select className="h-8 px-2.5 bg-[#faf9fc] border border-[#e8e6f0]/60 text-[#1a1a2e] text-[11px] font-semibold rounded-xl outline-none cursor-pointer">
            <option>This Month</option>
          </select>
        </div>

        <div className="flex flex-col gap-3.5">
          {countries.map((item) => (
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
          ))}
        </div>
      </div>
    </div>
  );
}
