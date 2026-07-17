"use client";

import { useState } from "react";
import { Search, Eye, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { AdminStatusBadge } from "../AdminStatusBadge";
import BrandProfileDrawer from "./BrandProfileDrawer";

interface BrandItem {
  id: string;
  advertiserId: string;
  name: string;
  repName: string;
  repEmail: string;
  industry: string;
  location: string;
  completion: number;
  status: "Active" | "Pending" | "Suspended";
  totalSpend: number;
  campaigns: number;
  joined: string;
  lastLogin: string;
}

const MOCK_BRANDS: BrandItem[] = [
  {
    id: "1",
    advertiserId: "ADV-2061",
    name: "Pepsi Nigeria",
    repName: "Emeka Obi",
    repEmail: "emeka@pepsi.ng",
    industry: "Beverages",
    location: "Lagos, Nigeria",
    completion: 100,
    status: "Active",
    totalSpend: 15400000,
    campaigns: 14,
    joined: "Oct 15, 2023",
    lastLogin: "3 hours ago",
  },
  {
    id: "2",
    advertiserId: "ADV-4092",
    name: "Coca-Cola",
    repName: "Sarah Alabi",
    repEmail: "sarah@coke.ng",
    industry: "Beverages",
    location: "Abuja, Nigeria",
    completion: 80,
    status: "Active",
    totalSpend: 12100000,
    campaigns: 9,
    joined: "Jan 10, 2024",
    lastLogin: "1 day ago",
  },
  {
    id: "3",
    advertiserId: "ADV-1083",
    name: "Flutterwave",
    repName: "Tunde Cole",
    repEmail: "tunde@flutterwave.com",
    industry: "Tech",
    location: "Lagos, Nigeria",
    completion: 100,
    status: "Active",
    totalSpend: 28900000,
    campaigns: 24,
    joined: "Jun 22, 2024",
    lastLogin: "Just now",
  },
  {
    id: "4",
    advertiserId: "ADV-8891",
    name: "Paystack",
    repName: "Chioma Nze",
    repEmail: "chioma@paystack.com",
    industry: "Tech",
    location: "Lagos, Nigeria",
    completion: 100,
    status: "Active",
    totalSpend: 31200000,
    campaigns: 19,
    joined: "Aug 05, 2024",
    lastLogin: "5 hours ago",
  },
  {
    id: "5",
    advertiserId: "ADV-0925",
    name: "MTN Nigeria",
    repName: "Kunle Adeniyi",
    repEmail: "kunle@mtn.ng",
    industry: "Telecom",
    location: "Abuja, Nigeria",
    completion: 60,
    status: "Pending",
    totalSpend: 4500000,
    campaigns: 2,
    joined: "Dec 18, 2025",
    lastLogin: "2 days ago",
  },
  {
    id: "6",
    advertiserId: "ADV-1526",
    name: "Guinness Nigeria",
    repName: "Bisi Akande",
    repEmail: "bisi@guinness.ng",
    industry: "Beverages",
    location: "Lagos, Nigeria",
    completion: 100,
    status: "Active",
    totalSpend: 9800000,
    campaigns: 11,
    joined: "Nov 01, 2024",
    lastLogin: "12 hours ago",
  },
  {
    id: "7",
    advertiserId: "ADV-7431",
    name: "PiggyVest",
    repName: "Odun Eweniyi",
    repEmail: "odun@piggyvest.com",
    industry: "Tech",
    location: "Lagos, Nigeria",
    completion: 40,
    status: "Suspended",
    totalSpend: 1500000,
    campaigns: 1,
    joined: "Feb 14, 2025",
    lastLogin: "1 week ago",
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
      !b.repName.toLowerCase().includes(search.toLowerCase()) &&
      !b.advertiserId.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    if (selectedIndustry && b.industry !== selectedIndustry) return false;
    if (selectedCompletion) {
      const numeric = parseInt(selectedCompletion);
      if (b.completion !== numeric) return false;
    }
    if (selectedStatus && b.status !== selectedStatus) return false;
    if (selectedCountry && !b.location.includes(selectedCountry)) return false;
    return true;
  });

  return (
    <section className="bg-white border border-[#e8e6f0]/60 rounded-3xl p-6 flex flex-col gap-5">
      <div className="flex items-center gap-1 bg-[#f4f3f6] border border-[#e8e6f0]/80 p-1 rounded-xl w-fit self-start max-w-full overflow-x-auto scrollbar-none">
        {(["All", "Active", "Suspended", "Pending"] as const).map((tab) => {
          const active = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                "px-4.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
                active
                  ? "bg-brand-pink text-white shadow-sm"
                  : "bg-transparent text-[#5a5a7a] hover:text-[#1a1a2e]",
              )}
            >
              {tab}
            </button>
          );
        })}
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
              <th className="pb-3.5 pl-2">Advertiser ID</th>
              <th className="pb-3.5">Advertiser</th>
              <th className="pb-3.5">Representative</th>
              <th className="pb-3.5">Industry</th>
              <th className="pb-3.5">Location</th>
              <th className="pb-3.5">Profile Completion</th>
              <th className="pb-3.5">Status</th>
              <th className="pb-3.5">Total Spend</th>
              <th className="pb-3.5">Campaigns</th>
              <th className="pb-3.5">Join Date</th>
              <th className="pb-3.5">Last login</th>
              <th className="pb-3.5 text-right pr-2">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e8e6f0]/30 text-xs">
            {filtered.map((b) => (
              <tr
                key={b.id}
                className="hover:bg-[#faf9fc]/40 transition-colors"
              >
                <td className="py-3.5 pl-2 text-[#5a5a7a] font-medium">
                  {b.advertiserId}
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-brand-pink/5 text-brand-pink font-bold flex items-center justify-center border border-brand-pink/10 shrink-0 text-[10px] uppercase">
                      {b.name.substring(0, 2)}
                    </div>
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
                <td className="py-3.5 font-semibold text-[#1a1a2e] whitespace-nowrap">
                  ₦{b.totalSpend.toLocaleString()}
                </td>
                <td className="py-3.5 font-bold text-[#1a1a2e]">
                  {b.campaigns}
                </td>
                <td className="py-3.5 font-medium text-[#9a99b0]">
                  {b.joined}
                </td>
                <td className="py-3.5 font-medium text-[#9a99b0] whitespace-nowrap">
                  {b.lastLogin}
                </td>
                <td className="py-3.5 text-right pr-2">
                  <button
                    onClick={() => setSelectedBrandId(b.id)}
                    className="h-8 px-3.5 bg-[#eff6ff] text-[#2563eb] rounded-xl hover:bg-[#dbeafe] transition-all cursor-pointer inline-flex items-center justify-center gap-1.5 text-[10px] font-bold shrink-0"
                  >
                    <Eye size={12} className="shrink-0" /> View
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
