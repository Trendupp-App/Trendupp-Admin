"use client";

import { useState } from "react";
import { Search, Eye, ChevronDown } from "lucide-react";
import { FaTiktok, FaInstagram, FaYoutube } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { AdminStatusBadge } from "../AdminStatusBadge";
import BrandProfileDrawer from "./BrandProfileDrawer";

const PepsiLogo = () => (
  <svg
    viewBox="0 0 100 100"
    className="w-7 h-7 rounded-full overflow-hidden shadow-sm shrink-0"
  >
    <path
      d="M 50,5 A 45,45 0 0 1 95,50 C 95,50 80,35 50,45 C 20,55 5,50 5,50 A 45,45 0 0 1 50,5 Z"
      fill="#E31837"
    />
    <path
      d="M 50,95 A 45,45 0 0 1 5,50 C 5,50 20,55 50,45 C 80,35 95,50 95,50 A 45,45 0 0 1 50,95 Z"
      fill="#004B87"
    />
    <path
      d="M 5,50 C 5,50 20,55 50,45 C 80,35 95,50 95,50 C 95,50 78,28 50,38 C 22,48 5,50 5,50 Z"
      fill="#FFFFFF"
    />
  </svg>
);

interface BrandItem {
  id: string;
  name: string;
  repName: string;
  repEmail: string;
  industry: string;
  location: string;
  platforms: ("IG" | "TikTok" | "YT")[];
  completion: number;
  status: "Active" | "Pending" | "Suspended";
  campaigns: number;
  joined: string;
}

const MOCK_BRANDS: BrandItem[] = [
  {
    id: "1",
    name: "Pepsi Nigeria",
    repName: "Emeka Obi",
    repEmail: "emeka@pepsi.ng",
    industry: "Beverages",
    location: "Lagos, Nigeria",
    platforms: ["IG", "TikTok"],
    completion: 100,
    status: "Active",
    campaigns: 14,
    joined: "Oct 2023",
  },
  {
    id: "2",
    name: "Pepsi Nigeria",
    repName: "Emeka Obi",
    repEmail: "emeka@pepsi.ng",
    industry: "Beverages",
    location: "Lagos, Nigeria",
    platforms: ["IG", "TikTok"],
    completion: 80,
    status: "Active",
    campaigns: 14,
    joined: "Oct 2023",
  },
  {
    id: "3",
    name: "Pepsi Nigeria",
    repName: "Emeka Obi",
    repEmail: "emeka@pepsi.ng",
    industry: "Beverages",
    location: "Lagos, Nigeria",
    platforms: ["IG", "TikTok"],
    completion: 100,
    status: "Active",
    campaigns: 14,
    joined: "Oct 2023",
  },
  {
    id: "4",
    name: "Pepsi Nigeria",
    repName: "Emeka Obi",
    repEmail: "emeka@pepsi.ng",
    industry: "Beverages",
    location: "Lagos, Nigeria",
    platforms: ["IG", "TikTok"],
    completion: 100,
    status: "Active",
    campaigns: 14,
    joined: "Oct 2023",
  },
  {
    id: "5",
    name: "Pepsi Nigeria",
    repName: "Emeka Obi",
    repEmail: "emeka@pepsi.ng",
    industry: "Beverages",
    location: "Lagos, Nigeria",
    platforms: ["IG", "TikTok"],
    completion: 60,
    status: "Pending",
    campaigns: 14,
    joined: "Oct 2023",
  },
  {
    id: "6",
    name: "Pepsi Nigeria",
    repName: "Emeka Obi",
    repEmail: "emeka@pepsi.ng",
    industry: "Beverages",
    location: "Lagos, Nigeria",
    platforms: ["IG", "TikTok"],
    completion: 100,
    status: "Active",
    campaigns: 14,
    joined: "Oct 2023",
  },
  {
    id: "7",
    name: "Pepsi Nigeria",
    repName: "Emeka Obi",
    repEmail: "emeka@pepsi.ng",
    industry: "Beverages",
    location: "Lagos, Nigeria",
    platforms: ["IG", "TikTok"],
    completion: 40,
    status: "Suspended",
    campaigns: 14,
    joined: "Oct 2023",
  },
];

export default function BrandTable() {
  const [activeTab, setActiveTab] = useState<
    "All" | "Active" | "Suspended" | "Pending"
  >("All");
  const [search, setSearch] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("");
  const [selectedCompletion, setSelectedCompletion] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedTimeframe, setSelectedTimeframe] = useState<
    "Week" | "Month" | "Year"
  >("Week");
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null);

  const filtered = MOCK_BRANDS.filter((b) => {
    if (activeTab !== "All" && b.status !== activeTab) return false;
    if (
      search &&
      !b.name.toLowerCase().includes(search.toLowerCase()) &&
      !b.repName.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (selectedIndustry && b.industry !== selectedIndustry) return false;
    if (selectedStatus && b.status !== selectedStatus) return false;
    if (selectedCountry && !b.location.includes(selectedCountry)) return false;
    return true;
  });

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5">
      <div className="flex border-b border-[#e8e6f0]/40 pb-0 overflow-x-auto shrink-0 scrollbar-none">
        {(["All", "Active", "Suspended", "Pending"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-5 py-3 text-xs font-semibold border-b-2 transition-all cursor-pointer whitespace-nowrap",
              activeTab === tab
                ? "border-brand-pink text-brand-pink"
                : "border-transparent text-[#7a7a9a] hover:text-[#1a1a2e]",
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-0">
          <div className="relative flex items-center min-w-[240px] flex-1 max-w-sm">
            <Search size={14} className="absolute left-3.5 text-[#9a99b0]" />
            <input
              type="text"
              placeholder="Search by brand, rep name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full bg-white border border-[#e8e6f0] rounded-xl pl-9 pr-4 text-xs text-[#1a1a2e] placeholder-[#9a99b0] focus:outline-none focus:ring-1 focus:ring-brand-pink/30"
            />
          </div>

          {[
            {
              value: selectedIndustry,
              onChange: setSelectedIndustry,
              label: "Industry",
              options: ["Beverages", "Tech", "Fashion"],
            },
            {
              value: selectedCompletion,
              onChange: setSelectedCompletion,
              label: "Completion",
              options: ["100%", "80%", "60%", "40%"],
            },
            {
              value: selectedStatus,
              onChange: setSelectedStatus,
              label: "Status",
              options: ["Active", "Pending", "Suspended"],
            },
            {
              value: selectedCountry,
              onChange: setSelectedCountry,
              label: "Country",
              options: ["Nigeria", "Ghana", "Kenya"],
            },
            {
              value: selectedYear,
              onChange: setSelectedYear,
              label: "Year",
              options: ["2026", "2025", "2024"],
            },
          ].map(({ value, onChange, label, options }) => (
            <div key={label} className="relative">
              <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-9 pl-4 pr-9 rounded-xl bg-white border border-[#e8e6f0] text-xs font-semibold text-[#1a1a2e] focus:outline-none focus:ring-1 focus:ring-brand-pink/30 cursor-pointer appearance-none"
              >
                <option value="">{label}</option>
                {options.map((o) => (
                  <option key={o} value={o}>
                    {o}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={13}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9a99b0] pointer-events-none"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center bg-[#f4f3f6] rounded-xl p-0.5 border border-[#e8e6f0]/60 shrink-0">
          {(["Week", "Month", "Year"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTimeframe(t)}
              className={cn(
                "px-3.5 py-1.5 rounded-lg text-[10px] font-bold transition-all cursor-pointer",
                selectedTimeframe === t
                  ? "bg-white text-brand-pink shadow-sm"
                  : "text-[#7a7a9a] hover:text-[#1a1a2e]",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 px-6">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#e8e6f0]/40 text-[10px] font-bold text-[#9a99b0] uppercase tracking-wider">
              <th className="pb-3.5 pl-2">Brand</th>
              <th className="pb-3.5">Representative</th>
              <th className="pb-3.5">Industry</th>
              <th className="pb-3.5">Location</th>
              <th className="pb-3.5">Platforms</th>
              <th className="pb-3.5">Completion</th>
              <th className="pb-3.5">Status</th>
              <th className="pb-3.5">Campaigns</th>
              <th className="pb-3.5">Joined</th>
              <th className="pb-3.5 text-right pr-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e6f0]/30 text-xs">
            {filtered.map((b) => (
              <tr
                key={b.id}
                className="hover:bg-[#faf9fc]/40 transition-colors"
              >
                <td className="py-3.5 pl-2">
                  <div className="flex items-center gap-2">
                    <PepsiLogo />
                    <span className="font-semibold text-[#1a1a2e]">
                      {b.name}
                    </span>
                  </div>
                </td>
                <td className="py-3.5">
                  <div className="flex flex-col">
                    <span className="font-semibold text-[#1a1a2e]">
                      {b.repName}
                    </span>
                    <span className="text-[10px] text-[#9a99b0]">
                      {b.repEmail}
                    </span>
                  </div>
                </td>
                <td className="py-3.5 font-medium text-[#5a5a7a]">
                  {b.industry}
                </td>
                <td className="py-3.5 font-medium text-[#5a5a7a]">
                  {b.location}
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-1.5">
                    {b.platforms.map((p) => {
                      if (p === "IG")
                        return (
                          <FaInstagram
                            key={p}
                            className="text-[#e1306c]"
                            size={14}
                          />
                        );
                      if (p === "TikTok")
                        return (
                          <FaTiktok
                            key={p}
                            className="text-[#000000]"
                            size={12}
                          />
                        );
                      return (
                        <FaYoutube
                          key={p}
                          className="text-[#ff0000]"
                          size={14}
                        />
                      );
                    })}
                  </div>
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2 max-w-[120px]">
                    <div className="w-full h-1.5 bg-[#f4f3f6] rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          b.completion === 100
                            ? "bg-[#16a34a]"
                            : b.completion >= 60
                              ? "bg-[#eab308]"
                              : "bg-[#dc2626]",
                        )}
                        style={{ width: `${b.completion}%` }}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-[10px] font-bold shrink-0",
                        b.completion === 100
                          ? "text-[#16a34a]"
                          : b.completion >= 60
                            ? "text-[#eab308]"
                            : "text-[#dc2626]",
                      )}
                    >
                      {b.completion}%
                    </span>
                  </div>
                </td>
                <td className="py-3.5">
                  <AdminStatusBadge status={b.status} />
                </td>
                <td className="py-3.5 font-bold text-[#1a1a2e]">
                  {b.campaigns}
                </td>
                <td className="py-3.5 font-medium text-[#9a99b0]">
                  {b.joined}
                </td>
                <td className="py-3.5 text-right pr-2">
                  <button
                    onClick={() => setSelectedBrandId(b.id)}
                    className="p-1.5 hover:bg-[#f4f3f6] rounded-lg transition-colors cursor-pointer inline-flex items-center gap-1 text-[10px] font-bold text-brand-pink"
                  >
                    <Eye size={12} /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Brand Profile Drawer */}
      {selectedBrandId && (
        <BrandProfileDrawer
          isOpen={selectedBrandId !== null}
          onClose={() => setSelectedBrandId(null)}
          brandId={selectedBrandId}
        />
      )}
    </section>
  );
}
